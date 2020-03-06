'use strict';


angular.module('app')
    .controller('EditStaffCtrl', ['$scope','$state', '$stateParams', '$http', 'toaster', 'blockUI', function ($scope, $state, $stateParams, $http, toaster,blockUI){
        var _url = "/odata/Staffs";
        var vm = this;
        vm.access_token = localStorage.getItem('access_token');
        vm.model = {};
        vm.model.HasAccount = false;
        var editBlock = blockUI.instances.get('EditBlockUI');
        vm.editStaffBack = editStaffBack;
        function editStaffBack() {
            $state.go('app.staff.index');
        }
        $scope.initStaffEdit = function() {
            $http({
                method: 'GET',
                url: _url+'?$filter=ID eq ' + $stateParams.ID.replace(/['"]+/g, ''),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                },
              }).then(function successCallback(response) {
                  if(response.data.value.length > 0) { 
                    var staff = response.data.value[0];
                    vm.model = staff;
                  } else 
                  {
                    toaster.pop('warning', "Rỗng", "Không tìm thấy thông tin nhân viên");
                  }
                
                }, function errorCallback(response) {
                  console.log(response);
            });
        }
        $scope.initStaffEdit();
        vm.editSubmit = function() {
            editBlock.start();
            $http({
                url: _url+'('+ $stateParams.ID.replace(/['"]+/g, '') +')',
                method: 'PUT',
                data: JSON.stringify(vm.model),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                },
            }).then(function(response){
                if(response.status == 204) {
                    editBlock.stop();
                    $state.go('app.staff.index');
                    toaster.pop('success', "Thành công", "Đã cập nhật xong");
                } else {
                    toaster.pop('error', "Lỗi", "Có lỗi trong quá trình cập nhật");
                }
            });
        }
}]);