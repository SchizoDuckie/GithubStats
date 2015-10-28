GithubStats.directive('usernameExistsValidator', ["Github", 
    function(Github) {
        return {
            require: 'ngModel',
            link: function($scope, element, attrs, ngModel) {
                ngModel.$asyncValidators.usernameExists = function(username) {
                    console.log('validating!', username);
                    return Github.getRepositories(username);
                };
            }
        };
    }
])

.controller('FormCtrl', ["Github", "GithubMonitor",
    function(Github, GithubMonitor) {
        console.log("creating formctrl!");
        this.username = 'SchizoDuckie';
        this.repository = false;
        this.repositories = [];

        this.valueChanged = function() {
            this.getRepositories(this.username);
        };

        this.getRepositories = function(username) {
            console.log("Get repositories for (onchange)", this.username);
            Github.getRepositories(username).then(function(data) {
                console.log('repositories fetched for in model:', data);
                this.repositories = data;
            }.bind(this));
        };

        this.submit = function(isValid) {
            if (!isValid) return;
            console.warn("Form submitted!", this.username, this.repository);
            GithubMonitor.add(this.username, this.repository);
        };

        this.valueChanged();
    }
])

.controller('HomeCtrl', ["$rootScope", "SettingsService", "Github", "GithubMonitor",
    function($rootScope, SettingsService, Github, GithubMonitor) {

        var vm = this;

        this.repos = [];
        this.releases = [];

        this.getReleases = function() {
            vm.releases = [];
            GithubMonitor.read().then(function() {
                vm.projects = GithubMonitor.projects;
                GithubMonitor.projects.map(function(project) {
                    Github.getReleases(project.username, project.repository).then(function(result) {
                        console.log("Fetched release for", project.repository, result);
                        result.map(function(release) {
                            release.username = project.username;
                            release.repository = project.repository;
                            release.assets.sort(function(a, b) {
                                return a.download_count < b.download_count;
                            });
                            vm.releases.push(release);
                        });
                    });
                });
            });
        };

        console.log("Repos:", this.projects);
        this.add = function() {
            GithubMonitor.add(user, repo);
        };

        this.remove = function(project) {
            GithubMonitor.remove(project);
        };

        this.getTotal = function(release) {
            console.log("Get total for Release:", release.name);
            var count = 0;
            if (release.assets) {
                release.assets.map(function(asset) {
                    count += asset.download_count;
                });
            }
            return count;
        };

        $rootScope.$on("Project-Added", this.getReleases);

        this.getReleases();
    }
]);