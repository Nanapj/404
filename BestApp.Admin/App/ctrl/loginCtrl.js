'use strict';

angular.module('app')
    .controller('LoginCtrl', ['$scope', '$state', '$http', '$window', '$localStorage', '$rootScope', 'toaster', function ($scope, $state, $http, $window, $localStorage, $rootScope,toaster){
        var vm = this;
        vm.user = {};
        $scope.actions = [
            { text: 'Thử lại', function() { vm.dialogVisible = false;} }
        ];
        vm.dialogVisible = false;
        // Delete local
        localStorage.removeItem("UserLogged");
        localStorage.removeItem("access_token");

        $rootScope.IsAuthenticated = false;
        $rootScope.UserLogged = {};
        $rootScope.AgencyLogged = {};
        $rootScope.Agencies = {};
        $rootScope.UserName = {};

        vm.login = function(){
           
            vm.user.RememberMe = true;
            $http({
                url: '/account/login',
                method: 'POST',
                data: JSON.stringify(vm.user),
            }).then(function(response){
                if(response.data == true){
                    $http({
                        url: '/Token',
                        method: 'POST',
                        data: "UserName=" + vm.user.email + "&Password=" + vm.user.password + "&grant_type=" + 'password'
                    }).then(function(response){
                        console.log(response);
                        debugger;
                        $rootScope.UserLogged = response.data.userName;
                        $rootScope.access_token = response.data.access_token;
                        $rootScope.expiredDate = response.data['.expires'];
                        $rootScope.UserName = response.data['userName'];
                        // Save to local
                        localStorage.setItem("UserLogged", JSON.stringify($rootScope.UserLogged));
                        localStorage.setItem("access_token", JSON.stringify($rootScope.access_token));
                        localStorage.setItem(".expires", JSON.stringify($rootScope.expiredDate));
                        localStorage.setItem("userName", JSON.stringify($rootScope.UserName));
                        $state.go('app.dashboard');
                    });
                }else{
                    swal("Opps...", "Wrong email or password or you're banned", "error");
                }
            });
        }
}]);