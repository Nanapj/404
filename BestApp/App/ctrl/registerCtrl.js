'use strict';

angular.module('app')
    .controller('RegisterCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){
        console.log('register loaded!');
        var vm = this;
        vm.user = {};
        vm.signup = function(){
            vm.user.ConfirmPassword = vm.user.password;
            $http({
                url: '/account/register',
                method: 'POST',
                data: JSON.stringify(vm.user),
            }).then(function(){
                window.location = '/#/account/login';
            });
        }
}]);