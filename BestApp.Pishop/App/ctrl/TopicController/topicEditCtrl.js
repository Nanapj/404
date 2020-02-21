'use strict';
angular.module('app')
    .controller('TopicEditCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', function ($scope, $state, $stateParams, $http, toaster){
        var _url = "/odata/TopicPSs";
        var vm = this;
        vm.access_token = localStorage.getItem('access_token');
        vm.model = {};
        vm.topicBack = topicBack;
        var _blogURL = "/odata/BlogPSs";
        $scope.initTopic = function() {
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
                    vm.blogData.Category = staff.BlogCategory;
                    vm.blogData.ID = staff.BlogPSID;
                    console.log("blog" + vm.blogData.Category);
                    console.log("Topic");
                    console.log(vm.model)
                  } else 
                  {
                    toaster.pop('warning', "Rỗng", "Không tìm thấy thông tin bài viết");
                  }
                
                }, function errorCallback(response) {
                  console.log(response);
            });
        }
        $scope.onBlogSelChanged = function() {
            vm.model.BlogPSID = vm.selectedBlogData.ID;
           console.log(vm.model.BlogPSID )
            
        }
        vm.blogData = { 
            type: "odata-v4",
            serverFiltering: true,
            transport: {
                read: {
                    url: _blogURL,
                }
            }
        }
        $scope.initTopic();
        function topicBack(){
            $state.go('app.topic.index');
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
                    $state.go('app.topic.index');
                } else {
                    toaster.pop('error', "Lỗi", "Có lỗi trong quá trình cập nhật");
                }
            });
        }
    }
]);