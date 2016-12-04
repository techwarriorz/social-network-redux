(function(window, angular, undefined){
    angular.module('app').controller('mainCtrl', ['$scope', '$state', '$http', 'userSvc', function($scope, $state, $http, userSvc){
        $scope.userData = userSvc.user;
        $scope.newPost = undefined;
        $scope.userFriends = [];
        $scope.users = [];
        $scope.friendPosts = [];
        
        
        var config = {
            headers: {
                 'auth-token': userSvc.token
            } 
        }
        
        //Global Functions
        $scope.addUser = function(userId){
            var requestData = {
                'received_id': userId
            }
            
            $http.post('/secure-api/user/request_friend', requestData, config).then(function(response){
                console.log("The Friend Request was sent");
            }, function(err){
                console.err(err);
            })
            
        }
        
        $scope.respondToRequest = function(requestId, confirmation){
            var requestData = {
                'request_id': requestId,
                confirmation: confirmation
            }
            
            $http.post('/secure-api/user/request_friend_respond', requestData, config).then(function(response){
                console.log("User Added to Friends")
            }, function(err){
                console.log(err);
            })
        }
        
        $scope.submitPost = function(content){
            requestData = {
                content: content
            }
            
            $http.post('/secure-api/post/create_post', requestData, config).then(function(response){
                $scope.newPost = "";
                console.log("Post was properly submitted")
            }, function(err){
                console.error(err);
            })
        }
        
        //Get Friend Requests
        $http.get('/secure-api/user/get_friend_requests', config).then(function(response){
            $scope.friendRequests = response.data.data;
        }, function(err){
            console.error(err);
        });
        
        //Get Friend Posts
        $http.get('/secure-api/post/get_friend_posts', config).then(function(response){
            $scope.friendPosts = response.data.data;
        }, function(err){
            console.error(err);
        })
        
        //Gets Friends
        $http({
            method: "GET",
            url: '/secure-api/user/get_friends',
            headers: {
                'auth-token': userSvc.token
            }
        }).then(function(response){
            $scope.userFriends = response.data.data;
        }, function(err){
            console.err(err)
        });
        
        //Gets a List of All USers
        $http({
            method: "GET",
            url: '/secure-api/user/get_users_by_quantity',
            headers: {
                'auth-token': userSvc.token
            }
        }).then(function(response){
            $scope.users = response.data.data;
        }, function(err){
            console.err(err)
        })
        
    }]);
})(window, window.angular)