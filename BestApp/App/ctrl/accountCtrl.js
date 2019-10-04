'use strict';

angular.module('app')
    .controller('accountCtrl', ['$scope', '$state', '$http', '$localStorage', '$rootScope', function ($scope, $state, $http, $localStorage, $rootScope){
        console.log('accountCtrl loaded!');
        var vm = this;
        vm.user = {};
        vm.username = $rootScope.UserLogged;
        vm.token = localStorage.getItem("access_token");
        vm.submit = function(){
            $http({
                url: '/account/ResetPassword',
                method: 'POST',
                data: JSON.stringify(vm.user),
                headers: {
                    'Authorization': 'Basic ' + vm.token.substring(1, vm.token.length-1)
                }
            }).then(function(response){
                if(response.data == true){
                    alert("Password của bạn đã được thay đổi! Yêu cầu đăng nhập lại.");
                    $state.go('account.login');
                }else{
                    alert("Yêu cầu nhập chính xác password!");
                    vm.user.NewPassword = "";
                    vm.user.ConfirmPassword = "";
                }
            });
        }
}]);