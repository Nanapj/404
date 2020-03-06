'use strict';

angular.module('app')
    .controller('StaffCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', function ($scope, $state, $stateParams, $http, toaster){
        var _url = "/odata/Staffs";
        var vm = this;
        vm.access_token = localStorage.getItem('access_token');
        vm.model = {};
        vm.selectedStaff = {};
        vm.model.HasAccount = false;
        vm.toolbarTemplate = toolbarTemplate;
        vm.create = create;
        vm.edit = edit;
        vm.destroy = destroy;
        vm.dialogVisible = false;
        vm.staffBack = staffBack;
        function staffBack() {
            $state.go('app.staff.index');
        }
        function create(){
            $state.go('app.staff.create');
            vm.editMode = false;
        }

        function edit(){
            if(vm.selectedStaff.ID !== undefined && vm.selectedStaff.ID !== "") {
                $state.go('app.staff.edit', {
                    ID: vm.selectedStaff.ID
                });
            } else {
                toaster.pop('info', "Chưa chọn", "Vui lòng chọn nhân viên");
            }
        }

        function destroy(){
            vm.dialogVisible = true;
            if(vm.selectedStaff.ID != undefined && vm.selectedStaff.ID != null) {
                swal({
                   title: "Xác nhận xóa?",
                   text: "Bạn có chắc xóa, nếu xóa thì thông tin tài khoản sẽ bị vô hiệu hóa",
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
                             url: _url+'(' + vm.selectedStaff.ID +')',
                             headers: {
                                 'Content-Type': 'application/json',
                                 'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                             },
                         }).then(function successCallback(response) {
                            $('#staffgrid').data('kendoGrid').dataSource.read();
                            $('#staffgrid').data('kendoGrid').refresh();
                             toaster.pop('success', "Thành công", "Đã xóa thông tin nhân viên và vô hiệu hóa tài khoản");
                         });
                   
                   } else {
                   
                   }
                });
            } else {
             toaster.pop('warning', "Chưa chọn", "Không có thông tin nào được chọn");
            }
        }
        function toolbarTemplate() {
            return kendo.template($("#toolbar").html());
        }

        vm.createSubmit = function () {
            if((vm.model.FullName != "" && vm.model.FullName != null) 
            && (vm.model.Phone != null && vm.model.Phone != "")
            && (vm.model.Email != null && vm.model.Email != "")
            ) {
                $http({
                    url: _url,
                    method: 'POST',
                    data: JSON.stringify(vm.model),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/, '')
                    },
                }).error(function(response) {
                    toaster.pop('error', "Thất bại", response.error.innererror.message);
                })
                .then(function(response){
                    if(response.status == 201) {
                        toaster.pop('success', "Thành công", "Đã tạo thông tin nhân viên");
                        $state.go('app.staff.index');
                    }
                });
            } else if(vm.model.FullName == "" || vm.model.FullName == null) {
                toaster.pop('warning', "Rỗng tên", "Vui lòng điền tên nhân viên");
            } else if(vm.model.Phone == "" || vm.model.Phone == null) {
                toaster.pop('warning', "Rỗng số điện thoại", "Vui lòng điền số điện thoại");
            } else if(vm.model.Email == "" || vm.model.Email == null) {
                toaster.pop('warning', "Rỗng Email", "Vui lòng điền email");
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
            height: 500,
            dataBound: onDataBound,
            change: onChange,
            columns: [
                {
                    field:"ID",
                    hidden:true
                },
                {
                    field: "FullName",
                    title: "Họ tên",
                    width: "50px"
                },
                {
                    field: "Phone",
                    title: "Số điện thoại",
                    width: "50px"
                },
                {
                    field: "Email",
                    title: "Email",
                    width: "50px"
                },
                {
                    field: "Address",
                    title: "Địa chỉ",
                    width: "80px"
                }
            ]
        };
        function onDataBound(e) {
            this.expandRow(this.tbody.find("tr.k-master-row").first());
        }
        function onChange(e) {
            var grid = $('#staffgrid').data('kendoGrid');
            var selectedItem = grid.dataItem(grid.select());
            vm.selectedStaff = selectedItem;
        }
}]);