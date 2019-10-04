'use strict';

angular.module('app')
    .controller('LoginCtrl', ['$scope', '$state', '$http', '$window', '$localStorage', '$rootScope', function ($scope, $state, $http, $window, $localStorage, $rootScope){
        console.log('LoginCtrl loaded!');
        var vm = this;
        vm.user = {};

        // Delete local
        localStorage.removeItem("UserLogged");
        localStorage.removeItem("access_token");

        $rootScope.IsAuthenticated = false;
        $rootScope.UserLogged = {};
        $rootScope.AgencyLogged = {};
        $rootScope.Agencies = {};

        vm.login = function(){
            vm.user.RememberMe = true;
            $http({
                url: '/account/login',
                method: 'POST',
                data: JSON.stringify(vm.user),
            }).then(function(response){
                console.log(response);
                if(response.data == true){
                    $http({
                        url: '/Token',
                        method: 'POST',
                        data: "UserName=" + vm.user.email + "&Password=" + vm.user.password + "&grant_type=" + 'password'
                    }).then(function(response){
                        console.log(response)
                        $rootScope.UserLogged = response.data.userName;
                        $rootScope.access_token = response.data.access_token;

                        // Save to local
                        localStorage.setItem("UserLogged", JSON.stringify($rootScope.UserLogged));
                        localStorage.setItem("access_token", JSON.stringify($rootScope.access_token));

                        $state.go('app.dashboard');
                    });
                }else{
                    alert("Sai username hoặc password!");
                }
            });
        }
}]);