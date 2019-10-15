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
        
        function create(){
            $state.go('app.staff.create');
            vm.editMode = false;
        }

        function edit(){
            $state.go('app.staff.edit', {
                Id: vm.selectedStaff.Id
            });
        }

        function destroy(){
            alert('Deleted Button clicked');
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

        vm.submit = function(){
            alert('Submit button clicked');
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
                    field: "FullName",
                    title: "Full Name",
                    width: "50px"
                },
                {
                    field: "Phone",
                    title: "Phone",
                    width: "50px"
                },
                {
                    field: "Email",
                    title: "Email",
                    width: "50px"
                },
                {
                    field: "Address",
                    title: "Address",
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