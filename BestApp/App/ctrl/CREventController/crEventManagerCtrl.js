'use strict';
angular.module('app')
    .controller('crEventManagerCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', function ($scope, $state, $stateParams, $http, toaster){
        var vm = this; 
        var _url = "/odata/Staffs";
        vm.handleDateRange = handleDateRange;
        vm.selectedStaff = {};
        vm.tagsList = [
            { "Name" : "Tag A" , "Id" : "1"},
            { "Name" : "Tag B" , "Id" : "2"},
            { "Name": "Tag C" , "Id" : "3"}
        ];
        vm.tagFilterList = [];
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
        vm.departmentSelectedIds = [ 4, 7 ];
        vm.departmentSelectOptions = {
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