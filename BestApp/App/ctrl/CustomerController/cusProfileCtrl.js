'use strict';
angular.module('app')
    .controller('cusProfileCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', function ($scope, $state, $stateParams, $http, toaster){
        var vm = this;
        var _urlCus = "/odata/Customers";
        var _crEventURL = "/odata/Events";
        vm.access_token = localStorage.getItem('access_token');
        vm.model = {};
        vm.customer = {};
        vm.model.HasAccount = false;
        $scope.initStaffEdit = function() {
            $http({
                method: 'GET',
                url: _urlCus+'?$filter=ID eq ' + $stateParams.ID.replace(/['"]+/g, ''),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                },
              }).then(function successCallback(response) {
                  if(response.data.value.length > 0) { 
                    var customer = response.data.value[0];
                    vm.customer = customer;
                    vm.customer.Birthday = moment(vm.customer.Birthday).format("DD/MM/YYYY");
                  } else 
                  {
                    toaster.pop('warning', "Rỗng", "Không tìm thấy thông tin nhân viên");
                  }
                
                }, function errorCallback(response) {
                  console.log(response);
            });
        }
        $scope.initStaffEdit();
    }
]);