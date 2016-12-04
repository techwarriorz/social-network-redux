(function(window, angular, undefined){
    angular.module('app').controller('mainCtrl', ['$scope', '$state', '$http', 'userSvc', function($scope, $state, $http, userSvc){
        $scope.userData = userSvc.user;
        
        $http({
            method: "GET",
            url: '/secure-api/user/get_friends',
            headers: {
                'auth-token': userSvc.token
            }
        }).then(function(response){
            console.log(response)
        }, function(err){
            console.err(err)
        })
    }]);
})(window, window.angular)