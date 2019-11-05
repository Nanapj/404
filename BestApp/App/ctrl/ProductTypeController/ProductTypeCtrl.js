'use strict';
angular.module('app')
    .controller('ProductTypeCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', function ($scope, $state, $stateParams, $http, toaster){
        var _url = "/odata/ProductTypes";
        var vm = this;
        vm.access_token = localStorage.getItem('access_token');
        vm.model = {};
        vm.selectedProductType = {};
        vm.model.HasAccount = false;
        vm.toolbarTemplate = toolbarTemplate;
        vm.create = create;
        vm.edit = edit;
        vm.destroy = destroy;
        vm.dialogVisible = false;
        function create(){
            $state.go('app.producttype.create');
            vm.editMode = false;
        }

        function edit(){
            $state.go('app.producttype.edit', {
                Id: vm.selectedProductType.Id
            });
        }

        function destroy(){
            vm.dialogVisible = true;
            if(vm.selectedProductType.Id != undefined && vm.selectedProductType.Id != null) {
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
                         // $http({
                         //     method: 'DELETE',
                         //     url: _url+'(' + vm.selectedProductType.Id +')',
                         //     headers: {
                         //         'Content-Type': 'application/json',
                         //         'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                         //     },
                         // }).then(function successCallback(response) {
                         //     toaster.pop('success', "Thành công", "Đã xóa thông tin nhân viên và vô hiệu hóa tài khoản");
                         // });
                         toaster.pop('info', "Thành công", "Đã xóa thông tin nhân viên"); 
                   
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
            if((vm.model.Name != "" && vm.model.Name != null) 
            && (vm.model.Code != null && vm.model.Code != "")
            ) {
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
            height: 900,
            dataBound: onDataBound,
            change: onChange,
            columns: [
                {
                    field: "Name",
                    title: "Tên loại sản phẩm",
                    width: "50px"
                },
                {
                    field: "Code",
                    title: "Mã sản phẩm",
                    width: "50px"
                }
            ]
        };
        function onDataBound(e) {
            this.expandRow(this.tbody.find("tr.k-master-row").first());
        }
        function onChange(e) {
            var grid = $('#producttypegrid').data('kendoGrid');
            var selectedItem = grid.dataItem(grid.select());
            vm.selectedProductType = selectedItem;
        }
    }
]);