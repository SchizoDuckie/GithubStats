angular.module('GithubMon.controllers', ['GithubMon.settings', 'GithubMon.providers'])

.controller('HomeCtrl', function($scope, SettingsService, Github) {

    $scope.repos = [];
    $scope.releases = [];
    /*
    Github.getRepositories('SchizoDuckie').then(function(result) {
        $scope.repos = result;
    });

*/
    Github.getReleases('SchizoDuckie', 'DuckieTV').then(function(result) {
        $scope.releases = result;
    });

});