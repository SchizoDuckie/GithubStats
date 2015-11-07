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
                //console.log('repositories fetched for in model:', data);
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

.controller('HomeCtrl', ["$rootScope", "SettingsService", "Github", "GithubMonitor", "$timeout",
    function($rootScope, SettingsService, Github, GithubMonitor, $timeout) {

        var vm = this;

        this.getProjects = function() {
            return GithubMonitor.projects;
        }

        /**
         * Refreshes the project list and forces Github Monitor to fetch new release statistics
         */
        this.refresh = function() {
            GithubMonitor.refresh();
        };

        /** 
         * Removes a repo being watched and refreshes the list
         */
        this.remove = function(project) {
            GithubMonitor.remove(project);
        };

        // Update list on db-refresh broadcast
        $rootScope.$on("db-refresh");
    }
]);