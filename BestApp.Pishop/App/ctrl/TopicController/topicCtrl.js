'use strict';
angular.module('app')
    .controller('TopicCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', 'blockUI', function ($scope, $state, $stateParams, $http, toaster, blockUI){
        var _url = "/odata/TopicPSs";
        var vm = this;
        vm.model = {};
        vm.access_token = localStorage.getItem('access_token');
        vm.selectedTopic = {};
        vm.toolbarTemplate = toolbarTemplate;
        vm.create = create;
        vm.edit = edit;
        vm.destroy = destroy;
        vm.topicBack = topicBack ;
        vm.selectedBlogData ="";
        var _blogURL = "/odata/BlogPSs";
        vm.selectedBlogData ="";
        var blockui = blockUI.instances.get('BlockUI');
        function create(){
            $state.go('app.topic.create');
            vm.editMode = false;
        }
        function toolbarTemplate() {
            return kendo.template($("#toolbar").html());
        }
        function edit(){
            // if(vm.selectedBlog.ID !== undefined && vm.selectedBlog.ID !== "") {
            //     console.log(vm.selectedBlog.ID);
            //     $state.go('app.blog.edit', {
            //         ID: vm.selectedBlog.ID
            //     });
            // } else {
            //     toaster.pop('info', "Chưa chọn", "Vui lòng chọn phòng ban");
            // }
        }
        function topicBack() {
           $state.go('app.topic.index');
        }
        vm.createSubmit = function() {
            blockui.start();
            if((vm.selectedBlogData.Category != "" && vm.selectedBlogData.Category != null && vm.model.Title != null && vm.model.Title != null&& vm.model.Content != null && vm.model.Content != null ) 
            ){
                
               $http({
                  url: _url,
                  method: 'POST',
                  data: JSON.stringify(vm.model),
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                  },
              }).then(function(response){
                  if(response.status == 201) {
                      toaster.pop('success', "Thành công", "Đã tạo bài viết mới");
                      $state.go('app.topic.index');
                      blockui.stop();
                  }
              });
    
            } else {
               toaster.pop('warning', "Thiếu thông tin", "Vui lòng điền đủ các trường");
               blockui.stop();
            }
           
        }
        function destroy(){
            // if(vm.selectedBlog.ID != undefined && vm.selectedBlog.ID != null) {
            //     swal({
            //        title: "Xác nhận xóa?",
            //        text: "Bạn có chắc xóa tiêu đề",
            //        icon: "warning",
            //        buttons: true,
            //        dangerMode: true,
            //     })
            //     .then((willDelete) => {
            //        if (willDelete) {
            //              //   swal("Poof! Your imaginary file has been deleted!", {
            //              //     icon: "success",
            //              //   });
            //              $http({
            //                  method: 'DELETE',
            //                  url: _url+'(' + vm.selectedBlog.ID +')',
            //                  headers: {
            //                      'Content-Type': 'application/json',
            //                      'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
            //                  },
            //              }).then(function successCallback(response) {
            //                  toaster.pop('success', "Thành công", "Đã xóa thông tin tiêu đề");
            //                  $('#blogGrid').data('kendoGrid').dataSource.read().then(function(){
            //                      $('#blogGrid').data('kendoGrid').refresh();
            //                  });
            //              });
                   
            //        } else {
                   
            //        }
            //     });
            // } else {
            //  toaster.pop('warning', "Chưa chọn", "Không có thông tin nào được chọn");
            // }
        }

        //data dropdownlist category blog
        vm.blogData = { 
            type: "odata-v4",
            serverFiltering: true,
            transport: {
                read: {
                    url: _blogURL,
                }
            }
        }
        $scope.onBlogSelChanged = function() {
            vm.model.BlogPSID = vm.selectedBlogData.ID;
           console.log(vm.model.BlogPSID )
            
        }

        function onDataBound(e) {
            this.expandRow(this.tbody.find("tr.k-master-row").first());
        }
        function onChange(e) {
            var grid = $('#topicGrid').data('kendoGrid');
            var selectedItem = grid.dataItem(grid.select());
            console.log(selectedItem);
            vm.selectedTopic = selectedItem;
        }
        $scope.mainGridOptions = {
            dataSource: {
                type: "odata-v4",
                transport: {
                    read: _url
                },
                pageSize: 50,
                serverPaging: true,
                serverSorting: true
            },
            sortable: true,
            pageable: true,
            refresh:true,
            height: 500,
            dataBound: onDataBound,
            change: onChange,
            columns: [
                {
                    field: "CreatDate",
                    title:"Ngày tạo",
                    width: "50px",
                    template: "#= kendo.toString(kendo.parseDate(CreatDate, 'yyyy-MM-dd'), 'dd/MM/yyyy') #"
                },
                {
                    field: "Title",
                    title: "Tiêu đề",
                    width: "50px"
                },
                {
                    field: "Decription",
                    title: "Ghi chú",
                    width: "50px"
                },
                {
                    field: "BlogCategory",
                    title: "Chủ đề",
                    width: "50px"
                }
            ]
        };
        
    }
]);    