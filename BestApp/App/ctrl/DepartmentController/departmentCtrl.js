'use strict';

angular.module('app')
    .controller('DepartmentCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', function ($scope, $state, $stateParams, $http, toaster){
        var _url = "/odata/Staffs";
        var vm = this;
        vm.model = {};
        vm.model.DepartmentTag =[
            {
                "ProductID":1,
                "ProductName":"Chai",
                "SupplierID":1,
                "CategoryID":1,
                "QuantityPerUnit":"10 boxes x 20 bags",
                "UnitPrice":18.0000,
                "UnitsInStock":39,
                "UnitsOnOrder":0,
                "ReorderLevel":10,
                "Discontinued":false,
                "Order_Details":[
                   {
                      "OrderID":10285,
                      "ProductID":1,
                      "UnitPrice":14.4000,
                      "Quantity":45,
                      "Discount":0.2
                   },
                   {
                      "OrderID":10294,
                      "ProductID":1,
                      "UnitPrice":14.4000,
                      "Quantity":18,
                      "Discount":0
                   },
                   {
                      "OrderID":10317,
                      "ProductID":1,
                      "UnitPrice":14.4000,
                      "Quantity":20,
                      "Discount":0
                   },
                   {
                      "OrderID":10348,
                      "ProductID":1,
                      "UnitPrice":14.4000,
                      "Quantity":15,
                      "Discount":0.15
                   },
                   {
                      "OrderID":10354,
                      "ProductID":1,
                      "UnitPrice":14.4000,
                      "Quantity":12,
                      "Discount":0
                   },
                   {
                      "OrderID":10370,
                      "ProductID":1,
                      "UnitPrice":14.4000,
                      "Quantity":15,
                      "Discount":0.15
                   },
                   {
                      "OrderID":10406,
                      "ProductID":1,
                      "UnitPrice":14.4000,
                      "Quantity":10,
                      "Discount":0
                   },
                   {
                      "OrderID":10413,
                      "ProductID":1,
                      "UnitPrice":14.4000,
                      "Quantity":24,
                      "Discount":0
                   },
                   {
                      "OrderID":10477,
                      "ProductID":1,
                      "UnitPrice":14.4000,
                      "Quantity":15,
                      "Discount":0
                   },
                   {
                      "OrderID":10522,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":40,
                      "Discount":0.2
                   },
                   {
                      "OrderID":10526,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":8,
                      "Discount":0.15
                   },
                   {
                      "OrderID":10576,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":10,
                      "Discount":0
                   },
                   {
                      "OrderID":10590,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":20,
                      "Discount":0
                   },
                   {
                      "OrderID":10609,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":3,
                      "Discount":0
                   },
                   {
                      "OrderID":10611,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":6,
                      "Discount":0
                   },
                   {
                      "OrderID":10628,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":25,
                      "Discount":0
                   },
                   {
                      "OrderID":10646,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":15,
                      "Discount":0.25
                   },
                   {
                      "OrderID":10689,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":35,
                      "Discount":0.25
                   },
                   {
                      "OrderID":10691,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":30,
                      "Discount":0
                   },
                   {
                      "OrderID":10700,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":5,
                      "Discount":0.2
                   },
                   {
                      "OrderID":10729,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":50,
                      "Discount":0
                   },
                   {
                      "OrderID":10752,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":8,
                      "Discount":0
                   },
                   {
                      "OrderID":10838,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":4,
                      "Discount":0.25
                   },
                   {
                      "OrderID":10847,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":80,
                      "Discount":0.2
                   },
                   {
                      "OrderID":10863,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":20,
                      "Discount":0.15
                   },
                   {
                      "OrderID":10869,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":40,
                      "Discount":0
                   },
                   {
                      "OrderID":10905,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":20,
                      "Discount":0.05
                   },
                   {
                      "OrderID":10911,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":10,
                      "Discount":0
                   },
                   {
                      "OrderID":10918,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":60,
                      "Discount":0.25
                   },
                   {
                      "OrderID":10935,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":21,
                      "Discount":0
                   },
                   {
                      "OrderID":11003,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":4,
                      "Discount":0
                   },
                   {
                      "OrderID":11005,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":2,
                      "Discount":0
                   },
                   {
                      "OrderID":11006,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":8,
                      "Discount":0
                   },
                   {
                      "OrderID":11025,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":10,
                      "Discount":0.1
                   },
                   {
                      "OrderID":11031,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":45,
                      "Discount":0
                   },
                   {
                      "OrderID":11035,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":10,
                      "Discount":0
                   },
                   {
                      "OrderID":11047,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":25,
                      "Discount":0.25
                   },
                   {
                      "OrderID":11070,
                      "ProductID":1,
                      "UnitPrice":18.0000,
                      "Quantity":40,
                      "Discount":0.15
                   }
                ]
             },
             {
                "ProductID":2,
                "ProductName":"Chang",
                "SupplierID":1,
                "CategoryID":1,
                "QuantityPerUnit":"24 - 12 oz bottles",
                "UnitPrice":19.0000,
                "UnitsInStock":17,
                "UnitsOnOrder":40,
                "ReorderLevel":25,
                "Discontinued":false,
                "Order_Details":[
                   {
                      "OrderID":10255,
                      "ProductID":2,
                      "UnitPrice":15.2000,
                      "Quantity":20,
                      "Discount":0
                   },
                   {
                      "OrderID":10258,
                      "ProductID":2,
                      "UnitPrice":15.2000,
                      "Quantity":50,
                      "Discount":0.2
                   },
                   {
                      "OrderID":10264,
                      "ProductID":2,
                      "UnitPrice":15.2000,
                      "Quantity":35,
                      "Discount":0
                   },
                   {
                      "OrderID":10298,
                      "ProductID":2,
                      "UnitPrice":15.2000,
                      "Quantity":40,
                      "Discount":0
                   },
                   {
                      "OrderID":10327,
                      "ProductID":2,
                      "UnitPrice":15.2000,
                      "Quantity":25,
                      "Discount":0.2
                   },
                   {
                      "OrderID":10335,
                      "ProductID":2,
                      "UnitPrice":15.2000,
                      "Quantity":7,
                      "Discount":0.2
                   },
                   {
                      "OrderID":10342,
                      "ProductID":2,
                      "UnitPrice":15.2000,
                      "Quantity":24,
                      "Discount":0.2
                   },
                   {
                      "OrderID":10393,
                      "ProductID":2,
                      "UnitPrice":15.2000,
                      "Quantity":25,
                      "Discount":0.25
                   },
                   {
                      "OrderID":10418,
                      "ProductID":2,
                      "UnitPrice":15.2000,
                      "Quantity":60,
                      "Discount":0
                   },
                   {
                      "OrderID":10435,
                      "ProductID":2,
                      "UnitPrice":15.2000,
                      "Quantity":10,
                      "Discount":0
                   },
                   {
                      "OrderID":10440,
                      "ProductID":2,
                      "UnitPrice":15.2000,
                      "Quantity":45,
                      "Discount":0.15
                   },
                   {
                      "OrderID":10469,
                      "ProductID":2,
                      "UnitPrice":15.2000,
                      "Quantity":40,
                      "Discount":0.15
                   },
                   {
                      "OrderID":10485,
                      "ProductID":2,
                      "UnitPrice":15.2000,
                      "Quantity":20,
                      "Discount":0.1
                   },
                   {
                      "OrderID":10504,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":12,
                      "Discount":0
                   },
                   {
                      "OrderID":10611,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":10,
                      "Discount":0
                   },
                   {
                      "OrderID":10622,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":20,
                      "Discount":0
                   },
                   {
                      "OrderID":10632,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":30,
                      "Discount":0.05
                   },
                   {
                      "OrderID":10641,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":50,
                      "Discount":0
                   },
                   {
                      "OrderID":10703,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":5,
                      "Discount":0
                   },
                   {
                      "OrderID":10714,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":30,
                      "Discount":0.25
                   },
                   {
                      "OrderID":10722,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":3,
                      "Discount":0
                   },
                   {
                      "OrderID":10741,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":15,
                      "Discount":0.2
                   },
                   {
                      "OrderID":10766,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":40,
                      "Discount":0
                   },
                   {
                      "OrderID":10787,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":15,
                      "Discount":0.05
                   },
                   {
                      "OrderID":10792,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":10,
                      "Discount":0
                   },
                   {
                      "OrderID":10806,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":20,
                      "Discount":0.25
                   },
                   {
                      "OrderID":10813,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":12,
                      "Discount":0.2
                   },
                   {
                      "OrderID":10829,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":10,
                      "Discount":0
                   },
                   {
                      "OrderID":10851,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":5,
                      "Discount":0.05
                   },
                   {
                      "OrderID":10852,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":15,
                      "Discount":0
                   },
                   {
                      "OrderID":10856,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":20,
                      "Discount":0
                   },
                   {
                      "OrderID":10866,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":21,
                      "Discount":0.25
                   },
                   {
                      "OrderID":10885,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":20,
                      "Discount":0
                   },
                   {
                      "OrderID":10888,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":20,
                      "Discount":0
                   },
                   {
                      "OrderID":10939,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":10,
                      "Discount":0.15
                   },
                   {
                      "OrderID":10991,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":50,
                      "Discount":0.2
                   },
                   {
                      "OrderID":11021,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":11,
                      "Discount":0.25
                   },
                   {
                      "OrderID":11030,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":100,
                      "Discount":0.25
                   },
                   {
                      "OrderID":11041,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":30,
                      "Discount":0.2
                   },
                   {
                      "OrderID":11049,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":10,
                      "Discount":0.2
                   },
                   {
                      "OrderID":11070,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":20,
                      "Discount":0.15
                   },
                   {
                      "OrderID":11072,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":8,
                      "Discount":0
                   },
                   {
                      "OrderID":11075,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":10,
                      "Discount":0.15
                   },
                   {
                      "OrderID":11077,
                      "ProductID":2,
                      "UnitPrice":19.0000,
                      "Quantity":24,
                      "Discount":0.2
                   }
                ]
             }
        ];
        vm.selectedStaff = {};
        vm.toolbarTemplate = toolbarTemplate;
        vm.create = create;
        vm.edit = edit;
        vm.destroy = destroy;
        function toolbarTemplate() {
            return kendo.template($("#toolbar").html());
        }
        function create(){
            $state.go('app.department.create');
            vm.editMode = false;
        }

        function edit(){
            $state.go('app.department.edit', {
                Id: vm.selectedStaff.Id
            });
        }

        function destroy(){
            alert('Deleted Button clicked');
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
            height: 700,
            dataBound: onDataBound,
            change: onChange,
            columns: [
                {
                    field: "FullName",
                    title: "Full Name",
                    width: "50px"
                },
                {
                    field: "Phone",
                    title: "Phone",
                    width: "50px"
                },
                {
                    field: "Email",
                    title: "Email",
                    width: "50px"
                },
                {
                    field: "Address",
                    title: "Address",
                    width: "80px"
                }
            ]
        };
        function onDataBound(e) {
            this.expandRow(this.tbody.find("tr.k-master-row").first());
        }
        function onChange(e) {
            var grid = $('#departmentGrid').data('kendoGrid');
            var selectedItem = grid.dataItem(grid.select());
            vm.selectedStaff = selectedItem;
        }
        $scope.tagGridOptions = {
            // dataSource: {
            //     type:'odata-v4',
            //     transport: {
            //         read: {
            //             url: function () {
            //                 return "https://demos.telerik.com/kendo-ui/service-v4/odata/Products";
            //             }
            //         },
            //         update: {
            //             url: function (dataItem) {
            //                 return "https://demos.telerik.com/kendo-ui/service-v4/odata/Products(" + dataItem.ProductID + ")";
            //             }
            //         },
            //         batch: {
            //             url: function () {
            //                 return "https://demos.telerik.com/kendo-ui/service-v4/odata/$batch";
            //             }
            //         },
            //         create: {
            //             url: function (dataItem) {
            //                 delete dataItem.ProductID;
            //                 return "https://demos.telerik.com/kendo-ui/service-v4/odata/Products";
            //             }
            //         },
            //         destroy: {
            //             url: function (dataItem) {
            //                 return "https://demos.telerik.com/kendo-ui/service-v4/odata/Products(" + dataItem.ProductID + ")";
            //             }
            //         }
            //     },
            //     batch: true,
            //     pageSize: 10,      
            //     schema: {
            //         model: {
            //             id: "ProductID",
            //             fields: {
            //                 ProductID: { editable: false, nullable: true },
            //                 ProductName: { validation: { required: true } },
            //                 UnitPrice: { type: "number", validation: { required: true, min: 1} },
            //                 Discontinued: { type: "boolean" },
            //                 UnitsInStock: { type: "number", validation: { min: 0, required: true } }
            //             }
            //         }
            //     }
            // },
            
            dataSource: vm.model.DepartmentTag,
            sortable: true,
            pageable: true,
            height: 468,
            columns: [
                "ProductName",
                { field: "UnitPrice", title: "Unit Price", format: "{0:c}", width: "120px" },
                { field: "UnitsInStock", title:"Units In Stock", width: "120px" },
                { field: "Discontinued", width: "120px", editor: customBoolEditor },
                { command: ["edit", "destroy"], title: "&nbsp;", width: "250px" }
            ],
            editable: "inline"
        };
        function customBoolEditor(container, options) {
            var guid = kendo.guid();
            $('<input class="k-checkbox" id="' + guid + '" type="checkbox" name="Discontinued" data-type="boolean" data-bind="checked:Discontinued">').appendTo(container);
            $('<label class="k-checkbox-label" for="' + guid + '">&#8203;</label>').appendTo(container);
        }
    }
]);