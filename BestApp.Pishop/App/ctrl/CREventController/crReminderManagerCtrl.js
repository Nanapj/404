'use strict';
angular.module('app')
    .controller('crReminderManagerCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', function ($scope, $state, $stateParams, $http, toaster){
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
        $scope.newReminderNote = "";
        $scope.reminderShowWindow = false;
        $scope.newReminderShowWindow = false;
        vm.newReminderDate = new Date();
        var scheduleWindow = $('#scheduleWindow');
        $("#reminderpicker").kendoDateTimePicker({
            value: vm.newReminderDate,
            dateInput: true,
            change: newReminderDateChanged
        });
        var datetimepicker = $("#reminderpicker").data("kendoDateTimePicker");
        datetimepicker.min(new Date());
        function compareDate(str1){
            // str1 format should be dd/mm/yyyy. Separator can be anything e.g. / or -. It wont effect
            var dt1   = parseInt(str1.substring(0,2));
            var mon1  = parseInt(str1.substring(3,5));
            var yr1   = parseInt(str1.substring(6,10));
            var date1 = new Date(yr1, mon1-1, dt1);
            return date1;
            }
        // $("#timeline").kendoTimeline({
        //     alternatingMode: true,
        //     collapsibleEvents: true,
        //     orientation: "vertical"
        // });
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
                eventGrid.dataSource.transport.options.read.url =_crEventURL+"?$expand=DetailEvents,InteractionHistories,Tags,ReminderNotes&From="+moment(vm.startDate).utc().format()+"&To="+moment(vm.endDate).utc().format()+"&orderby CreatDate desc";
                eventGrid.dataSource.read();
            } else {
                vm.filterTagString = vm.filterTagString.substring(0, vm.filterTagString.length - 1);
                eventGrid.dataSource.transport.options.read.url =_crEventURL+"?$expand=DetailEvents,InteractionHistories,Tags,ReminderNotes&From="+moment(vm.startDate).utc().format()+"&To="+moment(vm.endDate).utc().format()+"&$filter=Tags/any(c: c/NameTag in ("+ vm.filterTagString+"))&orderby CreatDate desc";
                eventGrid.dataSource.read();
            }
        }
        function onCrDepartmentChanged() {
            var multiselect = $("#departMulDrop").data("kendoMultiSelect");       
            console.log(multiselect.value());
            console.log(multiselect.value().length);
            console.log(multiselect.value()[multiselect.value().length - 1]);
            console.log(vm.departmentSelectedIds);
        }
        function newReminderDateChanged() {
            console.log(vm.newReminderDate);
            console.log(angular.element('#newReminderNoteText').val());
        }
        document.getElementById("createReminderButton").addEventListener("click", function(e){
            e.preventDefault();
            console.log(vm.newReminderDate);
            console.log(angular.element('#newReminderNoteText').val());
            if(!(vm.newReminderDate !== undefined && vm.newReminderDate !== "")) {
                toaster.pop('info', "Ngày rỗng", "Vui lòng chọn ngày hẹn");
            } else {
                var formatDate = moment(vm.newReminderDate).utc().format();
                var reminderNote = {
                    Note: angular.element('#newReminderNoteText').val(),
                    EventID: vm.selectedEvent.ID,
                    ReminderDate: formatDate,
                    Serial: vm.selectedEvent.Serial
                }
                $http({
                    url: _reminderNoteURL,
                    method: 'POST',
                    data: JSON.stringify(reminderNote),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                    },
                }).error(function(response) {
                    toaster.pop('error', "Thất bại", response.error);
                })
                .then(function(response){
                    if(response.status == 201) {
                        toaster.pop('success', "Thành công", "Đã tạo lịch hẹn thành công");
                        vm.newReminderDate = new Date();
                        vm.newReminderShowWindow = false;
                        $("#historyGrid").data("kendoGrid").dataSource.read();
                        $("#historyGrid").data("kendoGrid").refresh();
                        scheduleWindow.data("kendoWindow").close();
                        
                    }
                });
            }
        });
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
                eventGrid.dataSource.transport.options.read.url =_crEventURL+"?$expand=DetailEvents,InteractionHistories,Tags,ReminderNotes&From="+moment(vm.startDate).utc().format()+"&To="+moment(vm.endDate).utc().format()+"&orderby CreatDate desc";
                eventGrid.dataSource.read();
            } else {
                vm.filterTagString = vm.filterTagString.substring(0, vm.filterTagString.length - 1);
                eventGrid.dataSource.transport.options.read.url =_crEventURL+"?$expand=DetailEvents,InteractionHistories,Tags,ReminderNotes&From="+moment(vm.startDate).utc().format()+"&To="+moment(vm.endDate).utc().format()+"&$filter=Tags/any(c: c/NameTag in ("+ vm.filterTagString+"))&orderby CreatDate desc";
                eventGrid.dataSource.read();
            }     
        };
        // $scope.onDateRangeChange = function() {
        //     var eventGrid = $("#eventGrid").data("kendoGrid");
        //     if(vm.filterTagString === "") {
        //         eventGrid.dataSource.transport.options.read.url =_crEventURL+"?$expand=DetailEvents,InteractionHistories,Tags,ReminderNotes&From="+moment(vm.startDate).utc().format()+"&To="+moment(vm.endDate).utc().format()+"&orderby CreatDate desc";
        //         eventGrid.dataSource.read();
        //     } else {
        //         vm.filterTagString = vm.filterTagString.substring(0, vm.filterTagString.length - 1);
        //         eventGrid.dataSource.transport.options.read.url =_crEventURL+"?$expand=DetailEvents,InteractionHistories,Tags,ReminderNotes&From="+moment(vm.startDate).utc().format()+"&To="+moment(vm.endDate).utc().format()+"&$filter=Tags/any(c: c/NameTag in ("+ vm.filterTagString+"))&orderby CreatDate desc";
        //         eventGrid.dataSource.read();
        //     }
        // };
        $scope.onStartDateChange = function() {
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
        $scope.onEndDateChange = function() {
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
        $scope.reminderGridOption = {
            toolbar: ["search"],
            dataSource: {
                type: "odata-v4",
                transport: {
                    read: _crEventURL+"?$expand=DetailEvents,InteractionHistories,Tags,ReminderNotes&From="+moment(vm.startDate).utc().format()+"&To="+moment(vm.endDate).utc().format()+"&orderby CreatDate desc"
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
                sort: {
                    field: "CreatDate",
                    dir: "desc"
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
                { command: [{ text: "Chi tiết", click: showDetails }], title: " Tùy chỉnh ", width: "200px" }
            ]
        };
        function showDetails(e) {
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            vm.selectedEvent = dataItem;
            $scope.reminderShowWindow = true;
            updateGrid();
            $("#detailWindow").kendoWindow({
                position: {
                  top: "10%", 
                  left: "5%"
                },
                width: "50%",
                height: 458
              });
            $("#detailWindow").data("kendoWindow").open();
        }
        function onDataBound(e) {
            this.expandRow(this.tbody.find("tr.k-master-row").first());
            $(".k-grid-add").click(function(e){
                e.preventDefault();   
                $scope.newReminderShowWindow = true;
                scheduleWindow.data("kendoWindow").center().open();   
            });
        }
        function onChange(e) {
            var grid = $('#eventGrid').data('kendoGrid');
            var selectedItem = grid.dataItem(grid.select());
            vm.selectedEvent = selectedItem;
            console.log(vm.selectedEvent.ID);
            console.log(vm.selectedEvent.DetailEvents);
            console.log(vm.selectedEvent.InteractionHistories);
            console.log(vm.selectedEvent.ReminderNotes);
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
            var reminderDatasource = new kendo.data.DataSource({
                type: 'odata-v4',
                transport: {
                    read: _reminderNoteURL + "?$filter=EventID eq "+ vm.selectedEvent.ID
                },
                schema: {
                    parse: function(response) {
                        var reminders =[];
                        for (var i = 0; i < response.value.length; i++) {
                            var createDateNotTime = new Date(response.value[i].CreatDate);
                            var reminderDateNoTime = new Date(response.value[i].ReminderDate);
                            var reminder = {
                                ID: response.value[i].ID,
                                Note: response.value[i].Note,
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
            var historyTimelineData = new kendo.data.DataSource({
                type: 'odata-v4',
                transport: {
                    read: _reminderNoteURL + "?$filter=EventID eq "+ vm.selectedEvent.ID
                },
                schema: {
                    parse: function(response) {
                        var reminderItems =[];
                        for (var i = 0; i < response.length; i++) {
                            var createDateNotTime = new Date(response[i].CreatDate);
                            var reminderDateNoTime = new Date(response[i].ReminderDate);
                            var reminder = {
                                ID: response[i].ID,
                                description: response[i].Note,
                                date:  new Date(
                                    createDateNotTime.getFullYear(),
                                    createDateNotTime.getMonth(),
                                    createDateNotTime.getDate(),
                                    createDateNotTime.getHours(),
                                    createDateNotTime.getMinutes(),
                                    createDateNotTime.getSeconds(),
                                ),
                                subtitle: "Ngày hẹn: " + moment(new Date(
                                    reminderDateNoTime.getFullYear(),
                                    reminderDateNoTime.getMonth(),
                                    reminderDateNoTime.getDate(),
                                    reminderDateNoTime.getHours(),
                                    reminderDateNoTime.getMinutes(),
                                    reminderDateNoTime.getSeconds(),
                                )).format("DD/MM/YYYY HH:mm:ss"),
                                title: response[i].Serial
                                
                        };
                        reminderItems.push(reminder);
                        }
                        return reminderItems;
                    },
                    model: {
                        fields: {
                            ID: { type: "string" },
                            description: { type: "string" },
                            date: { type: "date" },
                            subtitle: { type: "tring" },
                            title: { type: "string" }
                        }
                    }
                },
              
            });
            // $('#timeline').data('kendoTimeline').setDataSource(historyTimelineData);
            // $('#timeline').data('kendoTimeline').dataSource.read();
            $('#historyGrid').data('kendoGrid').setDataSource(reminderDatasource);
            $("#historyGrid").data("kendoGrid").dataSource.read().then(function (){
                $("#historyGrid").data("kendoGrid").refresh();
            });
           
            console.log(vm.eventDetailList);
        }
        $scope.historyReOption = {
                dataSource: {
                    type: 'odata-v4',
                    transport: {
                        read: _reminderNoteURL
                    },
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
            ],
            toolbar: [
                {
                    name: "create",
                    text: "Thêm lịch hẹn"
                }
            ]
        }
    }
]);