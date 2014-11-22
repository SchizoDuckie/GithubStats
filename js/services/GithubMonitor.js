angular.module('GithubMon.monitor', ['GithubMon.settings', 'GithubMon.providers'])

/** 
 * Github API endpoint
 */
.factory('GithubMonitor', function(SettingsService, Github, $q) {


    var service = {

        projects: [],

        add: function(username, repository) {
            console.log("Add project!");
            var p = new Project();
            p.username = username;
            p.repository = repository.name;
            p.lastUpdated = new Date().getTime();
            p.Persist();
            service.projects.push(p);
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
        },

    };


    service.initialize();
    return service;
});