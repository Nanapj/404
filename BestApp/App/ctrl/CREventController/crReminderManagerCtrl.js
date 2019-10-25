'use strict';
angular.module('app')
    .controller('crReminderManagerCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', function ($scope, $state, $stateParams, $http, toaster){
        var vm = this; 
        var _url = "/odata/Staffs";
        vm.handleDateRange = handleDateRange;
        vm.selectedStaff = {};
        vm.reminderTagsList = [
            { "Name" : "Tag A" , "Id" : "1"},
            { "Name" : "Tag B" , "Id" : "2"},
            { "Name": "Tag C" , "Id" : "3"}
        ];
        vm.reminderTagFilterList = [];
        $scope.reminderTagItemClicked = function(item,_this,index) {
            var idButtonClicked = "#button"+item.Id;
            if($(idButtonClicked).css("background-color") !== 'rgb(66, 133, 244)'){
                $(idButtonClicked).css({
                    "background-color" : "#4285F4"
                });
                $(idButtonClicked).addClass("tag-blue-color");     
                vm.tagFilterList.push(item);
            } else {
                $(idButtonClicked).css({
                    "background-color":"white"      
                });
                $(idButtonClicked).removeClass("tag-blue-color");   
                vm.tagFilterList.splice(index,1);
            }
        };
        $scope.reminderTagGridOptions = {
            dataSource: {
                type:'odata-v4',
                transport: {
                    read: {
                        url: function () {
                            return "https://demos.telerik.com/kendo-ui/service-v4/odata/Products";
                        }
                    },
                    update: {
                        url: function (dataItem) {
                            return "https://demos.telerik.com/kendo-ui/service-v4/odata/Products(" + dataItem.ProductID + ")";
                        }
                    },
                    batch: {
                        url: function () {
                            return "https://demos.telerik.com/kendo-ui/service-v4/odata/$batch";
                        }
                    },
                    create: {
                        url: function (dataItem) {
                            delete dataItem.ProductID;
                            return "https://demos.telerik.com/kendo-ui/service-v4/odata/Products";
                        }
                    },
                    destroy: {
                        url: function (dataItem) {
                            return "https://demos.telerik.com/kendo-ui/service-v4/odata/Products(" + dataItem.ProductID + ")";
                        }
                    }
                },
                batch: true,
                pageSize: 10,      
                schema: {
                    model: {
                        id: "ProductID",
                        fields: {
                            ProductID: { editable: false, nullable: true },
                            ProductName: { validation: { required: true } },
                            UnitPrice: { type: "number", validation: { required: true, min: 1} },
                            Discontinued: { type: "boolean" },
                            UnitsInStock: { type: "number", validation: { min: 0, required: true } }
                        }
                    }
                }
            },
            sortable: true,
            pageable: true,
            height: 468,
            columns: [
                { field: "ProductName", title: "Id", format: "{0:c}", width: "120px" },
                { field: "UnitPrice", title: "Thời gian", format: "{0:c}", width: "120px" },
                { field: "UnitsInStock", title:"Đã gọi", width: "120px" },
                { command: ["edit", "destroy"], title: "&nbsp;", width: "250px" }
            ],
            editable: "inline"
        };
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
        vm.reminderDepartmentSelectedIds = [ 4, 7 ];
        vm.reminderDepartmentSelectOptions = {
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
        $scope.reminderMainGridOptions = {
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
                },
                { command: [{ text: "Chi tiết", click: showDetails },{text: "Sửa", click: showEditDetails }], title: " Tùy chỉnh ", width: "200px" }
            ]
        };
        var wnd = $("#reminderDetails")
                        .kendoWindow({
                            title: "Chi tiết phiếu",
                            modal: true,
                            visible: false,
                            resizable: false,
                            width: 600
                        }).data("kendoWindow");
        var editwnd = $("#reminderEditdetails")
                .kendoWindow({
                    title: "Chỉnh sửa chi tiết",
                    modal: true,
                    visible: false,
                    resizable: true,
                    width: 600
                }).data("kendoWindow");
        var editGrid = $("#reminderGridEditDetails").kendoGrid({
            dataSource: {
                type:'odata-v4',
                transport: {
                    read: {
                        url: function () {
                            return "https://demos.telerik.com/kendo-ui/service-v4/odata/Products";
                        }
                    },
                    update: {
                        url: function (dataItem) {
                            return "https://demos.telerik.com/kendo-ui/service-v4/odata/Products(" + dataItem.ProductID + ")";
                        }
                    },
                    batch: {
                        url: function () {
                            return "https://demos.telerik.com/kendo-ui/service-v4/odata/$batch";
                        }
                    },
                    create: {
                        url: function (dataItem) {
                            delete dataItem.ProductID;
                            return "https://demos.telerik.com/kendo-ui/service-v4/odata/Products";
                        }
                    },
                    destroy: {
                        url: function (dataItem) {
                            return "https://demos.telerik.com/kendo-ui/service-v4/odata/Products(" + dataItem.ProductID + ")";
                        }
                    }
                },
                batch: true,
                pageSize: 10,      
                schema: {
                    model: {
                        id: "ProductID",
                        fields: {
                            ProductID: { editable: false, nullable: true },
                            ProductName: { validation: { required: true } },
                            UnitPrice: { type: "number", validation: { required: true, min: 1} },
                            Discontinued: { type: "boolean" },
                            UnitsInStock: { type: "number", validation: { min: 0, required: true } }
                        }
                    }
                }
            },
            sortable: true,
            pageable: true,
            height: 468,
            columns: [
                { field: "ProductName", title: "Id", format: "{0:c}", width: "120px" },
                { field: "UnitPrice", title: "Thời gian", format: "{0:c}", width: "120px" },
                { field: "UnitsInStock", title:"Đã gọi", width: "120px" },
                { command: ["edit"], title: "&nbsp;", width: "250px" }
            ],
            editable: "inline"
          }).data("kendoGrid");
        var detailsGrid = $("#reminderGridDetails").kendoGrid({
            dataSource: {
                type:'odata-v4',
                transport: {
                    read: {
                        url: function () {
                            return "https://demos.telerik.com/kendo-ui/service-v4/odata/Products";
                        }
                    }
                },
                batch: true,
                pageSize: 10,      
                schema: {
                    model: {
                        id: "ProductID",
                        fields: {
                            ProductID: { editable: false, nullable: true },
                            ProductName: { validation: { required: true } },
                            UnitPrice: { type: "number", validation: { required: true, min: 1} },
                            Discontinued: { type: "boolean" },
                            UnitsInStock: { type: "number", validation: { min: 0, required: true } }
                        }
                    }
                }
            },
            sortable: true,
            pageable: true,
            height: 468,
            width: 600,
            columns: [
                { field: "ProductName", title: "Id", format: "{0:c}", width: "120px" },
                { field: "UnitPrice", title: "Thời gian", format: "{0:c}", width: "120px" },
                { field: "UnitsInStock", title:"Đã gọi", width: "120px" },
            ]
          }).data("kendoGrid");
        function showEditDetails(e) {
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            // editwnd.content(editDetailsTemplate(dataItem));
            editGrid.resize();
            editwnd.center().open();
        }
        function onDataBound(e) {
            this.expandRow(this.tbody.find("tr.k-master-row").first());
        }
        function showDetails(e) {
            e.preventDefault();

            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            detailsGrid.resize();
            wnd.center().open();
        }
        function onChange(e) {
            var grid = $('#reminderStaffgrid').data('kendoGrid');
            var selectedItem = grid.dataItem(grid.select());
            vm.selectedStaff = selectedItem;
        }
    }
]);