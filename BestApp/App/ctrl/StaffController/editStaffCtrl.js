'use strict';


angular.module('app')
    .controller('EditStaffCtrl', ['$scope', '$state', '$stateParams', '$http', function ($scope, $state, $stateParams, $http, $rootScope){
        var _url = "/odata/Staffs";
        var vm = this;
        vm.access_token = localStorage.getItem('access_token');
        vm.model = {};
        vm.selectedStaff = {};
        vm.model.HasAccount = false;
        $scope.initStaffEdit = function() {
            $http({
                method: 'GET',
                url: _url+'?$filter=Id eq ' + $stateParams.Id.replace(/['"]+/g, ''),
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
                    alert('Không tìm thấy kết quả');
                  }
                
                }, function errorCallback(response) {
                  console.log(response);
            });
        }
        $scope.initStaffEdit();

        vm.editSubmit = function() {
            $http({
                url: _url+'('+ $stateParams.Id.replace(/['"]+/g, '') +')',
                method: 'PUT',
                data: JSON.stringify(vm.model),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                },
            }).then(function(response){
                console.log(response);
            });
        }
}]);