(function(window, angular, undefined){
    angular.module('app')
    .service('userSvc', [function(){
        var vm = this;
        vm.token = undefined;
        vm.user = undefined;
        
        var cachedToken = localStorage.getItem('token');
        var cachedUser  = localStorage.getItem('user');
        
        
        if (cachedToken){
            vm.token = JSON.parse(cachedToken);
            vm.user  = JSON.parse(cachedUser);
        }
        
    }]);
})(window, window.angular)