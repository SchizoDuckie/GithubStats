var app = angular.module('GithubMon.controllers', ['GithubMon.settings', 'GithubMon.providers', 'GithubMon.monitor']);

app.directive('usernameExistsValidator', function(Github) {
    return {
        require: 'ngModel',
        link: function($scope, element, attrs, ngModel) {
            ngModel.$asyncValidators.usernameExists = function(username) {
                console.log('validating!', username);
                return Github.getRepositories(username);
            };
        }
    };
});

app.controller('FormCtrl', function($scope, Github, GithubMonitor) {
    console.log("creating formctrl!");
    this.username = 'SchizoDuckie';
    this.repository = false;
    this.repositories = [];

    this.valueChanged = function() {
        this.getRepositories(this.username)
    };

    this.repoChanged = function(value) {}

    this.getRepositories = function(username) {
        console.log("Get repositories for (onchange)", this.username);
        Github.getRepositories(username).then(function(data) {
            console.log('repositories fetched for in model:', data);
            this.repositories = data;
        }.bind(this));
    };


    this.submit = function(isValid, data) {
        if (!isValid) return;
        console.log("Form submitted!", this.username, this.repository);
        GithubMonitor.add(this.username, this.repository);
        //submit the data to the server
    };

});

app.controller('HomeCtrl', function($scope, SettingsService, Github, GithubMonitor) {

    $scope.repos = [];
    $scope.releases = [];

    GithubMonitor.read().then(function() {
        $scope.projects = GithubMonitor.projects;
        GithubMonitor.projects.map(function(project) {
            Github.getReleases(project.username, project.repository).then(function(result) {
                console.log("Fetched release for ", project, result);
                result.map(function(release) {
                    release.assets.sort(function(a, b) {
                        return a.download_count < b.download_count;
                    });
                    $scope.releases.push(release);
                });

            });
        });


    });
    console.log("Repos:", $scope.projects);
    $scope.add = function() {
        GithubMonitor.add(user, repo);
    };

    $scope.remove = function(project) {
        GithubMonitor.remove(project);
    };


    $scope.getTotal = function(release) {
        console.log("Get total for Release:", release);
        var count = 0;
        if (release.assets) {
            release.assets.map(function(asset) {
                count += asset.download_count;
            });
        }
        return count;
    };

});