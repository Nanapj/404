'use strict';

angular.module('app')
    .controller('DashboardCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', function ($scope, $state, $stateParams, $http, toaster) {
        var canvasctx = document.getElementById('canvasChart').getContext('2d');
        var piectx = document.getElementById('pieChart').getContext('2d');
        var colandlinectx = document.getElementById('columnAndLineChart').getContext('2d');
        var barctx = document.getElementById('barChart').getContext('2d');
        var vm = this;
        vm.dataDetail = [];
        vm.eventHistoryList = [];
        vm.eventTags = [];
        vm.access_token = localStorage.getItem('access_token');
        $scope.initialDashboard = function () {
        }
        $scope.initialDashboard();
        var pieData = {
            datasets: [{
                data: [10, 20, 30],
                backgroundColor: ['#878BB6', '#4ACAB4', '#FF8153']
            }],
            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                'Red',
                'Yellow',
                'Blue'
            ]
        };
        var canvasData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
                label: 'Thống kê cuộc gọi hàng tháng',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [2000, 3500, 3005, 2498, 1220, 2230, 2045]
            }]
        };
        var colandlineData = {
            datasets: [{
                label: 'Bar Dataset',
                data: [60, 20, 30, 40],

                backgroundColor: 'rgba(255,0,0,0.2)'
            }, {
                label: 'Line Dataset',
                data: [50, 30, 50, 50],
                // Changes this dataset to become a line
                type: 'line',
                backgroundColor: 'rgba(135,206,250,0.2)'
            }],
            labels: ['January', 'February', 'March', 'April']
        };
        var barData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
                label: 'Thống kê cuộc gọi hàng tháng',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [2000, 3500, 3005, 2498, 1220, 2230, 2045]
            }]
        }
        var barDataOptions = {
            scales: {
                xAxes: [{
                    barPercentage: 0.5,
                    barThickness: 20,
                    maxBarThickness: 8,
                    minBarLength: 2,
                    gridLines: {
                        offsetGridLines: true
                    }
                }]
            }
        };
        var canvasChart = new Chart(canvasctx, {
            // The type of chart we want to create
            type: 'line',
            // The data for our dataset
            data: canvasData,
            // Configuration options go here
            options: {}
        });
        var pieChart = new Chart(piectx, {
            type: 'pie',
            data: pieData
        });
        var colandlineChart = new Chart(colandlinectx, {
            type: 'bar',
            data: colandlineData
        });
        var barChart = new Chart(barctx, {
            type: 'bar',
            data: barData,
            options: barDataOptions
        });
        $scope.schedulerOptions = {
            date: new Date("2013/6/13"),
            startTime: new Date("2013/6/13 07:00 AM"),
            height: 600,
            views: [
                "day",
                { type: "workWeek", selected: true },
                "week",
                "month",
            ],
            timezone: "Etc/UTC",
            dataSource: {
                batch: true,
                transport: {
                    read: {
                        url: "https://demos.telerik.com/kendo-ui/service/tasks",
                        dataType: "jsonp"
                    },
                    update: {
                        url: "https://demos.telerik.com/kendo-ui/service/tasks/update",
                        dataType: "jsonp"
                    },
                    create: {
                        url: "https://demos.telerik.com/kendo-ui/service/tasks/create",
                        dataType: "jsonp"
                    },
                    destroy: {
                        url: "https://demos.telerik.com/kendo-ui/service/tasks/destroy",
                        dataType: "jsonp"
                    },
                    parameterMap: function (options, operation) {
                        if (operation !== "read" && options.models) {
                            return { models: kendo.stringify(options.models) };
                        }
                    }
                },
                schema: {
                    model: {
                        id: "taskId",
                        fields: {
                            taskId: { from: "TaskID", type: "number" },
                            title: { from: "Title", defaultValue: "No title", validation: { required: true } },
                            start: { type: "date", from: "Start" },
                            end: { type: "date", from: "End" },
                            startTimezone: { from: "StartTimezone" },
                            endTimezone: { from: "EndTimezone" },
                            description: { from: "Description" },
                            recurrenceId: { from: "RecurrenceID" },
                            recurrenceRule: { from: "RecurrenceRule" },
                            recurrenceException: { from: "RecurrenceException" },
                            ownerId: { from: "OwnerID", defaultValue: 1 },
                            isAllDay: { type: "boolean", from: "IsAllDay" }
                        }
                    }
                },
                filter: {
                    logic: "or",
                    filters: [
                        { field: "ownerId", operator: "eq", value: 1 },
                        { field: "ownerId", operator: "eq", value: 2 }
                    ]
                }
            },
            resources: [
                {
                    field: "ownerId",
                    title: "Owner",
                    dataSource: [
                        { text: "Alex", value: 1, color: "#f8a398" },
                        { text: "Bob", value: 2, color: "#51a0ed" },
                        { text: "Charlie", value: 3, color: "#56ca85" }
                    ]
                }
            ]
        };

        //get event for pishop
        $scope.init = function () {
            $http({
                method: 'GET',
                url: "odata/Events/GetEventForPishop?$expand=DetailEvents,InteractionHistories,Tags,ReminderNotes,EStatusLogs",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + vm.access_token.replace(/['"]+/g, '')
                },
            }).then(function successCallback(response) {
                vm.EventForPishop = response.data.value;
             
            });
        }
        $scope.init();
     
        //window eventdetail
        $scope.windowOptions = {
            title: 'Chi tiết sự kiện',
            width: "90%",
            height: 720,
            visible: false,
            resizable: false,
            actions: [
                "Pin",
                "Minimize",
                "Maximize",
                "Close"
            ],

            modal: false,
        }
        vm.model = {};

        //click xem chi tiet
        vm.Seen = function (model) { 
            vm.model = {};
            vm.model = model;
            //update status seen
            if (model.StatusSeen === 'Unseen') {
                $http({
                    method: 'PUT',
                    url: "/Json/UpdateStatusEvent/" + vm.model.ID,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + vm.access_token.replace(/['"]+/g, '')
                    },
                }).then(function successCallback(response) {
                    model.StatusSeen = 'Seen';
                });
            }
            updateGrid();
          
            //open window kendo
            var dialog = $("#windowDetail").data("kendoWindow");
            dialog.center().open();  
        }
        function updateGrid() {
            if (vm.dataDetail.length > 0) {
                vm.dataDetail = [];
            }
            if (vm.eventHistoryList.length > 0) {
                vm.eventHistoryList = [];
            }
            if (vm.eventTags.length > 0) {
                vm.eventTags = [];
            }
            for (var i = 0; i < vm.model.DetailEvents.length; i++) {
                vm.dataDetail.push(vm.model.DetailEvents[i]);
            }
            for (var i = 0; i < vm.model.InteractionHistories.length; i++) {
                vm.eventHistoryList.push(vm.model.InteractionHistories[i]);
            }
            for (var i = 0; i < vm.model.Tags.length; i++) {
                vm.eventTags.push(vm.model.Tags[i]);
            }  
            var detailsDatasource = new kendo.data.DataSource({
                data: vm.dataDetail,
                schema: {
                    parse: function (response) {
                        var details = [];
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
                            CreatDateNoTime: { type: "date" },
                            Note: { type: "string" }
                        }
                    }
                },

            });
            var historyDatasource = new kendo.data.DataSource({
                data: vm.eventHistoryList,
                schema: {
                    parse: function (response) {
                        var histories = [];
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
                            EventCode: { type: "string" },
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
            $('#eventDetailsGrid').data('kendoGrid').setDataSource(detailsDatasource);
            $("#eventDetailsGrid").data("kendoGrid").dataSource.read();
            $("#eventDetailsGrid").data("kendoGrid").refresh();
            $('#historyDetailsGrid').data('kendoGrid').setDataSource(historyDatasource);
            $("#historyDetailsGrid").data("kendoGrid").dataSource.read();
            $("#historyDetailsGrid").data("kendoGrid").refresh();
            $('#tagDetailsGrid').data('kendoGrid').setDataSource(tagDatasource);
            $("#tagDetailsGrid").data("kendoGrid").dataSource.read();
            $("#tagDetailsGrid").data("kendoGrid").refresh();
        }
        
        $scope.detailsGridOption = {
            data: vm.dataDetail,
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
                { field: "ProductCode", title: "Mã sản phẩm" },
                { field: "ProductName", title: "Tên sản phẩm" },
                { field: "AgencySold", title: "Đại lí bán" },
                { field: "AssociateName", title: "Tên nhân viên" },
                {
                    field: "CreatDate",
                    title: "Ngày tạo",
                    template: "#= kendo.toString(kendo.parseDate(CreatDate), 'dd/MM/yyyy h:mm:ss tt') #"
                },
                { field: "Note", title: "Kết quả hỗ trợ" }
            ]
        }
        $scope.historyGridOption = {
            dataSource: {
                data: vm.eventHistoryList,
            },
            sortable: true,
            pageable: {
                refresh: true,
                pageSize: 10,
            },
            groupable: true,
            reorderable: true,
            columnMenu: true,
            height: 468,
            columns: [
                { field: "EventCode", title: "Mã sự kiện" },
                { field: "Note", title: "Nội dung phiếu" },
                { field: "Status", title: "Trạng thái phiếu" },
                {
                    field: "CreatDate",
                    title: "Ngày chỉnh sửa",
                    template: "#= kendo.toString(CreatDate, 'dd/MM/yyyy HH:mm:ss') #",
                    groupHeaderTemplate: "#= kendo.toString(value, 'dd/MM/yyyy') #"
                },
                {
                    field: "Note", title: "Nhân viên chỉnh sửa"
                }
            ]
        }
      
        $scope.tagDetailsOption = {
            data: vm.eventTags,
            sortable: true,
            pageable: {
                refresh: true,
                pageSize: 10,
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
                    parse: function (response) {
                        var reminders = [];
                        for (var i = 0; i < response.length; i++) {
                            var createDateNotTime = new Date(response[i].CreatDate);
                            var reminderDateNoTime = new Date(response[i].ReminderDate);
                            var reminder = {
                                ID: response[i].ID,
                                Note: response[i].Note,
                                CreatDate: new Date(
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
                pageSize: 10,
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
                    field: "CreatDate",
                    title: "Ngày tạo",
                    template: "#= kendo.toString(CreatDate, 'dd/MM/yyyy HH:mm:ss') #",
                    groupHeaderTemplate: "#= kendo.toString(value, 'dd/MM/yyyy') #"
                },
                {
                    field: "ReminderDate",
                    title: "Ngày hẹn",
                    template: "#= kendo.toString(ReminderDate, 'dd/MM/yyyy HH:mm:ss') #",
                    groupHeaderTemplate: "#= kendo.toString(value, 'dd/MM/yyyy') #"
                }
            ]
        }
    }]);