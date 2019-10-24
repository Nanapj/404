'use strict';
angular.module('app')
    .controller('crReminderManagerCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', function ($scope, $state, $stateParams, $http, toaster){
        var vm = this;
        var _url = "/odata/Staffs";
        vm.model = {};
        vm.selectedStaff = {};
        vm.toolbarTemplate = toolbarTemplate;
        function toolbarTemplate() {
            return kendo.template($("#toolbar").html());
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
            height: 900,
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
                { command: [{ text: "Chi tiết", click: showDetails },{text: "Sửa", click: showDetails }], title: " ", width: "200px" }
            ]
        };
        var wnd = $("#details")
                        .kendoWindow({
                            title: "Chi tiết phiếu",
                            modal: true,
                            visible: false,
                            resizable: false,
                            width: 300
                        }).data("kendoWindow");

        var detailsTemplate = kendo.template($("#template").html());
        function onDataBound(e) {
            this.expandRow(this.tbody.find("tr.k-master-row").first());
        }
        function showDetails(e) {
            e.preventDefault();

            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            wnd.content(detailsTemplate(dataItem));
            wnd.center().open();
        }
        function onChange(e) {
            var grid = $('#staffgrid').data('kendoGrid');
            var selectedItem = grid.dataItem(grid.select());
            vm.selectedStaff = selectedItem;
        }
    }
]);