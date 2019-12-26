'use strict';
angular.module('app')
    .controller('crEventManagerCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', function ($scope, $state, $stateParams, $http, toaster){

        var vm = this; 
        var _url = "/odata/Staffs";
        var _crEventURL = "/odata/Events";
        var _departmentURL = "/odata/Departments";
        var _pitechDeviceURL = "http://api.test.haveyougotpi.com/project404.aspx/GetDeviceListByPhoneNumber";
        var _pitechDeviceDetailsURL = "http://api.test.haveyougotpi.com/project404.aspx/GetDeviceInfoBySerialNo";
        var _tagURL = "/odata/Tags";
        var _eventDetailURL = "/odata/DetailEvents";
        var _productTypeOdata = "/odata/ProductTypes";
        var _historyInteractionURL = "/odata/InteractionHistories";
        var _reminderNoteURL = "/odata/ReminderNotes";
        vm.access_token = localStorage.getItem('access_token');
        vm.handleDateRange = handleDateRange;
        vm.selectedEvent = {};
        vm.crDepartmentListTag = [];    
        vm.tagsList = [];
        vm.eventDetailList = [];
        vm.eventHistoryList= [];
        vm.eventTags = [];
        vm.eventReminders = [];
        vm.crfilterTagSelectected = [];
        vm.productEditSelected = {};
        vm.pitechSerialList = [];
        vm.filterTagString = "";
        $scope.showWindow = false;
        $scope.showEditWindow = false;
        function compareDate(str1){
            // str1 format should be dd/mm/yyyy. Separator can be anything e.g. / or -. It wont effect
            var dt1   = parseInt(str1.substring(0,2));
            var mon1  = parseInt(str1.substring(3,5));
            var yr1   = parseInt(str1.substring(6,10));
            var date1 = new Date(yr1, mon1-1, dt1);
            return date1;
        }
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
            pageable: {
                pageSize: 5,
                refresh: true
            },
            groupable: true,
            reorderable: true,
            columnMenu: true,
            height: 600,
            cache: false,
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
        var editGrid = $("#gridEditDetails").kendoGrid({
            dataSource: {
                type:'odata-v4',
                transport: {
                    read: {
                        url: function () {
                            return _eventDetailURL;
                        }
                    }
                    // create: {
                    //     url: function (dataItem) {
                    //         $http({
                    //             url: _eventDetailURL+'('+ dataItem.ID +')',
                    //             method: 'PUT',
                    //             data: JSON.stringify(dataItem),
                    //             headers: {
                    //                 'Content-Type': 'application/json',
                    //                 'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                    //             },
                    //         }).then(function(response){
                    //             if(response.status == 204) {
                                    
                    //                 toaster.pop('success', "Thành công", "Đã cập nhật xong");               
                    //             } else {
                    //                 toaster.pop('error', "Lỗi", "Có lỗi trong quá trình cập nhật");
                    //             }
                    //         });      
                    //         kendo.ui.progress($("#gridEditDetails"), false);  
                    //         // var grid = $("#gridEditDetails").data("kendoGrid");
                    //         // grid.editRow($("#gridEditDetails tr:eq(-1)"));
                    //         return _eventDetailURL+"?$filter=EventID eq "+vm.selectedEvent.ID ; 
                    //     }
                    // }
                },
                batch: true,
                pageSize: 10,      
                schema: {
                    parse: function(response) {
                        var details = [];
                        for (var i = 0; i < response.value.length; i++) {
                            var createDate = new Date(response.value[i].CreatDate);
                            var soldDate = new Date();
                            if(response.value[i].DateSold !== "") {
                                soldDate = new Date(response.value[i].DateSold);
                            }
                            var detail = {
                                ID: response.value[i].ID,
                                Serial: response.value[i].Serial,
                                EventCode: response.value[i].EventCode,
                                ProductCode: response.value[i].ProductCode,
                                ProductName: response.value[i].ProductName,
                                AgencySold: response.value[i].AgencySold, 
                                AssociateName: response.value[i].AssociateName, 
                                CreatDate: new Date(
                                    createDate.getFullYear(),
                                    createDate.getMonth(),
                                    createDate.getDate(),
                                    createDate.getHours(),
                                    createDate.getMinutes(),
                                    createDate.getSeconds()
                                ),
                                DateSold: new Date(
                                    soldDate.getFullYear(),
                                    soldDate.getMonth(),
                                    soldDate.getDate(),
                                    soldDate.getHours(),
                                    soldDate.getMinutes(),
                                    soldDate.getSeconds()
                                ),
                                Note: response.value[i].Note
                            };
                            details.push(detail);
                        }
                        return details;
                    },
                    model: {
                        fields: {
                            ID: { editable: false, hidden: true },
                            Serial: { type: "string" },
                            EventCode: { type: "string", editable: false},
                            CreatDate: { type: "date", editable: false },
                            ProductCode: { type: "string" , editable: false },                  
                            ProductName: { type: "string" },
                            AgencySold: { type: "string", editable: false },
                            DateSold: { type: "date", nullable:true, editable: false },
                            AssociateName: { type: "string",  editable: false },
                            Note: { type: "string" }
                        }
                    }
                }
            },
            sortable: true,
            pageable: true,
            height: 468,
            columns: [
                { field: "ID", title: "Id", hidden: true },
                { 
                    field: "ProductName", title:"Tên sản phẩm",
                    editor: ProductTypeDropdownEditor, 
                    template: "#= ProductName #" 
                },
                { 
                    field: "Serial", 
                    title: "Serial",
                    editor: SerialDropdownEditor,
                    template: "#= Serial ? Serial : 'Noinformation' #"
                },
                { field: "EventCode", title:"Mã phiếu" },
                {   
                    field:"CreatDate",
                    title:"Ngày tạo",
                    template: "#= kendo.toString(CreatDate, 'dd/MM/yyyy HH:mm:ss') #",
                    groupHeaderTemplate: "#= kendo.toString(value, 'dd/MM/yyyy') #" 
                },
                { field: "ProductCode", title:"Mã sản phẩm" },   
                { field: "AgencySold", title:"Đại lý bán" },
                { 
                    field: "DateSold",
                    title:"Ngày mua",
                    template: "#= kendo.toString(DateSold, 'dd/MM/yyyy HH:mm:ss') #",
                    groupHeaderTemplate: "#= kendo.toString(value, 'dd/MM/yyyy') #" 
                },
                { field: "AssociateName", title:"Nhân viên bán" },    
                { field: "Note", title: "Ghi chú"},
                {   
                    command: ["edit"], title: "&nbsp;", width: "250px" 
                }
            ],
            editable: "inline",
            save: function (e) {
                e.preventDefault();
                var model = {
                    ID: e.model.ID,
                    Serial: e.model.Serial,
                    ProductID: e.model.ProductName,
                    Note: e.model.Note,
                    AgencySold: e.model.AgencySold,
                    AssociateName: e.model.AssociateName,
                }
                if(model.Serial == "[object Object]"){
                    model.Serial = "Noinformation";
                }
                if(e.model.DateSold !== undefined && e.model.DateSold !== "") {
                    model.DateSold = moment(e.model.DateSold).utc().format();
                }
                $http({
                    url: _eventDetailURL+'('+ e.model.ID +')',
                    method: 'PUT',
                    data: JSON.stringify(model),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                    },
                }).then(function(response){
                    if(response.status == 204) {
                        var grid = $("#gridEditDetails").data("kendoGrid");
                        grid.dataSource.read();
                        toaster.pop('success', "Thành công", "Đã cập nhật xong");               
                    } else {
                        toaster.pop('error', "Lỗi", "Có lỗi trong quá trình cập nhật");
                    }
                });       
            },
            cancel: function(e) {
                e.preventDefault();
                var model = $("#gridEditDetails").data("kendoGrid");
                model.dataSource.cancelChanges();
                this.closeCell();
            }
          }).data("kendoGrid");
        $("#eventWindowTabstrip").kendoTabStrip({
            animation:  {
                open: {
                    effects: "fadeIn"
                }
            }
        });
        $("#editeventWindowTabstrip").kendoTabStrip({
            animation: {
                opren: {
                    effects: "fadeIn"
                }
            }
        });
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
                  } else {
                      toaster.pop('info', "Rỗng","Phòng ban chưa có tag");
                  }
                }, function errorCallback(response) {
                  console.log(response);
            });
        }
        function onCrDepartmentDeselect(e) {
            var data = e.dataItem;
            var isHaveInList = vm.crDepartmentListTag.find(element => function() {
                element.department === data;
            })
            if(isHaveInList !== undefined && isHaveInList.tagList.length >0) {
                isHaveInList.tagList.forEach(function(element, index, object) {              
                    vm.crfilterTagSelectected.forEach(function(child, _index, _object) {
                        if (child === element) {
                            _object.splice(_index, 1);
                        }
                    });
                });
                vm.crDepartmentListTag.forEach(function(element,index,object) {
                    if(element.department === data) {
                        object.splice(index,1);
                    }
                });
                if(vm.crDepartmentListTag.length == 0) {
                    vm.crDepartmentListTag = [];
                }
            }
            vm.filterTagString = "";
            vm.crfilterTagSelectected.forEach(element => {
                vm.filterTagString+="'"+element.NameTag+"',";
            });
            var eventGrid = $("#eventGrid").data("kendoGrid");
            if(vm.filterTagString === "") {
                eventGrid.dataSource.transport.options.read.url =_crEventURL+"?$expand=DetailEvents,InteractionHistories,Tags,ReminderNotes,EStatusLogs&From="+moment(vm.startDate).utc().format()+"&To="+moment(vm.endDate).utc().format()+"&orderby CreatDate desc";
                eventGrid.dataSource.read();
            } else {
                vm.filterTagString = vm.filterTagString.substring(0, vm.filterTagString.length - 1);
                eventGrid.dataSource.transport.options.read.url =_crEventURL+"?$expand=DetailEvents,InteractionHistories,Tags,ReminderNotes,EStatusLogs&From="+moment(vm.startDate).utc().format()+"&To="+moment(vm.endDate).utc().format()+"&$filter=Tags/any(c: c/NameTag in ("+ vm.filterTagString+"))&orderby CreatDate desc";
                eventGrid.dataSource.read();
            }
        }
        function onCrDepartmentChanged() {
            var multiselect = $("#departMulDrop").data("kendoMultiSelect");
        }
        $scope.filterTagClicked = function(item,_this,index) {
            var idButtonClicked = "#filter"+item.ID;
            if($(idButtonClicked).css("background-color") !== 'rgb(66, 133, 244)'){
                $(idButtonClicked).css({
                    "background-color" : "#4285F4",
                    "color" : "white !important"
                });
                $(idButtonClicked).addClass("tag-blue-color");   
                vm.crfilterTagSelectected.push(item);            
            } else {
                $(idButtonClicked).css({
                    "color" : "#58666e !important",
                    "background-color":"white"      
                });
                $(idButtonClicked).removeClass("tag-blue-color");   
                vm.crfilterTagSelectected.splice(index,1);
            }
            vm.filterTagString = "";
            vm.crfilterTagSelectected.forEach(element => {
                vm.filterTagString+="'"+element.NameTag+"',";
            });          
            var eventGrid = $("#eventGrid").data("kendoGrid");
            if(vm.filterTagString === "") {
                eventGrid.dataSource.transport.options.read.url =_crEventURL+"?$expand=DetailEvents,InteractionHistories,Tags,ReminderNotes,EStatusLogs&From="+moment(vm.startDate).utc().format()+"&To="+moment(vm.endDate).utc().format()+"&orderby CreatDate desc";
                eventGrid.dataSource.read();
            } else {
                vm.filterTagString = vm.filterTagString.substring(0, vm.filterTagString.length - 1);
                eventGrid.dataSource.transport.options.read.url =_crEventURL+"?$expand=DetailEvents,InteractionHistories,Tags,ReminderNotes,EStatusLogs&From="+moment(vm.startDate).utc().format()+"&To="+moment(vm.endDate).utc().format()+"&$filter=Tags/any(c: c/NameTag in ("+ vm.filterTagString+"))&orderby CreatDate desc";
                eventGrid.dataSource.read();
            }     
        };
        $scope.onDateRangeChange = function() {
            var eventGrid = $("#eventGrid").data("kendoGrid");
            if(vm.filterTagString === "") {
                eventGrid.dataSource.transport.options.read.url =_crEventURL+"?$expand=DetailEvents,InteractionHistories,Tags,ReminderNotes,EStatusLogs&From="+moment(vm.startDate).utc().format()+"&To="+moment(vm.endDate).utc().format()+"&orderby CreatDate desc";
                eventGrid.dataSource.read();
            } else {
                vm.filterTagString = vm.filterTagString.substring(0, vm.filterTagString.length - 1);
                eventGrid.dataSource.transport.options.read.url =_crEventURL+"?$expand=DetailEvents,InteractionHistories,Tags,ReminderNotes,EStatusLogs&From="+moment(vm.startDate).utc().format()+"&To="+moment(vm.endDate).utc().format()+"&$filter=Tags/any(c: c/NameTag in ("+ vm.filterTagString+"))&orderby CreatDate desc";
                eventGrid.dataSource.read();
            }
        };
        $scope.listEventGridOptions = {
            toolbar: ["search"],
            dataSource: {
                type: "odata-v4",
                transport: {
                    read: _crEventURL+"?$expand=DetailEvents,InteractionHistories,Tags,ReminderNotes,EStatusLogs&From="+moment(vm.startDate).utc().format()+"&To="+moment(vm.endDate).utc().format()+"&orderby CreatDate desc"
                },         
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
                            Status: response.value[i].Status,
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
                            Note: response.value[i].Note,
                            DetailEvents: response.value[i].DetailEvents,
                            InteractionHistories: response.value[i].InteractionHistories,
                            Tags:  response.value[i].Tags,
                            ReminderNotes: response.value[i].ReminderNotes
                        };
                        events.push(event);
                      }
                      return events;
                    },
                    total: function (response) {
                        return response.length;
                    },
                    model: {
                      fields: {
                        Code: {type: "string"},
                        CustomerName: {type: "string"},
                        PhoneNumber: {type: "string"},
                        Address: {type: "string"},
                        Status: {type: "string"},
                        EventTypeName: {type: "string"},
                        EventPurposeName: {type: "string"},
                        Status: {type: "string"},
                        CreatDate: { type: "date" },
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
                }      
            },
            sortable: true,
            pageable: {
                pageSize: 10,
                refresh: true
            },
            groupable: true,
            reorderable: true,
            columnMenu: true,
            serverPaging: true,
            serverSorting: true,
            resizable: true,     
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
                    field: "Status",
                    title: "Trạng thái phiếu"
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
                    field: "Note",
                    title: "Ghi chú sự kiện"
                },
                { command: [{ text: "Chi tiết", click: showDetails },{text: "Sửa", click: showEditDetails },{text:"Đóng phiếu", click: closeEvent }], title: " Tùy chỉnh ", width: "300px" }
            ]
        };
        function closeEvent(e) {
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            vm.selectedEvent = dataItem;
            dataItem.Status = '1';
            $http({
                    url: _crEventURL +'('+ dataItem.ID +')',
                    method: 'PUT',
                    data: JSON.stringify(dataItem),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                    },
            }).then(function(response){
                if(response.status == 204) {
                    toaster.pop('success', "Thành công", "Đã cập nhật xong");        
                    $('#eventGrid').data('kendoGrid').dataSource.read();
                    $('#eventGrid').data('kendoGrid').refresh();       
                } else {
                    toaster.pop('error', "Lỗi", "Có lỗi trong quá trình cập nhật");
                }
            });      
        }

        var editwnd = $("#editdetails")
                .kendoWindow({
                    title: "Chỉnh sửa chi tiết",
                    modal: true,
                    visible: false,
                    resizable: true,
                    width: "80%"
                }).data("kendoWindow");
        var detailsTemplate = kendo.template($("#template").html());

        function onActiveDetail() {
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
            var editDetailGrid = $('#gridEditDetails').data('kendoGrid');
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
                data: vm.selectedEvent.InteractionHistories,
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
            });
            editDetailGrid.dataSource.transport.options.read.url = _eventDetailURL+"?$filter=EventID eq "+vm.selectedEvent.ID;
            editDetailGrid.dataSource.read();
            $('#gridDetails').data('kendoGrid').setDataSource(detailsDatasource);
            $('#gridDetails').data('kendoGrid').dataSource.read().then(function(){
                $('#gridDetails').data('kendoGrid').refresh();
            });
            $('#gridDetails').data('kendoGrid').refresh();
            historyGrids.setDataSource(historyDatasource);
            historyGrids.dataSource.read();
            historyGrids.refresh();
            tagGrid.setDataSource(tagDatasource);
            tagGrid.dataSource.read();
            tagGrid.refresh();
            reminderGrid.setDataSource(reminderDatasource);
            reminderGrid.dataSource.read();
            reminderGrid.refresh();           
        }
        function ProductTypeDropdownEditor(container, options) {
            $('<input required name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: false,
                    filter: "startswith",
                    dataTextField: "Name",
                    dataValueField: "ID",
                    select: onDetailSelected,
                    dataSource: {
                        type: "odata-v4",
                        transport: {
                            read: _productTypeOdata
                        }
                    }
            });
        }
        function onDetailSelected(e) {
            if (e.dataItem) {
                var dataItem = e.dataItem;
                vm.productEditSelected = dataItem;
                $http({
                    url: _pitechDeviceURL,
                    method: 'POST',
                    data: JSON.stringify({
                        "sessionId":"501b30b8-bc46-b1b6-46ba-68c2eb5f688c",
                        "phoneNumber": vm.selectedEvent.PhoneNumber
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }).error(function(response) {
                    toaster.pop('error', "Thất bại", response.error);
                })
                .then(function(response){
                    if(response.data.d.Success === true) {
                        vm.pitechSerialList = response.data.d.Item;
                    } else {
                    }
                });
            }
        }

        function SerialDropdownEditor(container,options) { 
            $('<input required name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: false,
                    filter: "startswith",
                    optionLabel: {
                        device_serial: "Select Serial...",
                    },
                    dataTextField: "device_serial",
                    dataValueField: "device_serial",
                    select: onSerialSelected,
                    change: function(e){
                        var ddl = this;
                        var item= ddl.dataItem();
                        $http({
                            url: _pitechDeviceDetailsURL,
                            method: 'POST',
                            data: JSON.stringify({
                                "sessionId":"501b30b8-bc46-b1b6-46ba-68c2eb5f688c",
                                "phoneNumber": vm.selectedEvent.PhoneNumber,
                                "serial":item.device_serial,
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        }).error(function(response) {
                            toaster.pop('error', "Thất bại", response.error);
                        })
                        .then(function(response){
                           if(response.data.d.Success === true) {
                                var item = response.data.d.Item;
                                var editedRow= ddl.element.closest("tr");
                                var model = $("#gridEditDetails").data("kendoGrid").dataItem(editedRow);
                                model.set("AgencySold", item.agency_sold);
                                model.set("DateSold", moment(compareDate(item.date_sold)).format("DD/MM/YYYY"));
                                model.set("associate_name", item.associate_name);
                                // vm.eventCRDetails.AgencySold = response.data.d.Item.agency_sold;
                                // vm.eventCRDetails.DateSold = moment(compareDate(response.data.d.Item.date_sold)).format("DD/MM/YYYY");
                                // vm.eventCRDetails.AssociateName = response.data.d.Item.associate_name;
                           }
                        });
                    },
                    dataSource: {
                        type: "json",
                        data: vm.pitechSerialList
                    }
            });
        }
        function onSerialSelected(e) {
            
        }
        function showEditDetails(e) {
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            vm.selectedEvent = dataItem;
            updateGrid();
            $scope.showEditWindow = true;
            $("#editDetailWindow").kendoWindow({
                position: {
                  top: "10%", 
                  left: "5%"
                },
                maxWidth: 600
              });
            $("#editDetailWindow").data("kendoWindow").open();
            $http({
                url: _pitechDeviceURL,
                method: 'POST',
                data: JSON.stringify({
                    "sessionId":"501b30b8-bc46-b1b6-46ba-68c2eb5f688c",
                    "phoneNumber": vm.selectedEvent.PhoneNumber
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
            }).error(function(response) {
                toaster.pop('error', "Thất bại", response.error);
            })
            .then(function(response){
                if(response.data.d.Success === true) {
                    vm.pitechSerialList = response.data.d.Item;
                } else {
                }
            });
        }
        function onDataBound(e) {
            this.expandRow(this.tbody.find("tr.k-master-row").first());
        }
        function showDetails(e) {
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            vm.selectedEvent = dataItem;  
            updateGrid();     
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
            var editDetailGrid = $('#gridEditDetails').data('kendoGrid');
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
                data: vm.selectedEvent.InteractionHistories,
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
            });
            editDetailGrid.dataSource.transport.options.read.url = _eventDetailURL+"?$filter=EventID eq "+vm.selectedEvent.ID;
            editDetailGrid.dataSource.read();
            var editGrid = $("#editDetailsGrid").data('kendoGrid');
            editGrid.dataSource.transport.options.read.url = _eventDetailURL+"?$filter=EventID eq "+vm.selectedEvent.ID;
            editGrid.dataSource.read();
            $scope.showWindow = true;
            $("#detailWindow").kendoWindow({
                position: {
                  top: "20%", 
                  left: "5%"
                },
                width: 600,
                height: 458,
                maxWidth: 600
              });
            $("#detailWindow").data("kendoWindow").open();
            $('a.k-pager-refresh.k-link').click();
            $('#eventDetailsGrid').data('kendoGrid').setDataSource(detailsDatasource);
            $("#eventDetailsGrid").data("kendoGrid").dataSource.read();
            $("#eventDetailsGrid").data("kendoGrid").refresh();
            $('#historyDetailsGrid').data('kendoGrid').setDataSource(historyDatasource);
            $("#historyDetailsGrid").data("kendoGrid").dataSource.read();
            $("#historyDetailsGrid").data("kendoGrid").refresh();
            $('#tagDetailsGrid').data('kendoGrid').setDataSource(tagDatasource);
            $("#tagDetailsGrid").data("kendoGrid").dataSource.read();
            $("#tagDetailsGrid").data("kendoGrid").refresh();
            $('#reminderDetailsGrid').data('kendoGrid').setDataSource(reminderDatasource);
            $("#reminderDetailsGrid").data("kendoGrid").dataSource.read();
            $("#reminderDetailsGrid").data("kendoGrid").refresh();
        }
        function onChange(e) {
            var grid = $('#eventGrid').data('kendoGrid');
            var selectedItem = grid.dataItem(grid.select());
            vm.selectedEvent = selectedItem;
            updateGrid();
        }
        function updateGrid() {
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
            var editDetailGrid = $('#gridEditDetails').data('kendoGrid');
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
            });
            editDetailGrid.dataSource.transport.options.read.url = _eventDetailURL+"?$filter=EventID eq "+vm.selectedEvent.ID;
            editDetailGrid.dataSource.read();
            var editGrid = $("#editDetailsGrid").data('kendoGrid');
            editGrid.dataSource.transport.options.read.url = _eventDetailURL+"?$filter=EventID eq "+vm.selectedEvent.ID;
            editGrid.dataSource.read();
            // $("#eventWindowTabstrip").kendoTabStrip({
            //     animation:  {
            //         open: {
            //             effects: "fadeIn"
            //         }
            //     }
            // });
            // $("#eventWindowTabstrip").data("kendoTabStrip").reload("li:first");
        }
        $scope.detailsGridOption =  {
                dataSource:{
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
                                    ),
                                    Note: response[i].Note
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
                                Note: { type: "string" }
                            }
                        }
                    },    
                } ,
                sortable: true,
                pageable: {
                    pageSize: 5,
                    refresh: true
                },
                groupable: true,
                reorderable: true,
                columnMenu: true,
                height: 600,
                cache: false,
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
                    },
                    { field: "Note", title: "Ghi chú" }
                ]
        };
        $scope.historyGridOption = {
            dataSource: {
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
        }
        $scope.tagDetailsOption ={
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
        }
        $scope.reminderDetailsOption = {
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
                    title: "Ghi chú lịch hẹn",
                    attributes: {
                        "class": "breakWord120"

                    }
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
        }
        $scope.noteEditor = function(container, options) {
            var editor =  $('<textarea data-bind="value: ' + options.field + '" cols="20" rows="4"></textarea>')
                  .appendTo(container);
        }
        $scope.editDetailsOptions = {
            dataSource: {
                type:'odata-v4',
                transport: {
                    read: {
                        url: function () {
                            return _eventDetailURL;
                        }
                    }, 
                    update: {
                        url: function(dataItem) {
                            return _eventDetailURL+"(" + dataItem.ID + ")";
                        }
                    }
                },
                batch: true,
                pageSize: 10,      
                schema: {
                    parse: function(response) {
                        var details = [];
                        for (var i = 0; i < response.value.length; i++) {
                            var createDate = new Date(response.value[i].CreatDate);
                            var soldDate = new Date();
                            if(response.value[i].DateSold !== "") {
                                soldDate = new Date(response.value[i].DateSold);
                            }
                            var detail = {
                                ID: response.value[i].ID,
                                Serial: response.value[i].Serial,
                                EventCode: response.value[i].EventCode,
                                ProductCode: response.value[i].ProductCode,
                                ProductName: response.value[i].ProductName,
                                AgencySold: response.value[i].AgencySold, 
                                AssociateName: response.value[i].AssociateName, 
                                CreatDate: new Date(
                                    createDate.getFullYear(),
                                    createDate.getMonth(),
                                    createDate.getDate(),
                                    createDate.getHours(),
                                    createDate.getMinutes(),
                                    createDate.getSeconds()
                                ),
                                DateSold: new Date(
                                    soldDate.getFullYear(),
                                    soldDate.getMonth(),
                                    soldDate.getDate(),
                                    soldDate.getHours(),
                                    soldDate.getMinutes(),
                                    soldDate.getSeconds()
                                ),
                                Note: response.value[i].Note
                            };
                            details.push(detail);
                        }
                        return details;
                    },
                    model: {
                        fields: {
                            ID: { editable: false, hidden: true },
                            Serial: { type: "string" },
                            EventCode: { type: "string", editable: false},
                            CreatDate: { type: "date", editable: false },
                            ProductCode: { type: "string" , editable: false },                  
                            ProductName: { type: "string" },
                            AgencySold: { type: "string", editable: false },
                            DateSold: { type: "date", nullable:true, editable: false },
                            AssociateName: { type: "string",  editable: false },
                            Note: { type: "string" }
                        }
                    }
                }
            },
            sortable: true,
            pageable: true,
            resizable: true,    
            height: 468,
            columns: [
                { field: "ID", title: "Id", hidden: true },
                { 
                    field: "ProductName", title:"Tên sản phẩm",
                    editor: ProductTypeDropdownEditor, 
                    template: "#= ProductName #" 
                },
                { 
                    field: "Serial", 
                    title: "Serial",
                    editor: SerialDropdownEditor,
                    template: "#= Serial ? Serial : 'Noinformation' #"
                },
                { field: "EventCode", title:"Mã phiếu" },
                {   
                    field:"CreatDate",
                    title:"Ngày tạo",
                    template: "#= kendo.toString(CreatDate, 'dd/MM/yyyy HH:mm:ss') #",
                    groupHeaderTemplate: "#= kendo.toString(value, 'dd/MM/yyyy') #" 
                },
                { field: "ProductCode", title:"Mã sản phẩm" },   
                { field: "AgencySold", title:"Đại lý bán" },
                { 
                    field: "DateSold",
                    title:"Ngày mua",
                    template: "#= kendo.toString(DateSold, 'dd/MM/yyyy HH:mm:ss') #",
                    groupHeaderTemplate: "#= kendo.toString(value, 'dd/MM/yyyy') #" 
                },
                { field: "AssociateName", title:"Nhân viên bán" },    
                { field: "Note", title: "Ghi chú", editor: $scope.noteEditor },
                {   
                    command: ["edit"], title: "&nbsp;", width: "250px" 
                }
            ],
            editable: "inline",
            save: function (e) {
                e.preventDefault();
                var model = {
                    ID: e.model.ID,
                    Serial: e.model.Serial,
                    ProductID: e.model.ID,
                    Note: e.model.Note,
                    AgencySold: e.model.AgencySold,
                    AssociateName: e.model.AssociateName,
                }
                if(model.Serial == "[object Object]"){
                    model.Serial = "Noinformation";
                }
                if(e.model.DateSold !== undefined && e.model.DateSold !== "") {
                    model.DateSold = moment(e.model.DateSold).utc().format();
                }
                $http({
                    url: _eventDetailURL+'('+ e.model.ID +')',
                    method: 'PUT',
                    data: JSON.stringify(model),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                    },
                }).then(function(response){
                    if(response.status == 204) {
                        var grid = $("#editDetailsGrid").data("kendoGrid");
                        grid.dataSource.read();
                        toaster.pop('success', "Thành công", "Đã cập nhật xong");               
                    } else {
                        toaster.pop('error', "Lỗi", "Có lỗi trong quá trình cập nhật");
                    }
                });      
            },
            cancel: function(e) {
                e.preventDefault();
                var model = $("#editDetailsGrid").data("kendoGrid");
                model.dataSource.cancelChanges();
                this.closeCell();
            }
        }
       
    }
]);