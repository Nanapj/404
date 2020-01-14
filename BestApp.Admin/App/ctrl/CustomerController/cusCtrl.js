'use strict';
angular.module('app')
    .controller('CustomerCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', function ($scope, $state, $stateParams, $http, toaster){
        var vm = this;
        var _cusURL = "/odata/Customers";
        var _eventURL = "/odata/Events";
        vm.selectedCus = {};
        $scope.mainGridOptions = {
            toolbar:['search'],
            dataSource: {
                type: "odata-v4",
                transport: {
                    read: _cusURL
                },
                schema: {
                    parse: function(response) {
                      var customers = [];
                      for (var i = 0; i < response.value.length; i++) {
                        var birthDayNo = new Date(response.value[i].Birthday);
                        var dateNoTime = new Date(response.value[i].CreatDate);
                        var customer = {
                            ID: response.value[i].ID,
                            Address: response.value[i].Address,
                            City: response.value[i].City,
                            District: response.value[i].District,
                            Ward: response.value[i].Ward,
                            Name: response.value[i].Name,
                            PhoneNumber: response.value[i].PhoneNumber,
                            CreatDate: new Date(
                                dateNoTime.getFullYear(),
                                dateNoTime.getMonth(),
                                dateNoTime.getDate(),
                                dateNoTime.getHours(),
                                dateNoTime.getMinutes(),
                                dateNoTime.getSeconds()
                            ),
                            Birthday: new Date(
                                birthDayNo.getFullYear(),
                                birthDayNo.getMonth(),
                                birthDayNo.getDate(),
                                birthDayNo.getHours(),
                                birthDayNo.getMinutes(),
                                birthDayNo.getSeconds()
                            ),
                            Note: response.value[i].Note
                        };
                        customers.push(customer);
                      }
                      return customers;
                    },
                    total: function (response) {
                        return response.length;
                    },
                    model: {
                      fields: {
                        ID: {type: "string"},
                        Address: {type: "string"},
                        City: {type: "string"},
                        District: {type: "string"},
                        Ward: {type: "string"},
                        Name: {type: "string"},
                        PhoneNumber: {type: "string"},
                        CreatDate: { type: "date" },
                        Birthday: { type: "date" },
                        Note: { type: "string" }
                      }
                    },
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true,
                    pageable: {
                        pageSize: 10,
                        refresh: true
                    },
                    groupable: true,
                    reorderable: true,
                },
                pageSize: 19,
                serverPaging: true,
                serverSorting: true
            },
            sortable: true,
            pageable: true,
            groupable: true,
            filterable: {
                extra: false
            },
            selectable: true,
            height: 500,
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
                    field:"Birthday",
                    title:"Ngày sinh",
                    width: "120px",
                    template: "#= kendo.toString(Birthday, 'dd/MM/yyyy HH:mm:ss') #",
                    groupHeaderTemplate: "#= kendo.toString(value, 'dd/MM/yyyy') #",
                    filterable: {
                        ui: function (element) {
                            element.kendoDatePicker({
                              format: "dd/MM/yyyy"
                            });
                        },
                        extra: true,
                        operators: {
                        //specify filters according to the field type - string, date, number
                            date: {
                                eq: "Equal to",
                                neq: "Not equal to",
                                gte: "Is after or equal to",
                                gt: "Is after",
                                lte: "Is before or equal to",
                                lt: "Is before"
                            }
                        }                   
                    }
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
                },
                { command: [{ text: "Profile", click: showDetails }], title: "  ", width: "100px" }
            ]
        };
        function showDetails(e) {
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            vm.selectedCus = dataItem;
            $state.go('app.customer.profile', {
                ID: vm.selectedCus.ID
            });
            console.log(dataItem);
        }
    }
]);