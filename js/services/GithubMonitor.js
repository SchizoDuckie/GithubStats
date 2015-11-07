/** 
 * Github Monitor
 *
 * Provides functionality to add and remove projects
 */
GithubStats.factory('GithubMonitor', ["SettingsService", "Github", "$q", "$rootScope", "$log",
    function(SettingsService, Github, $q, $rootScope, $log) {

        function updateReleases(project) {
            return Github.getReleases(project.username, project.repository).then(function(releases) {
                console.info("Fetched release for", project.repository, releases.length, "releases");
                var r = new Stats();
                r.ID_Project = project.ID_Project;
                r.pointInTime = new Date().getTime();
                r.json = JSON.stringify(releases);
                r.Persist();
                console.info("Release stats persisted!");
                project.lastUpdated = new Date().getTime();
                project.Persist();
                console.info("Project LastUpdated... updated");
                return releases;
            });
        }
        
        var service = {
            projects: [],

            add: function(username, repository) {
                for(var i = 0; i < service.projects.length; i++) {
                    if (service.projects[i].repository == repository.name && service.projects[i].username == username) {
                        console.warn("Repository already added!");
                        return;
                    }
                }
                console.info("Adding project!", repository.name);
                var p = new Project();
                p.username = username;
                p.repository = repository.name;
                p.lastUpdated = new Date().getTime();
                p.Persist();
                console.info("Project Persisted!");
                updateReleases(p).then(function(releases) {
                    console.info("Broadcasting db-refresh");
                    service.projects.push(p);
                    $rootScope.$broadcast("db-refresh");
                });
            },
            read: function() {
                $log.debug("GithubMonitor Read");
                return $q(function(resolve, reject) {
                    CRUD.Find('Project').then(function(result) {
                        $log.log("Found projects!", result);
                        resolve(result);
                    });
                });
            },
            refresh: function() {
                $log.debug("GithubMonitor Refreshing");
                return service.read().then(function(projects) {
                    service.projects = projects;
                    return service.getReleases(projects);
                });
            },
            remove: function(project) {
                service.projects.splice(service.projects.indexOf(project), 1);
                //CRUD.executeQuery('delete from Stats where ID_Project = ' + project.ID_Project);
                project.Delete();
            },
            initialize: function() {
                $log.debug("GithubMonitor Initializing");
                return service.refresh();
            },
            getReleases: function(projects) {
                $log.debug("GithubMonitor: Getting releases");
                var out = [];

                for (var i = 0; i < projects.length; i++) {
                    var project = projects[i];
                    $log.log(projects[i].repository + ": Fetching releases");
                    project.releases = [];
                    project.total_downloads = 0;
                    project.getLatestStats().then(function(stats) {
                        $log.debug(project.repository + ": Prasing latest releases");
                        var releases = JSON.parse(stats[0].json);
                        if (releases.length === 0) {
                            project.noReleases = true;
                            $log.info(project.repository + ": Has no releases");
                            return;
                        }
                        project.releases = releases;
                        $log.debug(project.repository + ": Has releases");
                        $log.debug(project.repository + ": Counting downloads and sorting releases");
                        for (var x = 0; x < releases.length; x++) {
                            project.releases[x].download_count = 0;
                            project.releases[x].assets.map(function(asset) {
                                project.total_downloads += asset.download_count;
                                project.releases[x].download_count += asset.download_count;
                            });
                            project.releases[x].assets.sort(function(a, b) {
                                return a.download_count < b.download_count;
                            });
                        }
                        out.push(project);
                        return;
                    });
                }
                service.projects = out;
                $log.debug("GithubMonitor: Finished fetching releases");
                $log.debug(service.projects);
            }
        };

        service.initialize();
        return service;
    }
]);