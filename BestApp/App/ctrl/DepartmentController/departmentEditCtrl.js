'use strict';

angular.module('app')
    .controller('DepartmentEditCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', 'blockUI', function ($scope, $state, $stateParams, $http, toaster, blockUI){
        var _url = "/odata/Staffs";
        var vm = this;
        vm.access_token = localStorage.getItem('access_token');
        vm.model = {};
        vm.selectedStaff = {};
        vm.model.HasAccount = false;
        vm.toolbarTemplate = toolbarTemplate;
        var editBlock = blockUI.instances.get('EditBlockUI');
        var crudServiceBaseUrl = "https://demos.telerik.com/kendo-ui/service";
        function toolbarTemplate() {
            return kendo.template($("#toolbar").html());
        }
        $scope.initStaffEdit = function() {
            $http({
                method: 'GET',
                url: _url+'?$filter=Id eq ' + $stateParams.Id.replace(/['"]+/g, ''),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                },
              }).then(function successCallback(response) {
                  if(response.data.value.length > 0) { 
                    var staff = response.data.value[0];
                    vm.model = staff;
                  } else 
                  {
                    toaster.pop('warning', "Rỗng", "Không tìm thấy thông tin nhân viên");
                  }
                
                }, function errorCallback(response) {
                  console.log(response);
            });
        }
        $scope.initStaffEdit();
        vm.editSubmit = function() {
            editBlock.start();
            $http({
                url: _url+'('+ $stateParams.Id.replace(/['"]+/g, '') +')',
                method: 'PUT',
                data: JSON.stringify(vm.model),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                },
            }).then(function(response){
                if(response.status == 204) {
                    editBlock.stop();
                    toaster.pop('success', "Thành công", "Đã cập nhật xong");
                } else {
                    toaster.pop('error', "Lỗi", "Có lỗi trong quá trình cập nhật");
                }
            });
        }
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