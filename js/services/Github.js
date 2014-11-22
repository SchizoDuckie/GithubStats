angular.module('GithubMon.providers', ['GithubMon.settings'])

/** 
 * Github API endpoint
 */
.factory('Github', function(SettingsService, $q, $http) {

    var activeRequest = false;

    var endpoints = {
        repos: 'https://api.github.com/users/%s/repos',
        releases: 'https://api.github.com/repos/%s/%s/releases'
    };

    /** 
     * Get one of the urls from the endpoint and replace the parameters in it when provided.
     */
    var getUrl = function(type, param, param2) {
        var out = endpoints[type].replace('%s', encodeURIComponent(param));
        return (param2) ? out.replace('%s', encodeURIComponent(param2)) : out;
    };


    var service = {


        getRepositories: function(name) {

            return $http.get(getUrl('repos', name), {
                headers: {
                    Authorization: 'Basic ' + Base64.encode('SchizoDuckie:853e095075b834f9d490ec54b1507c220b7816b0')
                }
            }).then(function(data, xhr) {
                return data.data;
            });
        },

        getReleases: function(name, repository) {

            return $http.get(getUrl('releases', name, repository), {
                headers: {

                    Authorization: 'Basic ' + Base64.encode('SchizoDuckie:853e095075b834f9d490ec54b1507c220b7816b0')

                }

            }).then(function(data) {
                return data.data;

            });
        }
    };

    return service;
});