chrome.runtime.onInstalled.addListener(function(details) {
    localStorage.setItem('runtime.event', angular.toJson(details, true));
    if (details.reason == "install") {
        console.log("This is a first install!");
        localStorage.setItem('upgrade.notify', chrome.runtime.getManifest().version);
        /*
        * example: localStorage.setItem('0.54.createtimers', 'done');
        */
    } else if (details.reason == "update") {
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
        if(details.previousVersion != thisVersion) {
            localStorage.setItem('upgrade.notify', thisVersion);
        }
    };
   
});

/**
 * Handle global dependencies
 */
angular.module('GithubMon', [
    'GithubMon.settings'
])

/**
 * Set up the xml interceptor and whitelist the chrome extension's filesystem and magnet links
 */
.config(function($httpProvider, $compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|magnet|data):/);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file):|data:image|filesystem:chrome-extension:/);
})


.run(function(SettingsService) {

    $rootScope.getSetting = function(key) {
        return SettingsService.get(key);
    };
   
});

// Since there is no html document that bootstraps angular using an ang-app tag, we need to call bootstrap manually
angular.bootstrap(document, ['GithubMon']);
