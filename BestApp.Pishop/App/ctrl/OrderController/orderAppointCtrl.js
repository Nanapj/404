'use strict';


angular.module('app')
    .controller('OrderAppointCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', 'blockUI', function ($scope, $state, $stateParams, $http, toaster, blockUI) {
        var _url = "/odata/Orders";
        var vm = this;
        vm.access_token = localStorage.getItem('access_token');
        vm.model = {};
        var editBlock = blockUI.instances.get('BlockUI');
        vm.orderBack = orderBack;
        function orderBack() {
            $state.go('app.order.index');
        }
        $scope.initOrder = function () {
            
            $http({
                method: 'GET',
                url: _url + '?$filter=ID eq ' + $stateParams.ID.replace(/['"]+/g, ''),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + vm.access_token.replace(/['"]+/g, '')
                },
            }).then(function successCallback(response) {
                if (response.data.value.length > 0) {
                    var order = response.data.value[0];
                    vm.model = order;
                    console.log(vm.model);
                } else {
                    toaster.pop('warning', "Rỗng", "Không tìm thấy thông tin đơn hàng");
                }

            }, function errorCallback(response) {
                console.log(response);
            });
        }
        $scope.initOrder();

        vm.appointSubmit = function () {
            //update status order 
            vm.model.ID = $stateParams.ID.replace(/['"]+/g, '');
            vm.model.StatusOrder = 0; //pending
            $http({
                method: 'PUT',
                url: "Json/UpdateStatusOrder",
                data: JSON.stringify(vm.model),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + vm.access_token.replace(/['"]+/g, '')
                },
            }).then(function successCallback(response) {
                toaster.pop('success', "Thành công", "Hẹn lại thành công");
                $state.go('app.order.index');
                
            });
        }
        vm.cancelSubmit = function () {
            //update status order 
            vm.model.ID = $stateParams.ID.replace(/['"]+/g, '');
            vm.model.StatusOrder = 2; //closed
            $http({
                method: 'PUT',
                url: "Json/UpdateStatusOrder",
                data: JSON.stringify(vm.model),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + vm.access_token.replace(/['"]+/g, '')
                },
            }).then(function successCallback(response) {
                toaster.pop('success', "Thành công", "Hủy đơn hàng thành công");
                $state.go('app.order.index');

            });
        }
    }]);