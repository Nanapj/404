'use strict';

angular.module('app')
    .controller('StaffCtrl', ['$scope', '$state', '$stateParams', '$http', function ($scope, $state, $stateParams, $http, $rootScope){
        var _url = "/odata/Staffs";
        var vm = this;
        vm.access_token = localStorage.getItem('access_token');
        vm.model = {};
        vm.selectedStaff = {};
        vm.model.HasAccount = false;
        vm.toolbarTemplate = toolbarTemplate;
        vm.create = create;
        vm.edit = edit;
        
        function create(){
            $state.go('app.staff.create');
            vm.editMode = false;
        }

        function edit(){
            $state.go('app.staff.edit', {
                Id: vm.selectedStaff.Id
            });
        }

        function toolbarTemplate() {
            return kendo.template($("#toolbar").html());
        }

        vm.createSubmit = function () {
            console.log(vm.access_token);
            $http({
                url: _url,
                method: 'POST',
                data: JSON.stringify(vm.model),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                },
            }).then(function(response){
                console.log(response);
                alert("đã tạo");
            });
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
                pageSize: 5,
                serverPaging: true,
                serverSorting: true
            },
            sortable: true,
            pageable: true,
            height: 600,
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
            console.log(vm.selectedStaff);
        }
}]);