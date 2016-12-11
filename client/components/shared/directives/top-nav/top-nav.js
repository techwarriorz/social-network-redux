(function(window, angular, undefined){
    angular.module('app')
    .directive('topNav', [function(){
        return {
            restrict: 'E',
            scope: {},
            templateUrl: '/client/components/shared/directives/top-nav/top-nav.html',
            link: function(scope, elem, attrs){
                
            }
        }
    }])
})(window, window.angular)