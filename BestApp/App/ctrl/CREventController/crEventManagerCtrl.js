'use strict';
angular.module('app')
    .controller('crEventManagerCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', function ($scope, $state, $stateParams, $http, toaster){
        var vm = this; 
        vm.handleDateRange = handleDateRange;
        vm.tagsList = [
            { "Name" : "Nút 1" , "Id" : "1"},
            { "Name" : "Nút 2" , "Id" : "2"},
            { "Name": "Nút 3" , "Id" : "3"}
        ];
        $(".editButton").kendoButton({
            icon: "edit"
        });

        $(".closeButton").kendoButton({
            icon: "close"
        });
        kendo.init("#listoftag");
        vm.startDate = new Date();
        vm.endDate = new Date();
        function handleDateRange() {
            console.log('Handle changed')
        }
        vm.departmentSelectedIds = [ 4, 7 ];
        vm.departmentSelectOptions = {
            placeholder: "Bộ phận...",
            dataTextField: "ProductName",
            dataValueField: "ProductID",
            valuePrimitive: true,
            autoBind: false,
            dataSource: {
                type: "odata",
                serverFiltering: true,
                transport: {
                    read: {
                        url: "https://demos.telerik.com/kendo-ui/service/Northwind.svc/Products",
                    }
                }
            }
        };
        $scope.onDateRangeChange = function() {
            console.log(vm.startDate);
            console.log(vm.endDate);
        };
    }
]);