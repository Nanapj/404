'use strict';
angular.module('app')
    .controller('CustomerCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', function ($scope, $state, $stateParams, $http, toaster){
        var vm = this;
        var _cusURL = "/odata/Customers";
        var _eventURL = "/odata/Events";
        $scope.mainGridOptions = {
            dataSource: {
                type: "odata-v4",
                transport: {
                    read: _cusURL
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
            columns: [
                {
                field: "ID",
                hidden: true
                },
                {
                field: "Name",
                title: "Họ tên khách hàng",
                width: "120px"
                },{
                field: "PhoneNumber",
                title: "Số điện thoại",
                width: "120px"
                },{
                field: "Address",
                title: "Địa chỉ",
                width: "120px"
                },{
                field: "District",
                title: "Quận",
                width: "120px"
                },
                {
                field: "Ward",
                title: "Phường",
                width: "120px"
                },
                {
                field: "Birthday",
                title: "Ngày sinh",
                width: "120px"
                },       
                {
                field: "City",
                title: "Thành phố",
                width: "120px"
                },
                {
                field: "Note",
                title: "Ghi chú",
                width: "120px"
                }
            ]
        };

        $scope.detailGridOptions = function(dataItem) {
            return {
                dataSource: {
                    type: "odata-v4",
                    transport: {
                        read: _eventURL
                    },
                    serverPaging: true,
                    serverSorting: true,
                    serverFiltering: true,
                    pageSize: 10,
                    filter: { field: "ID", operator: "eq", value: dataItem.CustomerID }
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
                { field: "ID", hidden: true},
                { field: "Code", title:"Mã sự kiện", width: "110px" },
                { field: "CreatDate",  
                  format: "{0:yyyy-MM-dd hh:mm:ss tt}",
                  parseFormats: ["dd/MM/yyyy h:mm:ss"], 
                title:"Ngày tạo phiếu" },
                { field: "TypeEvent", title: "Loại sự kiện", width: "190px" }
                ]
            };
        };
    }
]);