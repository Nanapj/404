'use strict';
angular.module('app')
    .controller('CustomerCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', function ($scope, $state, $stateParams, $http, toaster){
        $scope.mainGridOptions = {
            dataSource: {
                type: "odata",
                transport: {
                    read: "https://demos.telerik.com/kendo-ui/service/Northwind.svc/Employees"
                },
                pageSize: 20,
                serverPaging: true,
                serverSorting: true
            },
            sortable: true,
            pageable: true,
            filterable: {
                extra: false
            },
            height: 700,
            serverFiltering: true,
            dataBound: function() {
                this.expandRow(this.tbody.find("tr.k-master-row").first());
            },
            columns: [{
                field: "FirstName",
                title: "First Name",
                width: "120px"
                },{
                field: "LastName",
                title: "Last Name",
                width: "120px"
                },{
                field: "Country",
                width: "120px"
                },{
                field: "City",
                width: "120px"
                },{
                field: "Title"
            }]
        };

        $scope.detailGridOptions = function(dataItem) {
            return {
                dataSource: {
                    type: "odata",
                    transport: {
                        read: "https://demos.telerik.com/kendo-ui/service/Northwind.svc/Orders"
                    },
                    serverPaging: true,
                    serverSorting: true,
                    serverFiltering: true,
                    pageSize: 10,
                    filter: { field: "EmployeeID", operator: "eq", value: dataItem.EmployeeID }
                },
                scrollable: false,
                sortable: true,
                pageable: true,
                selectable: true,
                filterable: {
                    extra: false
                },
                serverFiltering: true,
                columns: [
                { field: "OrderID", title:"ID", width: "56px" , filterable: false},
                { field: "ShipCountry", title:"Ship Country", width: "110px" },
                { field: "ShipAddress", title:"Ship Address" },
                { field: "ShipName", title: "Ship Name", width: "190px" }
                ]
            };
        };
    }
]);