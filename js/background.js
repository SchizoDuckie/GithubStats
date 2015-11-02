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
    }
});