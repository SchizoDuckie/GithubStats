angular.module('GithubMon.settings', [])

/**
 * Wrapper from accessing and requesting chrome permissions
 */
.factory('ChromePermissions', function($q) {
    var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1,
        isExtension = (('chrome' in window) && ('permissions' in chrome)),
        isOpera = navigator.vendor.toLowerCase().indexOf('opera');

    var service = {
        /**
         * Storage sync only supported in chrome extensions
         */
        isSupported: function() {
            return isChrome && isExtension;
        },
        /**
         * Verify that a permission is available in chrome
         */
        checkGranted: function(permission) {
            return $q(function(resolve, reject) {
                console.info('Verify if permission is granted', permission);

                if (!service.isSupported()) {
                    console.info('Nope, not chrome or an extension');
                    reject();
                }
                chrome.permissions.contains({
                    permissions: [permission]
                }, function(supported) {
                    console.info(supported ? 'Permission ' + permission + ' granted.' : 'Permission ' + permission + ' denied.');
                    (supported && 'sync' in chrome.storage) ? resolve() : reject();
                });
            });
        },
        requestPermission: function(permission) {
            return $q(function(resolve, reject) {
                console.info('Request permission', permission);

                if (!service.isSupported()) {
                    console.info('Nope, not chrome or an extension');
                    reject();
                }
                chrome.permissions.request({
                    permissions: [permission]
                }, function(granted) {
                    console.info(granted ? 'Permission ' + permission + ' granted.' : 'Permission ' + permission + ' denied.');
                    (granted) ? resolve() : reject();
                });
            });

        },
        revokePermission: function(permission) {
            return $q(function(resolve, reject) {
                console.info('Revoke permission', permission);

                if (!service.isSupported()) {
                    console.info('Nope, not chrome or an extension');
                    reject();
                }
                chrome.permissions.request({
                    permissions: [permission]
                }, function(result) {
                    console.info(result ? 'Permission ' + permission + ' revoked.' : 'Permission ' + permission + ' not revoked.');
                    (result) ? resolve() : reject();
                });
            });

        }
    };

    return service;



})
/**
 * The Settings Service stores user preferences and provides defaults.
 * Storage is in localStorage. values get serialized on save and deserialized on initialization.
 *
 * Shorthands to the get and set functions are provided in $rootScope by the getSetting and setSetting functions
 */
.factory('SettingsService', function($injector, $rootScope, ChromePermissions) {
    var service = {
        settings: {},
        defaults: {
            'github.repos': ['SchizoDuckie/DuckieTV']
        },

        /**
         * Read a setting key and return either the stored value or the default
         * @param  string key to read
         * @return mixed value value of the setting
         */
        get: function(key) {
            return ((key in service.settings) ? service.settings[key] : (key in service.defaults) ? service.defaults[key] : false);
        },

        /**
         * Store a value in the settings object and persist the changes automatically.
         * @param string key key to store
         * @param mixed value to store
         */
        set: function(key, value) {
            service.settings[key] = value;
            service.persist();
        },

        /**
         * Serialize the data and persist it in localStorage
         */
        persist: function() {
            localStorage.setItem('userPreferences', angular.toJson(service.settings, true));
        },

        /**
         * Fetch stored series from sqlite and store them in service.favorites
         * Notify anyone listening by broadcasting favorites:updated
         */
        restore: function() {
            if (!localStorage.getItem('userPreferences')) {
                service.settings = service.defaults;
            } else {
                service.settings = angular.fromJson(localStorage.getItem('userPreferences'));
            }
        }
    }

    service.restore();
    return service;
});