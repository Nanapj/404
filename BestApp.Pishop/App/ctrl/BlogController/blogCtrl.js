'use strict';
angular.module('app')
    .controller('BlogCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', 'blockUI', function ($scope, $state, $stateParams, $http, toaster, blockUI){
        var _url = "/odata/BlogPSs";
        var vm = this;
        vm.model = {};
        vm.access_token = localStorage.getItem('access_token');
        vm.selectedBlog = {};
        vm.toolbarTemplate = toolbarTemplate;
        vm.create = create;
        vm.edit = edit;
        vm.destroy = destroy;
        vm.blogBack = blogBack ;
        var blockui = blockUI.instances.get('BlockUI');
        function create(){
            $state.go('app.blog.create');
            vm.editMode = false;
        }
        function toolbarTemplate() {
            return kendo.template($("#toolbar").html());
        }
        function edit(){
            if(vm.selectedBlog.ID !== undefined && vm.selectedBlog.ID !== "") {
                console.log(vm.selectedBlog.ID);
                $state.go('app.blog.edit', {
                    ID: vm.selectedBlog.ID
                });
            } else {
                toaster.pop('info', "Chưa chọn", "Vui lòng chọn phòng ban");
            }
        }
        function blogBack() {
            $state.go('app.blog.index');
        }
        vm.createSubmit = function() {
            blockui.start();
            if((vm.model.Category != "" && vm.model.Category != null) 
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
                      toaster.pop('success', "Thành công", "Đã tạo chủ đề mới");
                      $state.go('app.blog.index');
                      blockui.stop();
                  }
              });
    
            } else {
               toaster.pop('warning', "Rỗng tên", "Vui lòng điền chủ đề");
               blockui.stop();
            }
           
        }
        function destroy(){
            if(vm.selectedBlog.ID != undefined && vm.selectedBlog.ID != null) {
                swal({
                   title: "Xác nhận xóa?",
                   text: "Bạn có chắc xóa chủ đề",
                   icon: "warning",
                   buttons: true,
                   dangerMode: true,
                })
                .then((willDelete) => {
                   if (willDelete) {
                         //   swal("Poof! Your imaginary file has been deleted!", {
                         //     icon: "success",
                         //   });
                         $http({
                             method: 'DELETE',
                             url: _url+'(' + vm.selectedBlog.ID +')',
                             headers: {
                                 'Content-Type': 'application/json',
                                 'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                             },
                         }).then(function successCallback(response) {
                             toaster.pop('success', "Thành công", "Đã xóa thông tin chủ đề");
                             $('#blogGrid').data('kendoGrid').dataSource.read().then(function(){
                                 $('#blogGrid').data('kendoGrid').refresh();
                             });
                         });
                   
                   } else {
                   
                   }
                });
            } else {
             toaster.pop('warning', "Chưa chọn", "Không có thông tin nào được chọn");
            }
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
                    field: "Category",
                    title: "Tên chủ đề",
                    width: "50px"
                },
                {
                    field: "Note",
                    title: "Ghi chú",
                    width: "50px"
                }
            ]
        };
        function onDataBound(e) {
            this.expandRow(this.tbody.find("tr.k-master-row").first());
        }
        function onChange(e) {
            var grid = $('#blogGrid').data('kendoGrid');
            var selectedItem = grid.dataItem(grid.select());
            console.log(selectedItem);
            vm.selectedBlog = selectedItem;
        }

    }
]);