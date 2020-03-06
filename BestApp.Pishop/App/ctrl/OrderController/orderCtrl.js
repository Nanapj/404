'use strict';

angular.module('app')
    .controller('OrderCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', 'blockUI', function ($scope, $state, $stateParams, $http, toaster, blockUI) {
        var _url = "/odata/Orders";
        var vm = this;
        vm.model = {};
        vm.access_token = localStorage.getItem('access_token');

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
        vm.receive = function () {
            if (vm.selectedOrder.ID !== undefined && vm.selectedOrder.ID !== "") {
                //update status order 
                vm.model.StausOrder = 1;
                $http({
                    method: 'PUT',
                    url: _url + '(' + vm.selectedOrder.ID + ')',
                    data: JSON.stringify(vm.model),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + vm.access_token.replace(/['"]+/g, '')
                    },
                }).then(function successCallback(response) {
                    $('#listOrderGrid').data('kendoGrid').dataSource.read();
                    $('#listOrderGrid').data('kendoGrid').refresh();
                    toaster.pop('success', "Thành công", "Nhận đơn hàng thành công");
                });
            }
            else
            {
            toaster.pop('info', "Chưa chọn", "Vui lòng chọn đơn hàng");
            }
        }
        vm.cancel = function () {
            if (vm.selectedOrder.ID != undefined && vm.selectedOrder.ID != null) {
                swal({
                    title: "Xác nhận hủy đơn?",
                    text: "Bạn có chắc hủy đơn",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                    .then((willDelete) => {
                        if (willDelete) {
                      
                            //update status order closed
                            
                        }
                    });
            }
            else {
                toaster.pop('info', "Chưa chọn", "Vui lòng chọn đơn hàng");
            }
        }
                    
        vm.createSubmit = function () {
            blockui.start();
            if ((vm.model.Name != "" && vm.model.Name != null)
            ) {
                $http({
                    url: _url,
                    method: 'POST',
                    data: JSON.stringify(vm.model),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + vm.access_token.replace(/['"]+/g, '')
                    },
                }).then(function (response) {
                    if (response.status == 201) {
                        toaster.pop('success', "Thành công", "Đã tạo thông tin phòng ban");
                        $state.go('app.department.edit', {
                            ID: response.data.ID
                        });
                        blockui.stop();
                    }
                });

            } else {
                toaster.pop('warning', "Rỗng tên", "Vui lòng điền tên phòng ban");
                blockui.stop();
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
                    width: "120px",
                    template: "#= kendo.toString(kendo.parseDate(CreatDate, 'yyyy-MM-dd'), 'dd/MM/yyyy') #"
                },
               
                {
                    field: "PhoneNumber",
                    title: "SĐT",
                    width: "120px"
                },
                {
                    field: "CustomerName",
                    title: "Tên KH",
                    width: "120px"
                },
                {
                    field: "Address",
                    title: "Địa chỉ",
                    width: "120px"
                },
             
                {
                    field: "Appointment",
                    title: "Thời gian hẹn",
                    width: "120px"
                },
                {
                    field: "SaleEmployeeName",
                    title: "Tên NV xử lý",
                    width: "120px"
                },
                {
                    field: "TypeOrder",
                    title: "Mục KH",
                    width: "120px"
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
                    title: "Tổng giá",
                    width: "120px"
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

}]);
