'use strict';

angular.module('app')
    .controller('OrderCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', 'blockUI', function ($scope, $state, $stateParams, $http, toaster, blockUI) {
        var _url = "/odata/Orders";
        var vm = this;
        vm.model = {};
        vm.access_token = localStorage.getItem('access_token');
        vm.gettoday = moment(new Date()).utc().format();
       
        vm.toolbarTemplate = toolbarTemplate;
        vm.create = create;
        vm.selectedOrder = {};

        vm.orderBack = orderBack;
        var blockui = blockUI.instances.get('BlockUI');

        function toolbarTemplate() {
            return kendo.template($("#toolbar").html());
        }
        function create() {
            $state.go('app.order.create');
            vm.editMode = false;
        }
        function orderBack() {
            $state.go('app.order.index');
        }
    
   
        
        // nhận đơn
        vm.receive = function () {
            if (vm.selectedOrder.ID !== undefined && vm.selectedOrder.ID !== "") {
                //update status order 
                vm.model.ID = vm.selectedOrder.ID;
                vm.model.StatusOrder = 1; //approve
                $http({
                    method: 'PUT',
                    url: "Json/UpdateStatusOrder",
                    data: JSON.stringify(vm.model),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + vm.access_token.replace(/['"]+/g, '')
                    },
                }).then(function successCallback(response) {
                    $('#listOrderGrid').data('kendoGrid').dataSource.read();
                    $('#listOrderGrid').data('kendoGrid').refresh();

                    toaster.pop('success', "Thành công", "Nhận đơn hàng thành công");
                    //update lại các biến countAppointment
                    $http({
                        method: 'GET',
                        url: _url + "?$filter=Appointment ge " + moment(new Date()).format('YYYY-MM-DDT[00:00:00Z]') + " and Appointment le " + moment(new Date()).utc().format() + " and StatusOrder eq 'Pending'&$count=true",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + vm.access_token.replace(/['"]+/g, '')
                        },
                    }).then(function successCallback(response) {
                        vm.countAppointmentToday = response.data.value.length;
                       
                        });
                    $http({
                        method: 'GET',
                        url: _url + "?$filter=Appointment ge " + moment(Date.now()).add(1, 'days').format('YYYY-MM-DDT[00:00:00Z]') + " and Appointment le " + moment(Date.now()).add(1, 'days').utc().format() + " and StatusOrder eq 'Pending'&$count=true",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + vm.access_token.replace(/['"]+/g, '')
                        },
                    }).then(function successCallback(response) {
                        vm.countAppointmentTomorrow = response.data.value.length;
                        });
                    //lấy ra số lượng mà đơn = Pending (NextWeek)
                    $http({
                        method: 'GET',
                        url: _url + "?$filter=Appointment ge " + moment().add(1, 'weeks').startOf('isoWeek').utc().format('YYYY-MM-DDT[00:00:00Z]') + " and Appointment le " + moment().add(1, 'weeks').endOf('isoWeek').utc().format() + " and StatusOrder eq 'Pending'&$count=true",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + vm.access_token.replace(/['"]+/g, '')
                        },
                    }).then(function successCallback(response) {
                        vm.countAppointmentNextWeek = response.data.value.length;
                        console.log(vm.countAppointmentNextWeek);
                    });

                });
            }
            else
            {
            toaster.pop('info', "Chưa chọn", "Vui lòng chọn đơn hàng");
            }
        }
        //hẹn lại
        vm.appoint = function () {
            if (vm.selectedOrder.ID != undefined && vm.selectedOrder.ID != null) {
                $state.go('app.order.appoint', {
                    ID: vm.selectedOrder.ID
                });

            }
            else {
                toaster.pop('info', "Chưa chọn", "Vui lòng chọn đơn hàng");
            }
        }
    
        vm.cancel = function () {
            if (vm.selectedOrder.ID != undefined && vm.selectedOrder.ID != null) {
                $state.go('app.order.cancel', {
                    ID: vm.selectedOrder.ID
                });
            }
            else {
                toaster.pop('info', "Chưa chọn", "Vui lòng chọn đơn hàng");
            }
        }
            
        $scope.mainGridOptions = {
        
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
            refresh: true,
          
      
            selectable: true,
       
            serverFiltering: true,
            height: 700,
      
            dataBound: onDataBound,
            change: onChange,
            columns: [
                {
                    field: "CreatDate",
                    title: "Ngày tạo",
                    width: "100px",
                    template: "#= kendo.toString(kendo.parseDate(CreatDate, 'yyyy-MM-dd'), 'dd/MM/yyyy') #"
                },
               
                {
                    field: "PhoneNumber",
                    title: "SĐT",
                    width: "110px"
                },
                {
                    field: "CustomerName",
                    title: "Tên KH",
                    width: "120px"
                },
                {
                    field: "Address",
                    title: "Địa chỉ",
                    width: "100px"
                },
             
                {
                    field: "Appointment",
                    title: "Thời gian hẹn",
                    width: "120px",
                    template: "#= kendo.toString(kendo.parseDate(Appointment, 'yyyy-MM-dd'), 'dd/MM/yyyy') #"
                },
                {
                    field: "SaleEmployeeName",
                    title: "Tên NV bán",
                    width: "120px"
                },
                {
                    field: "TypeOrder",
                    title: "Mục KH",
                    width: "100px"
                },
                {
                    field: "StatusOrder",
                    title: "Trạng thái",
                    width: "120px"
                },
                {
                    field: "Note",
                    title: "Ghi chú",
                    width: "120px"
                },
                {
                    field: "Total",
                    title: "Tổng giá (VNĐ)",
                    width: "120px",
                    template: "#= kendo.toString(Total, '00,0') #"
                },
            ]
        };
        function onDataBound(e) {
            this.expandRow(this.tbody.find("tr.k-master-row").first());
        }
        function onChange(e) {
            var grid = $('#listOrderGrid').data('kendoGrid');
            var selectedItem = grid.dataItem(grid.select());
            vm.selectedOrder = selectedItem;
        }
        //filter by date
        vm.startCreateDate = moment(new Date(new Date().getFullYear(), new Date().getMonth(), 1)).utc().format();
        vm.endCreateDate = moment(new Date()).utc().format();

        vm.startAppointmentDate = moment(new Date(new Date().getFullYear(), new Date().getMonth(), 1)).utc().format();
        vm.endAppointmentDate = moment(new Date()).utc().format();

        $scope.onStartCreateDateChange = function () {
            var grid = $('#listOrderGrid').data('kendoGrid');
            grid.dataSource.transport.options.read.url = _url + "?From=" + moment(vm.startCreateDate).utc().format() + "&To=" + moment(vm.endCreateDate).utc().format() ;
            grid.dataSource.read();
        }
        $scope.onEndCreateDateChange = function () {
            var grid = $('#listOrderGrid').data('kendoGrid');
            grid.dataSource.transport.options.read.url = _url + "?From=" + moment(vm.startCreateDate).utc().format() + "&To=" + moment(vm.endCreateDate).utc().format();
            grid.dataSource.read();
        }

        $scope.onStartAppointmentDateChange = function () {
            var grid = $('#listOrderGrid').data('kendoGrid');
            grid.dataSource.transport.options.read.url = _url + "?$filter=Appointment ge " + moment(vm.startAppointmentDate).utc().format() + " and Appointment le " + moment(vm.endAppointmentDate).utc().format() ;
            grid.dataSource.read();
        }
        $scope.onEndAppointmentDateChange = function () {
            var grid = $('#listOrderGrid').data('kendoGrid');
            grid.dataSource.transport.options.read.url = _url + "?$filter=Appointment ge " + moment(vm.startAppointmentDate).utc().format() + " and Appointment le " + moment(vm.endAppointmentDate).utc().format();
            grid.dataSource.read();
            console.log(moment(vm.endAppointmentDate).utc().format());
        }
        //window orderdetail
        $scope.windowOptions = {
            title: 'Chi tiết đơn hàng',
            width: "70%",
            height: 500,
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
        //click xem chi tiet
        vm.viewDetail = function () {
            if (vm.selectedOrder.ID != undefined && vm.selectedOrder.ID != null) {
             
                var dialog = $("#windowDetail").data("kendoWindow");
                dialog.center().open();
                vm.OrderDetail = [];

                $scope.initOrderDetail = function () {
                    $http({
                        method: 'GET',
                        url: "odata/OrderDetails" + '?$filter=OrderID eq ' + vm.selectedOrder.ID + '&$expand=OrderStatistics',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + vm.access_token.replace(/['"]+/g, '')
                        },
                    }).then(function successCallback(response) {
                        vm.OrderDetail = response.data.value;

                    });
                }
                $scope.initOrderDetail();
            }
            else {
                toaster.pop('info', "Chưa chọn", "Vui lòng chọn đơn hàng");
            }
           
        }
     
        vm.refreshData = function () {
            var grid = $('#listOrderGrid').data('kendoGrid');
            grid.dataSource.transport.options.read.url = _url;
            grid.dataSource.read();
        }
        //nhắc tg khách hẹn
        
        //lấy ra số lượng mà đơn = Pending (Today)
        $http({
            method: 'GET',
            url: _url + "?$filter=Appointment ge " + moment(new Date()).format('YYYY-MM-DDT[00:00:00Z]') + " and Appointment le " + moment(new Date()).utc().format() + " and StatusOrder eq 'Pending'&$count=true",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + vm.access_token.replace(/['"]+/g, '')
            },
        }).then(function successCallback(response) {
            vm.countAppointmentToday = response.data.value.length;
            });
        vm.Today = function () {
            vm.startAppointmentDate = moment(new Date()).format('YYYY-MM-DDT[00:00:00Z]');
            vm.endAppointmentDate = moment(new Date()).utc().format();
            $scope.onStartAppointmentDateChange(); 
        }
        //lấy ra số lượng mà đơn = Pending (Tomorrow)
        $http({
            method: 'GET',
            url: _url + "?$filter=Appointment ge " + moment(Date.now()).add(1, 'days').format('YYYY-MM-DDT[00:00:00Z]') + " and Appointment le " + moment(Date.now()).add(1, 'days').utc().format() + " and StatusOrder eq 'Pending'&$count=true",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + vm.access_token.replace(/['"]+/g, '')
            },
        }).then(function successCallback(response) {
            vm.countAppointmentTomorrow = response.data.value.length;
            });
        vm.Tomorrow = function () {
            vm.startAppointmentDate = moment(Date.now()).add(1, 'days').format('YYYY-MM-DDT[00:00:00Z]');
            vm.endAppointmentDate = moment(Date.now()).add(1, 'days').utc().format();
            $scope.onStartAppointmentDateChange();
        }
        //lấy ra số lượng mà đơn = Pending (NextWeek)
        $http({
            method: 'GET',
            url: _url + "?$filter=Appointment ge " + moment().add(1, 'weeks').startOf('isoWeek').utc().format('YYYY-MM-DDT[00:00:00Z]') + " and Appointment le " + moment().add(1, 'weeks').endOf('isoWeek').utc().format('YYYY-MM-DDT[00:00:00Z]') + " and StatusOrder eq 'Pending'&$count=true",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + vm.access_token.replace(/['"]+/g, '')
            },
        }).then(function successCallback(response) {
            vm.countAppointmentNextWeek = response.data.value.length;
        
            });
        vm.NextWeek = function () {
            vm.startAppointmentDate = moment().add(1, 'weeks').startOf('isoWeek').utc().format('YYYY-MM-DDT[00:00:00Z]');
            vm.endAppointmentDate = moment().add(1, 'weeks').endOf('isoWeek').utc().format('YYYY-MM-DDT[00:00:00Z]');
            $scope.onStartAppointmentDateChange();
        }
        console.log(moment().add(1, 'weeks').endOf('isoWeek').utc().format('YYYY-MM-DDT[00:00:00Z]'));
    }]);
