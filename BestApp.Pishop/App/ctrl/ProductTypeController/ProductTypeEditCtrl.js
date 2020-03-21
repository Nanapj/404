'use strict';
angular.module('app')
    .controller('ProductTypeEditCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', function ($scope, $state, $stateParams, $http, toaster){
        var _url = "/odata/ProductTypes";
        var vm = this;
        vm.access_token = localStorage.getItem('access_token');
        vm.model = {};
        vm.editProductTypeBack = editProductTypeBack;
        
        $scope.initProductType = function() {
            $http({
                method: 'GET',
                url: _url+'?$filter=Id eq ' + $stateParams.ID.replace(/['"]+/g, ''),
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
        $scope.initProductType();
        function editProductTypeBack(){
            $state.go('app.producttype.index');
        }
        vm.editSubmit = function() {
            $http({
                url: _url+'('+ $stateParams.ID.replace(/['"]+/g, '') +')',
                method: 'PUT',
                data: JSON.stringify(vm.model),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                },
            }).then(function(response){
                if(response.status == 204) {
                    toaster.pop('success', "Thành công", "Đã cập nhật xong");
                    $state.go('app.producttype.index');
                } else {
                    toaster.pop('error', "Lỗi", "Có lỗi trong quá trình cập nhật");
                }
            });
        }
        function CreateGuid() {
            function _p8(s) {
                var p = (Math.random().toString(16) + "000000000").substr(2, 8);
                return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
            }
            return _p8() + _p8(true) + _p8(true) + _p8();
        }  


        //product attribute
        $scope.productAttributeOptions = {
            dataSource: {
                type: 'odata-v4',
                transport: {
                    read: {
                        url: function () {
                            return "/odata/ProductAttributes" + "?$filter=ProductTypeID eq " + $stateParams.ID.replace(/['"]+/g, '') ;
                        }
                    },
                    update: {
                        url: function (dataItem) {
                            return "/odata/ProductAttributes" + "(" + dataItem.ID + ")";
                        }
                    },
                    create: {
                        url: function (dataItem) {
                         
                            // delete dataItem;
                            dataItem.ID = CreateGuid();
                            delete dataItem.ID;
                            dataItem.ProductTypeID = $stateParams.ID.replace(/['"]+/g, '');
                            $http({
                                method: 'POST',
                                url: "/odata/ProductAttributes",
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + vm.access_token.replace(/['"]+/g, '')
                                },
                                data: JSON.stringify(dataItem)
                            }).then(function successCallback(response) {
                                if (response.status == 201) {
                                    toaster.pop('success', "Thành công", "Đã tạo thuộc tính");
                                    $('#productAttributeGrid').data('kendoGrid').dataSource.read();
                                    $('#productAttributeGrid').data('kendoGrid').refresh();
                                    return "/odata/ProductAttributes";
                                }
                            }, function errorCallback(response) {
                                console.log(response);
                            });
                        }
                    },
                    destroy: {
                        url: function (dataItem) {
                            $http({
                                method: 'DELETE',
                                url: "/odata/ProductAttributes" + "(" + dataItem.ID + ")",
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + vm.access_token.replace(/['"]+/g, '')
                                },
                                data: JSON.stringify(dataItem)
                            }).then(function successCallback(response) {
                                if (response.status == 200) {
                                    toaster.pop('success', "Xóa", "Đã xóa thuộc tính");
                                    $('#productAttributeGrid').data('kendoGrid').dataSource.read();
                                    $('#productAttributeGrid').data('kendoGrid').refresh();
                                    return "/odata/ProductAttributes";
                                }
                            }, function errorCallback(response) {
                                console.log(response);
                            });
                        }
                    }
                },
                pageSize: 10,
                schema: {
                    model: {
                        id: "ID",
                        fields: {
                            ID: { editable: false, nullable: true },
                            Name: { type: "string" },
                            ID: { type: "string" },
                            Name: { type: "string" }
                        }
                    }
                }
            },
            sortable: true,
            pageable: true,
            height: 220,
            columns: [
                { field: "Name", title: "Tên mục đích", width: "250px" },
                { command: ["edit", "destroy"], title: "&nbsp;", width: "200px" }
            ],
            editable: "inline"
        };
    }
]);