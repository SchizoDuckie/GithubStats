/** 
 * Github API endpoint
 */
GithubStats.factory('Github', function(SettingsService, $q, $http) {
    if (!localStorage.getItem('token')) {
        token = prompt("Please enter the github auth token");
        localStorage.setItem('token', token);
    }
    var credentials = Base64.encode('SchizoDuckie:' + localStorage.getItem('token'));

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
                    Authorization: 'Basic ' + credentials
                }
            }).then(function(data) {
                return data.data;
            });
        },
        getReleases: function(name, repository) {
            return $http.get(getUrl('releases', name, repository), {
                headers: {
                    Authorization: 'Basic ' + credentials
                }
            }).then(function(data) {
                return data.data;
            });
        }
    };

    return service;
});