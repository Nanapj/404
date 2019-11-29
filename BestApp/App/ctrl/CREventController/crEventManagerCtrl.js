'use strict';
angular.module('app')
    .controller('crEventManagerCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', function ($scope, $state, $stateParams, $http, toaster){
        var vm = this; 
        var _url = "/odata/Staffs";
        var _crEventURL = "/odata/Events";
        var _departmentURL = "/odata/Departments";
        var _tagURL = "/odata/Tags";
        var _eventDetailURL = "/odata/DetailEvents";
        var _historyInteractionURL = "/odata/InteractionHistories";
        vm.access_token = localStorage.getItem('access_token');
        vm.handleDateRange = handleDateRange;
        vm.selectedEvent = {};
        vm.crDepartmentListTag = [];    
        vm.tagsList = [];
        vm.tagFilterList = [];
        vm.eventDetailList = [];
        vm.eventHistoryList= [];
        vm.eventTags = [];
        vm.eventReminders = [];
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
                    read: _crEventURL+"?$expand=DetailEvents,InteractionHistories,Tags,ReminderNotes&CreatDate lt "+ "'"+vm.endDate+"'"+" &CreatDate gt "+"'"+vm.startDate+"'&orderby CreatDate desc"
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
                            ID: response.value[i].ID,
                            Code: response.value[i].Code,
                            CustomerName: response.value[i].CustomerName,
                            PhoneNumber: response.value[i].PhoneNumber,
                            Address: response.value[i].Address,
                            EventTypeName: response.value[i].EventTypeName,
                            EventPurposeName: response.value[i].EventPurposeName,
                            Status: response.value[i].Status,
                            CreatDate: new Date(
                                dateNoTime.getFullYear(),
                                dateNoTime.getMonth(),
                                dateNoTime.getDate(),
                                dateNoTime.getHours(),
                                dateNoTime.getMinutes(),
                                dateNoTime.getSeconds()
                            ),
                            DetailEvents: response.value[i].DetailEvents,
                            InteractionHistories: response.value[i].InteractionHistories,
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
                      }
                    }
                }
            },
            sortable: true,
            pageable: {
                pageSize: 10,
                refresh: true
            } ,
            groupable: true,
            reorderable: true,
            columnMenu: true,
            height: 500,
            dataBound: onDataBound,
            change: onChange,
            columns: [
                {
                    field: "ID",
                    title: "ID",
                    hidden: true
                },
                {
                    field: "Code",
                    title: "Mã Phiếu"
                },
                {
                    field:"CreatDate",
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
                            resizable: true,
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
            dataSource:{
                // transport:{
                //    read:  _eventDetailURL+"?$filter=EventID eq "+vm.selectedEvent.ID,

                // },
                data: vm.eventDetailList,
                schema: {
                    parse: function(response){
                        var details =[];
                        for (var i = 0; i < response.length; i++) {
                            var dateNoTime = new Date(response[i].CreatDate);
                            var detail = {
                                ID: response[i].ID,
                                Serial: response[i].Serial,
                                EventCode: response[i].EventCode,
                                ProductCode: response[i].ProductCode,
                                ProductName: response[i].ProductName,
                                AgencySold: response[i].AgencySold,
                                AssociateName: response[i].AssociateName,
                                CreatDate: new Date(
                                    dateNoTime.getFullYear(),
                                    dateNoTime.getMonth(),
                                    dateNoTime.getDate()
                                )
                            };
                            details.push(detail);
                          }
                          return details;
                    },
                    model: {
                        fields: {
                            ID: { type: "string" },
                            Serial: { type: "string" },
                            EventCode: { type: "string" },
                            ProductCode: { type: "string" },
                            ProductName: { type: "string" },
                            AgencySold: { type: "string" },
                            AssociateName: { type: "string" },
                            CreatDate: { type: "date" }
                        }
                    }
                },    
            } ,
            sortable: true,
            pageable: true,
            groupable: true,
            reorderable: true,
            columnMenu: true,
            height: 600,
            columns: [
                { field: "Serial", title: "Serial" },
                { field: "EventCode", title: "Mã sự kiện" },
                { field: "ProductCode", title: "Mã sản phẩm"},
                { field: "ProductName",  title: "Tên sản phẩm"},
                { field: "AgencySold", title: "Đại lí bán"},
                { field: "AssociateName", title: "Tên nhân viên"},
                {  
                    field:"CreatDate",
                    title:"Ngày tạo",
                    template: "#= kendo.toString(CreatDate, 'dd/MM/yyyy HH:mm:ss') #",
                    groupHeaderTemplate: "#= kendo.toString(value, 'dd/MM/yyyy') #"
                }
            ]
          }).data("kendoGrid");
        var historyGrid = $("#gridHistoryInteractions").kendoGrid({
        dataSource: {
            // transport: {
            //     read: _historyInteractionURL+"?$filter=EventID eq "+vm.selectedEvent.ID
            // },
            data: vm.eventHistoryList,
            schema: {
                parse: function(response){
                var histories =[];
                for (var i = 0; i < response.length; i++) {
                    var dateNoTime = new Date(response[i].CreatDate);
                    var history = {
                        ID: response[i].ID,
                        EventCode: response[i].EventCode,
                        Note: response[i].Note,
                        Status: response[i].Status,
                        CreatDate:new Date(
                            dateNoTime.getFullYear(),
                            dateNoTime.getMonth(),
                            dateNoTime.getDate()
                        )
                };
                histories.push(history);
                }
                return histories;
            },
            model: {
                fields: {
                    ID: { type: "string" },
                    EventCode: {type: "string"},
                    Note: { type: "string" },
                    Status: { type: "string" },
                    CreatDate: { type: "date" }
                }
            }
            }
        },
        sortable: true,
        pageable: {
            refresh: true,
            pageSize:10,
        },
        groupable: true,
        reorderable: true,
        columnMenu: true,
        height: 468,
        columns: [
            { field: "EventCode", title: "Mã sự kiện" },
            { field: "Note", title: "Nội dung phiếu"},
            { field: "Status",  title: "Trạng thái phiếu"},
            {  
                field:"CreatDate",
                title:"Ngày tạo",
                template: "#= kendo.toString(CreatDate, 'dd/MM/yyyy HH:mm:ss') #",
                groupHeaderTemplate: "#= kendo.toString(value, 'dd/MM/yyyy') #"
            },
            {
                field: "Note", title: " Ghi chú"
            }
        ]
        }).data("kendoGrid");
        var tagGrid = $('#gridTagDetails').kendoGrid({
            data: vm.eventTags,
            sortable: true,
            pageable: {
                refresh: true,
                pageSize:10,
            },
            groupable: true,
            reorderable: true,
            columnMenu: true,
            height: 468,
            columns: [
                {
                    field: "ID",
                    hidden: true,
                },
                {
                    field: "NameTag",
                    title: "Tên tag"
                },
                {
                    field: "CodeTag",
                    title: "Mã tag"
                },
                {
                    field: "DepartmentName",
                    title: "Phòng ban được tag"
                }
            ]
        });
        var reminderGrid = $('#reminderDetails').kendoGrid({
            dataSource: {
                data: vm.eventReminders,
                schema: {
                    parse: function(response) {
                        var reminders =[];
                        for (var i = 0; i < response.length; i++) {
                            var createDateNotTime = new Date(response[i].CreatDate);
                            var reminderDateNoTime = new Date(response[i].ReminderDate);
                            var reminder = {
                                ID: response[i].ID,
                                Note: response[i].Note,
                                CreatDate:  new Date(
                                    createDateNotTime.getFullYear(),
                                    createDateNotTime.getMonth(),
                                    createDateNotTime.getDate(),
                                    createDateNotTime.getHours(),
                                    createDateNotTime.getMinutes(),
                                    createDateNotTime.getSeconds(),
                                ),
                                ReminderDate: new Date(
                                    reminderDateNoTime.getFullYear(),
                                    reminderDateNoTime.getMonth(),
                                    reminderDateNoTime.getDate(),
                                    reminderDateNoTime.getMinutes(),
                                    reminderDateNoTime.getSeconds(),
                                )
                        };
                        reminders.push(reminder);
                        }
                        return reminders;
                    },
                    model: {
                        fields: {
                            ID: { type: "string" },
                            Note: { type: "string" },
                            CreatDate: { type: "date" },
                            ReminderDate: { type: "date" },
                        }
                    }
                }
            },
            sortable: true,
            pageable: {
                refresh: true,
                pageSize:10,
            },
            groupable: true,
            reorderable: true,
            columnMenu: true,
            height: 468,
            columns: [
                {
                    field: "ID",
                    hidden: true,
                },
                {
                    field: "Note",
                    title: "Ghi chú lịch hẹn"
                },
                {
                    field:"CreatDate",
                    title:"Ngày tạo",
                    template: "#= kendo.toString(CreatDate, 'dd/MM/yyyy HH:mm:ss') #",
                    groupHeaderTemplate: "#= kendo.toString(value, 'dd/MM/yyyy') #"
                },
                {
                    field:"ReminderDate",
                    title:"Ngày hẹn",
                    template: "#= kendo.toString(ReminderDate, 'dd/MM/yyyy HH:mm:ss') #",
                    groupHeaderTemplate: "#= kendo.toString(value, 'dd/MM/yyyy') #"
                }
            ]
        })
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
            console.log(vm.selectedEvent.ID);
            console.log(vm.selectedEvent.DetailEvents);
            console.log(vm.selectedEvent.InteractionHistories);
            console.log(vm.selectedEvent.ReminderNotes);
            if(vm.eventDetailList.length > 0) {
                vm.eventDetailList = [];
            }
            if(vm.eventHistoryList.length > 0) {
                vm.eventHistoryList = [];
            }
            if(vm.eventTags.length > 0) {
                vm.eventTags = [];
            }
            if(vm.eventReminders.length > 0) {
                vm.eventReminders = [];
            }
            for(var i = 0 ; i < vm.selectedEvent.DetailEvents.length ; i++) {
                vm.eventDetailList.push(vm.selectedEvent.DetailEvents[i]);
            }
            for(var i = 0 ; i < vm.selectedEvent.InteractionHistories.length ; i++) {
                vm.eventHistoryList.push(vm.selectedEvent.InteractionHistories[i]);
            }
            for(var i = 0 ; i < vm.selectedEvent.Tags.length ; i++) {
                vm.eventTags.push(vm.selectedEvent.Tags[i]);
            }  
            for(var i = 0 ; i < vm.selectedEvent.ReminderNotes.length ; i++) {
                vm.eventReminders.push(vm.selectedEvent.ReminderNotes[i]);
            }
            var gridDetails = $('#gridDetails').data('kendoGrid');
            var historyGrids = $('#gridHistoryInteractions').data('kendoGrid');
            var tagGrid = $('#gridTagDetails').data('kendoGrid');
            var reminderGrid = $('#reminderDetails').data('kendoGrid');
            var detailsDatasource = new kendo.data.DataSource({
                data: vm.eventDetailList,
                schema: {
                    parse: function(response){
                        var details =[];
                        for (var i = 0; i < response.length; i++) {
                            var dateNoTime = new Date(response[i].CreatDate);
                            var detail = {
                                ID: response[i].ID,
                                Serial: response[i].Serial,
                                EventCode: response[i].EventCode,
                                ProductCode: response[i].ProductCode,
                                ProductName: response[i].ProductName,
                                AgencySold: response[i].AgencySold,
                                AssociateName: response[i].AssociateName,
                                CreatDate: response[i].CreatDate,
                                CreatDateNoTime: new Date(
                                    dateNoTime.getFullYear(),
                                    dateNoTime.getMonth(),
                                    dateNoTime.getDate()
                                )
                            };
                            details.push(detail);
                          }
                          return details;
                    },
                    model: {
                        fields: {
                            ID: { type: "string" },
                            Serial: { type: "string" },
                            EventCode: { type: "string" },
                            ProductCode: { type: "string" },
                            ProductName: { type: "string" },
                            AgencySold: { type: "string" },
                            AssociateName: { type: "string" },
                            CreatDate: { type: "date" },
                            CreatDateNoTime: { type: "date" },
                        }
                    }
                },    
                
              });
            var historyDatasource = new kendo.data.DataSource({ 
                data: vm.eventHistoryList,
                schema: {
                    parse: function(response){
                    var histories =[];
                    for (var i = 0; i < response.length; i++) {
                        var dateNoTime = new Date(response[i].CreatDate);
                        var history = {
                            ID: response[i].ID,
                            EventCode: response[i].EventCode,
                            Note: response[i].Note,
                            Status: response[i].Status,
                            CreatDate: response[i].CreatDate,
                            CreatDateNoTime: new Date(
                                dateNoTime.getFullYear(),
                                dateNoTime.getMonth(),
                                dateNoTime.getDate(),
                                dateNoTime.getHours(),
                                dateNoTime.getMinutes(),
                                dateNoTime.getSeconds()
                            )
                    };
                    histories.push(history);
                    }
                    return histories;
                },
                model: {
                    fields: {
                        ID: { type: "string" },
                        EventCode: {type: "string"},
                        Note: { type: "string" },
                        Status: { type: "string" },
                        CreatDate: { type: "date" },
                        CreatDateNoTime: { type: "date" },
                    }
                }
                }
            });
            var tagDatasource = new kendo.data.DataSource({
                data: vm.eventTags
            });
            var reminderDatasource = new kendo.data.DataSource({
                data: vm.eventReminders,
                schema: {
                    parse: function(response) {
                        var reminders =[];
                        for (var i = 0; i < response.length; i++) {
                            var createDateNotTime = new Date(response[i].CreatDate);
                            var reminderDateNoTime = new Date(response[i].ReminderDate);
                            var reminder = {
                                ID: response[i].ID,
                                Note: response[i].Note,
                                CreatDate:  new Date(
                                    createDateNotTime.getFullYear(),
                                    createDateNotTime.getMonth(),
                                    createDateNotTime.getDate(),
                                    createDateNotTime.getHours(),
                                    createDateNotTime.getMinutes(),
                                    createDateNotTime.getSeconds(),
                                ),
                                ReminderDate: new Date(
                                    reminderDateNoTime.getFullYear(),
                                    reminderDateNoTime.getMonth(),
                                    reminderDateNoTime.getDate(),
                                    reminderDateNoTime.getHours(),
                                    reminderDateNoTime.getMinutes(),
                                    reminderDateNoTime.getSeconds(),
                                )
                        };
                        reminders.push(reminder);
                        }
                        return reminders;
                    },
                    model: {
                        fields: {
                            ID: { type: "string" },
                            Note: { type: "string" },
                            CreatDate: { type: "date" },
                            ReminderDate: { type: "date" },
                        }
                    }
                }
            })
            gridDetails.setDataSource(detailsDatasource);
            gridDetails.dataSource.read();
            gridDetails.refresh();
            historyGrids.setDataSource(historyDatasource);
            historyGrids.dataSource.read();
            historyGrids.refresh();
            tagGrid.setDataSource(tagDatasource);
            tagGrid.dataSource.read();
            tagGrid.refresh();
            reminderGrid.setDataSource(reminderDatasource);
            reminderGrid.dataSource.read();
            reminderGrid.refresh();
            console.log(vm.eventDetailList);

        }
    }
]);