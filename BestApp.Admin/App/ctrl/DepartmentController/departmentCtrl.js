'use strict';

angular.module('app')
    .controller('DepartmentCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', 'blockUI', function ($scope, $state, $stateParams, $http, toaster, blockUI){
        var _url = "/odata/Departments";
        var vm = this;
        vm.model = {};
        vm.access_token = localStorage.getItem('access_token');
        vm.selectedDepartment = {};
        vm.toolbarTemplate = toolbarTemplate;
        vm.create = create;
        vm.edit = edit;
        vm.destroy = destroy;
        vm.departmentBack = departmentBack ;
        var blockui = blockUI.instances.get('BlockUI');

        function toolbarTemplate() {
            return kendo.template($("#toolbar").html());
        }
        function create(){
            $state.go('app.department.create');
            vm.editMode = false;
        }

        function edit(){
            if(vm.selectedDepartment.ID !== undefined && vm.selectedDepartment.ID !== "") {
                $state.go('app.department.edit', {
                    ID: vm.selectedDepartment.ID
                });
            } else {
                toaster.pop('info', "Chưa chọn", "Vui lòng chọn phòng ban");
            }
        }

        function destroy(){
           if(vm.selectedDepartment.ID != undefined && vm.selectedDepartment.ID != null) {
               swal({
                  title: "Xác nhận xóa?",
                  text: "Bạn có chắc xóa phòng ban",
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
                            url: _url+'(' + vm.selectedDepartment.ID +')',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                            },
                        }).then(function successCallback(response) {
                            toaster.pop('success', "Thành công", "Đã xóa thông tin phòng ban");
                            $('#departmentGrid').data('kendoGrid').dataSource.read().then(function(){
                                $('#departmentGrid').data('kendoGrid').refresh();
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
                    field: "Name",
                    title: "Tên phòng ban",
                    width: "50px"
                }
            ]
        };
        function onDataBound(e) {
            this.expandRow(this.tbody.find("tr.k-master-row").first());
        }
        function onChange(e) {
            var grid = $('#departmentGrid').data('kendoGrid');
            var selectedItem = grid.dataItem(grid.select());
            console.log(selectedItem);
            vm.selectedDepartment = selectedItem;
        }
        function customBoolEditor(container, options) {
            var guid = kendo.guid();
            $('<input class="k-checkbox" id="' + guid + '" type="checkbox" name="Discontinued" data-type="boolean" data-bind="checked:Discontinued">').appendTo(container);
            $('<label class="k-checkbox-label" for="' + guid + '">&#8203;</label>').appendTo(container);
        }
        function departmentBack() {
            $state.go('app.department.index');
        }
        vm.createSubmit = function() {
            blockui.start();
            if((vm.model.Name != "" && vm.model.Name != null) 
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
                      toaster.pop('success', "Thành công", "Đã tạo thông tin phòng ban");
                      $state.go('app.department.edit', {
                        ID: response.data.ID
                    });
                      blockui.stop();
                  }
              });

            } else {
               toaster.pop('warning', "Rỗng tên", "Vui lòng điền tên phòng ban");
               blockui.stop();
            }
           
         }
    }
]);