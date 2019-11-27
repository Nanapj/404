'use strict';
angular.module('app')
    .controller('crEventManagerCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', function ($scope, $state, $stateParams, $http, toaster){
        var vm = this; 
        var _url = "/odata/Staffs";
        var _crEventURL = "/odata/Events";
        var _departmentURL = "/odata/Departments";
        var _tagURL = "/odata/Tags";
        vm.access_token = localStorage.getItem('access_token');
        vm.handleDateRange = handleDateRange;
        vm.selectedEvent = {};
        vm.crDepartmentListTag = [];    
        vm.tagsList = [];
        vm.tagFilterList = [];
        vm.eventDetailList = [];
        vm.eventHistoryList= [];
        vm.eventTags = [];
        vm.eventReminder = [];
        $scope.tagItemClicked = function(item,_this,index) {
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
        $scope.tagGridOptions = {
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
        vm.startDate = moment(new Date(new Date().getFullYear(), new Date().getMonth(), 1)).utc().format();
        vm.endDate = moment(new Date()).utc().format();
        function handleDateRange() {
            console.log(vm.startDate);
            console.log(vm.endDate);
        }
        vm.departmentSelectedIds = [ ];
        vm.departmentSelectOptions = {
            placeholder: "Bộ phận...",
            dataTextField: "Name",
            dataValueField: "ID",
            change: onCrDepartmentChanged,
            deselect: onCrDepartmentDeselect,
            select: onCrDepartmentSelect,
            valuePrimitive: true,
            autoBind: false,
            dataSource: {
                type: "odata-v4",
                serverFiltering: true,
                transport: {
                    read: {
                        url: _departmentURL,
                    }
                }
            }
        };

        function onCrDepartmentSelect(e) {
            var dataItem = e.dataItem;
            $http({
                method: 'GET',
                url: _tagURL+"?$filter=DepartmentID eq " + dataItem.ID ,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                },
              }).then(function successCallback(response) {
                  if(response.data.value.length > 0) { 
                    var listItem = response.data.value;
                    vm.crDepartmentListTag.push({
                        department: dataItem,
                        tagList: listItem
                    });
                    console.log("This is the department list");
                    console.log(vm.crDepartmentListTag);
                    console.log(response.data.value[0]);
                  } else {
                      toaster.pop('info', "Rỗng","Phòng ban chưa có tag");
                  }
                }, function errorCallback(response) {
                  console.log(response);
            });
        }
        function onCrDepartmentDeselect(e) {
            var data = e.dataItem;
            console.log("Deselected");
        }
        function onCrDepartmentChanged() {
            var multiselect = $("#departMulDrop").data("kendoMultiSelect");
            
            console.log(multiselect.value());
            console.log(multiselect.value().length);
            console.log(multiselect.value()[multiselect.value().length - 1]);
            console.log(vm.departmentSelectedIds);
        }
        $scope.filterTagClicked = function(item,_this,index) {
            var idButtonClicked = "#filter"+item.ID;
        };
        $scope.onDateRangeChange = function() {
            console.log(vm.startDate);
            console.log(vm.endDate);
        };
        $scope.mainGridOptions = {
            dataSource: {
                type: "odata-v4",
                transport: {
                    read: _crEventURL+"?$expand=DetailEvents,InteractionHistorys,Tags,ReminderNotes&CreatDate lt "+ "'"+vm.endDate+"'"+" &CreatDate gt "+"'"+vm.startDate+"'"
                },
                pageSize: 50,
                serverPaging: true,
                serverSorting: true,
                resizable: true,
                
                schema: {
                    parse: function(response) {
                      var events = [];
                      for (var i = 0; i < response.value.length; i++) {
                        var dateNoTime = new Date(response.value[i].CreatDate);
                        var event = {
                            Code: response.value[i].Code,
                            CustomerName: response.value[i].CustomerName,
                            PhoneNumber: response.value[i].PhoneNumber,
                            Address: response.value[i].Address,
                            EventTypeName: response.value[i].EventTypeName,
                            EventPurposeName: response.value[i].EventPurposeName,
                            Status: response.value[i].Status,
                            CreatDate: response.value[i].CreatDate,
                            CreatDateNoTime: new Date(
                                dateNoTime.getFullYear(),
                                dateNoTime.getMonth(),
                                dateNoTime.getDate()
                            ),
                            DetailEvents: response.value[i].DetailEvents,
                            InteractionHistorys: response.value[i].InteractionHistorys,
                            Tags:  response.value[i].Tags,
                            ReminderNotes: response.value[i].ReminderNotes
                        };
                        events.push(event);
                      }
                      return events;
                    },
                    model: {
                      fields: {
                        Code: {type: "string"},
                        CustomerName: {type: "string"},
                        PhoneNumber: {type: "string"},
                        Address: {type: "string"},
                        EventTypeName: {type: "string"},
                        EventPurposeName: {type: "string"},
                        Status: {type: "string"},
                        CreatDate: { type: "date" },
                        CreatDateNoTime: { type: "date" }
                      }
                    }
                }
            },
            sortable: true,
            pageable: true,
            groupable: true,
            reorderable: true,
            columnMenu: true,
            height: 500,
            dataBound: onDataBound,
            change: onChange,
            columns: [
            {
                field: "Code",
                title: "Mã Phiếu"
            },
            {
                field:"CreatDateNoTime",
                title:"Ngày tạo",
                template: "#= kendo.toString(CreatDate, 'dd/MM/yyyy HH:mm:ss') #",
                groupHeaderTemplate: "#= kendo.toString(value, 'dd/MM/yyyy') #"
            },
            {
                field: "CustomerName",
                title: "Tên khách hàng"
            },
            {
                field: "PhoneNumber",
                title: "Số điện thoại"
            },
            {
                field: "Address",
                title: "Địa chỉ"
            },
            {
                field: "EventTypeName",
                title: "Loại sự kiện"
            },
            {
                field: "EventPurposeName",
                title: "Mục đích"
            },
            {
                field:"Status",
                title:"Tình trạng phiếu"
            },
            { command: [{ text: "Chi tiết", click: showDetails },{text: "Sửa", click: showEditDetails }], title: " Tùy chỉnh ", width: "200px" }
            ]
        };
        var wnd = $("#details")
                        .kendoWindow({
                            title: "Chi tiết phiếu",
                            modal: true,
                            visible: false,
                            resizable: false,
                            width: 600
                        }).data("kendoWindow");
        var editwnd = $("#editdetails")
                .kendoWindow({
                    title: "Chỉnh sửa chi tiết",
                    modal: true,
                    visible: false,
                    resizable: true,
                    width: 600
                }).data("kendoWindow");
        var detailsTemplate = kendo.template($("#template").html());
        var editGrid = $("#gridEditDetails").kendoGrid({
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
        var detailsGrid = $("#gridDetails").kendoGrid({
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
          $("#windowTabstrip").kendoTabStrip({
            animation:  {
                open: {
                    effects: "fadeIn"
                }
            }
        });
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
            var grid = $('#eventGrid').data('kendoGrid');
            var selectedItem = grid.dataItem(grid.select());
            vm.selectedEvent = selectedItem;
        }
    }
]);