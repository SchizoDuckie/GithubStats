GithubStats.directive('githubRelease', function($timeout) {
    return {
        restrict: 'E',
        transclude: false,
        replace: true,
        scope: {
            'release': '=data'
        },
        templateUrl: "templates/githubRelease.html",
        link: function($scope, $element, $attr) {
            // Fade in nice and pretty :), needs a timeout cause #domloadingissues
            $timeout(function() {
                $element.css({'opacity': '1'});
            }, 0);
        }
    };
});