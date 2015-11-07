GithubStats.directive('githubProject', function($timeout) {
    return {
        restrict: 'E',
        transclude: false,
        replace: true,
        templateUrl: "templates/githubProject.html",
        link: function($scope, $element, $attr) {
            // Fade in nice and pretty :), needs a timeout cause #domloadingissues
            $timeout(function() {
                $element.css({'opacity': '1'});
            }, 0);
        }
    };
});