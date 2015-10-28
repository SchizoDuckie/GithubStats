/** 
 * Github Monitor
 */
GithubStats.factory('GithubMonitor', ["SettingsService", "Github", "$q", "$rootScope",
    function(SettingsService, Github, $q, $rootScope) {
        var service = {

            projects: [],

            add: function(username, repository) {
                for(var i = 0; i < service.projects.length; i++) {
                    if (service.projects[i].repository == repository.name && service.projects[i].username == username) {
                        console.warn("Repository already added!");
                        return;
                    }
                }
                console.log("Add project!", repository.name);
                var p = new Project();
                p.username = username;
                p.repository = repository.name;
                p.lastUpdated = new Date().getTime();
                p.Persist();
                service.projects.push(p);
                $rootScope.$broadcast("Project-Added");
            },
            read: function() {
                return $q(function(resolve, reject) {
                    CRUD.Find('Project').then(function(result) {
                        console.log("Found projects!", result, service);
                        service.projects = result;
                        resolve(result);
                    });
                });
            },
            remove: function(project) {
                service.projects.splice(service.projects.indexOf(project), 1);
                project.Delete();
            },
            initialize: function() {
                return service.read();
            }
        };

        service.initialize();
        return service;
    }
]);