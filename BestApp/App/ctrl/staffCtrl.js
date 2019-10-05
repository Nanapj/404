'use strict';

angular.module('app')
    .controller('StaffCtrl', ['$scope', '$state', '$http', function ($scope, $state, $http, $rootScope){
        console.log('StaffCtrl loaded!');
        var _url = "/odata/Staffs";
        var vm = this;
        vm.access_token = localStorage.getItem('access_token');
        vm.model = {};
        vm.model.HasAccount = false;
        vm.toolbarTemplate = toolbarTemplate;
        vm.create = create;
        vm.edit = edit;
        
        function create(){
            $state.go('app.staff.create');
        }

        function edit(){
            $state.go('app.staff.edit');
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
            dataBound: function() {
                this.expandRow(this.tbody.find("tr.k-master-row").first());
            },
            columns: [
                {
                    field: "Fullname",
                    title: "Fullname",
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
}]);