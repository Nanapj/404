'use strict';
angular.module('app')
    .controller('BlogEditCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', function ($scope, $state, $stateParams, $http, toaster){
        var _url = "/odata/BlogPSs";
        var vm = this;
        vm.access_token = localStorage.getItem('access_token');
        vm.model = {};
        vm.editBlogBack = editBlogBack;
        
        $scope.initBlog = function() {
            $http({
                method: 'GET',
                url: _url+'?$filter=Id eq ' + $stateParams.ID.replace(/['"]+/g, ''),
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
                    toaster.pop('warning', "Rỗng", "Không tìm thấy thông tin tiêu đề");
                  }
                
                }, function errorCallback(response) {
                  console.log(response);
            });
        }
        $scope.initBlog();
        function editBlogBack(){
            $state.go('app.blog.index');
        }
        vm.editSubmit = function() {
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
                    toaster.pop('success', "Thành công", "Đã cập nhật xong");
                    $state.go('app.blog.index');
                } else {
                    toaster.pop('error', "Lỗi", "Có lỗi trong quá trình cập nhật");
                }
            });
        }
    }
]);