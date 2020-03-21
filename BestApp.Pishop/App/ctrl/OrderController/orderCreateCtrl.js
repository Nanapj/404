'use strict';

angular.module('app')
    .controller('OrderCreateCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', 'blockUI', function ($scope, $state, $stateParams, $http, toaster, blockUI) {
        var _url = "/odata/Orders";
        var vm = this;
        vm.model = {};  // có 1 trường k nằm trong OrderViewModel  là Post(null)
        vm.model.IsGift = false;
        
        vm.Quantity = 1;
        vm.access_token = localStorage.getItem('access_token');
        vm.model.Total = 0; //tổng tiền thanh toán
        vm.model.TypeOrder = "Mua";
        
        vm.selectedProductsData = {};
        vm.orderBack = orderBack;
        var blockui = blockUI.instances.get('BlockUI');
        vm.Customer = {};
   
     
        function orderBack() {
            $state.go('app.order.index');
        }
        var checkSearchPhone = false;
      
        vm.SearchPhone = function () {
            $http({
                method: 'GET',
                url: "/odata/Customers?$filter=PhoneNumber eq '" + vm.Customer.PhoneNumber + "'",

                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + vm.access_token.replace(/['"]+/g, '')
                },
            }).then(function successCallback(response) {
                if (response.data.value[0] != null) {

                    checkSearchPhone = true;

                    toaster.pop('info', "Thông báo", "Có thông tin khách hàng");
                    vm.InforCustomer = response.data.value[0];
                    vm.model.CustomerID = vm.InforCustomer.ID;
                    vm.Customer.Name = vm.InforCustomer.Name;
                    vm.Customer.Birthday = vm.InforCustomer.Birthday;
                    vm.Customer.City = vm.InforCustomer.City;
                    vm.Customer.District = vm.InforCustomer.District;
                    vm.Customer.Ward = vm.InforCustomer.Ward;
                    vm.Customer.Address = vm.InforCustomer.Address;
                    //vm.selectedCity = vm.InforCustomer.City;
                    //gán city district ward
                    var city = $('#citydropdown').data("kendoDropDownList");
                    var district = $('#districtdropdown').data("kendoDropDownList");
                    var ward = $('#warddropdown').data("kendoDropDownList");
                    city.select(function (dataItem) {
                        return dataItem.name_with_type === vm.InforCustomer.City;
                    });
                    district.select(function (dataItem) {
                        return dataItem.name_with_type === vm.InforCustomer.District;
                    });
                    ward.select(function (dataItem) {
                        return dataItem.name_with_type === vm.InforCustomer.Ward;
                    });
                    $scope.districtDis = false;
                    $scope.wardDis = false;  
                }
                else {
                    vm.model.CustomerID = "";
                    vm.Customer.Name = "";
                    vm.Customer.Birthday = "";
                    vm.Customer.City = "";
                    vm.Customer.District = "";
                    vm.Customer.Ward = "";
                    vm.Customer.Address = "";
                    checkSearchPhone = false;

                    var city = $('#citydropdown').data("kendoDropDownList");
                    var district = $('#districtdropdown').data("kendoDropDownList");
                    var ward = $('#warddropdown').data("kendoDropDownList");
                    city.select(function (dataItem) {
                        return dataItem.name_with_type === " Thành phố... ";
                    });
                    district.select(function (dataItem) {
                        return dataItem.name_with_type === " Quận / Huyện... ";
                    });
                    ward.select(function (dataItem) {
                        return dataItem.name_with_type === " Phường / Xã... ";
                    });
                    $scope.districtDis = true;
                    $scope.wardDis = true;  
                    toaster.pop('warning', "Thông báo", "Không có thông tin khách hàng");
                }
            });
        }
        //tạo đơn hàng
        vm.createOrder = function () {
            blockui.start();
            //phải có sản phẩm, SDT tên KH != null
        
            if (vm.model.OrderDetails.length > 0) {
                if (vm.Customer.PhoneNumber !== "" && vm.Customer.PhoneNumber !== undefined && vm.Customer.Name !== "" && vm.Customer.Name !== undefined ) {
                   
                    //check trong OrderDetails có item nào là IsGift không?
                    for (var i = 0; i < vm.model.OrderDetails.length; i++) {
                        if (vm.model.OrderDetails[i].IsGift === true) {
                            vm.model.IsGift = true;
                        }
                    }
                    if (checkSearchPhone === false) //tạo thông tin khách hàng khi không tìm thầy thông tin KH
                    {
                        if (vm.Customer.Birthday == null || vm.Customer.Birthday === "" || vm.Customer.Birthday === undefined)
                            vm.Customer.Birthday = null;
                        $http({
                            url: "/odata/Customers",
                            method: 'POST',
                            data: JSON.stringify(vm.Customer),
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + vm.access_token.replace(/['"]+/g, '')
                            },
                        }).then(function (response) {
                            if (response.status == 201) {
                                
                                //lay customerID gan vao model

                                vm.model.CustomerID = response.data.ID;
                                $http({
                                    url: _url,
                                    method: 'POST',
                                    data: JSON.stringify(JSON.parse(angular.toJson(vm.model))), //remove $$hashkey 
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer ' + vm.access_token.replace(/['"]+/g, '')
                                    },
                                }).then(function (response) {
                                    if (response.status == 201) {
                                        toaster.pop('success', "Thành công", "Đã tạo đơn hàng");
                                        $state.go('app.order.index');
                                        blockui.stop();
                                    }
                                });
                                blockui.stop();
                            }
                        });
                    }
                    else {
                        $http({
                            url: _url,
                            method: 'POST',
                            data: JSON.stringify(JSON.parse(angular.toJson(vm.model))), //remove $$hashkey 
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + vm.access_token.replace(/['"]+/g, '')
                            },
                        }).then(function (response) {
                            if (response.status == 201) {
                                toaster.pop('success', "Thành công", "Đã tạo đơn hàng");
                                $state.go('app.order.index');
                                blockui.stop();
                            }
                        });
                        blockui.stop();
                    }

                }
                else {
                    toaster.pop('warning', "Chưa điền thông tin khách hàng", "Vui lòng điền đầy đủ thông tin");
                    blockui.stop();
                }
                
            }
            else {
                toaster.pop('warning', "Chưa chọn sản phẩm nào", "Vui lòng chọn sản phẩm");
                blockui.stop();
            }
        }
        vm.productsData = {
            type: "odata-v4",
            serverFiltering: true,
            transport: {
                read: {
                    url: "/odata/ProductTypes",
                }
            }
        }
        vm.listAttribute = {};
        //chọn sản phẩm từ dropdown Product
        vm.Total = 0;
        $scope.onProductsSelChanged = function () {
            if (vm.selectedProductsData !== undefined && vm.selectedProductsData.Name !== " Sản phẩm ") {
                $("#price").prop("disabled", false);
                $("#quantity").prop("disabled", false);
                $("#serial").prop("disabled", false);
            }
            else {
                $("#price").prop("disabled", true);
                $("#quantity").prop("disabled", true);
                $("#serial").prop("disabled", true);
            }
            vm.Price = vm.selectedProductsData.Price;
            vm.Total = vm.selectedProductsData.Price * vm.Quantity;
    

        
            
            //hien attribute tuong ung
            $http({
                url: "odata/ProductAttributes?$filter=ProductName eq " + "'"+vm.selectedProductsData.Name+"'" ,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + vm.access_token.replace(/['"]+/g, '')
                },
            }).then(function (response) {
                if (response.status == 200) {
                    vm.listAttribute = response.data.value;
                        
                }
            });
           
                
        }
        vm.initTotal = 0;
        $scope.changeQuantity = function () {
            
            if (vm.initTotal === 0 && vm.selectedProductsData !== undefined) //chưa change input Total(giá)
                vm.Total = vm.selectedProductsData.Price * vm.Quantity;
            else
                vm.Total = vm.initTotal * vm.Quantity;
        }
        $scope.changeTotal = function () {
            vm.Quantity = 1;
            vm.initTotal = vm.Total;
        }
        vm.model.OrderDetails = [];
        $scope.checkGiftModel = {
            value1: false,
        };
        vm.selectedProductsData = $('#productsdropdown').optionLabel;
        //click thêm sp: thêm sản phẩm xuống table list products 
        
        vm.AddProduct = function () {
            
            if (vm.selectedProductsData != null && vm.selectedProductsData != undefined && isNaN(vm.Total) == false && vm.selectedProductsData.Name !== " Sản phẩm ") {
                vm.Product = {};
                vm.Product.ProductID = vm.selectedProductsData.ID
                vm.Product.ProductName = vm.selectedProductsData.Name;
                vm.Product.Quantity = vm.Quantity;
                vm.Product.Serial = vm.Serial;
                vm.Product.Serial = angular.uppercase(vm.Product.Serial);
                vm.Product.Price = vm.Total / vm.Quantity; //lưu giá quantity = 1
                if ($scope.checkGiftModel.value1) {
                    vm.Product.IsGift = true;
                } else {
                    vm.Product.IsGift = false;
                }

                //thêm thuộc tính vào OrderStatistics

                vm.Product.OrderStatistics = [];
                for (var i = 0; i < vm.listAttribute.length; i++) {
                    vm.Attribute = {};

                    vm.Attribute.ProductAttributeId = vm.listAttribute[i].ID;
                    vm.Attribute.ProductAttributeName = vm.listAttribute[i].Name;

                    vm.Attribute.ProductAttributeNote = vm.listAttribute.note[i];

                    vm.Product.OrderStatistics.push(vm.Attribute);
                }


                //them vào list product
                vm.model.OrderDetails.push(vm.Product);

                //sum total
                vm.model.Total = 0;
                for (var i = 0; i < vm.model.OrderDetails.length; i++) {
                    vm.model.Total += (vm.model.OrderDetails[i].Price * vm.model.OrderDetails[i].Quantity);
                }

                //reset Product Information 
                vm.Quantity = 1;
                vm.Price = 0;
                vm.Total = 0;
                vm.initTotal = 0;
                vm.Serial = "";
                $scope.checkGiftModel.value1 = false;
                vm.selectedProductsData = $('#productsdropdown').optionLabel;
                vm.listAttribute = {};
                $("#quantity").prop("disabled", true);
                $("#price").prop("disabled", true);
                $("#serial").prop("disabled", true);
            }
            else {
                toaster.pop('warning', "Chưa chọn sản phẩm", "Vui lòng chọn sản phẩm");
            } 
        }
        //xóa tất cả
        vm.deleteall = function () {
            vm.model.OrderDetails = [];
            vm.model.Total = 0;
          
        }
        //xóa từng item
        vm.delete1Item = function (i) {
            vm.model.OrderDetails.splice(i, 1);
            vm.model.Total = 0;
            for (var i = 0; i < vm.model.OrderDetails.length; i++) {
                vm.model.Total += (vm.model.OrderDetails[i].Price * vm.model.OrderDetails[i].Quantity);
            }
        }
        //dropdown city district ward
        var _cityURL = "/odata/Cities";
        var _districtURL = "/odata/Districts";
        var _wardURL = "/odata/Wards";
        vm.selectedCity = "";
        vm.selectedDistrict = "";
        $scope.districtDis = true;
        $scope.wardDis = true;
        vm.cityData = {
            type: "odata-v4",
            serverFiltering: true,
            transport: {
                read: {
                    url: _cityURL,
                }
            }
        };   
        vm.districtData = {
            type: "odata-v4",
            transport: {
                read: {
                    url: _districtURL,
                }
            }
        };
        vm.wardData = {
            type: "odata-v4",
            transport: {
                read: {
                    url: _wardURL,
                }
            }
        };

        function refreshDistrict() {
            vm.Customer.District = undefined;
            vm.Customer.Ward = undefined;
            var filterDisVal = vm.selectedCity.code != undefined ? vm.selectedCity.code : "";
            var district = $("#districtdropdown").data("kendoDropDownList");
            district.dataSource.transport.options.read.url = _districtURL + "?$filter=parent_code eq '" + filterDisVal + "'&$orderby=name&$top=100";
            district.dataSource.read();
            $scope.districtDis = false;
        }
        $scope.onCityChanged = function () {
            if (vm.selectedCity.name_with_type !== " Thành phố... ") {
                vm.Customer.City = vm.selectedCity.name_with_type;
                refreshDistrict();
                var ward = $("#warddropdown").data("kendoDropDownList");
                ward.dataSource.read();
                ward.value("");
            } else {
                $scope.districtDis = true;
                $scope.wardDis = true;  
                vm.Customer.City = undefined;
                vm.Customer.District = undefined;
                vm.Customer.Ward = undefined;
            }
        }
        $scope.onDistrictChanged = function () {
            $scope.wardDis = 1;
            if (vm.selectedDistrict.name_with_type !== " Quận / Huyện... ") {
                vm.Customer.District = vm.selectedDistrict.name_with_type;
                var filterWardVal = vm.selectedDistrict.code != undefined ? vm.selectedDistrict.code : "";
                var ward = $("#warddropdown").data("kendoDropDownList");
                ward.dataSource.transport.options.read.url = _wardURL + "?$filter=parent_code eq '" + filterWardVal + "'&$orderby=name&$top=100";
                ward.dataSource.read();
                ward.value("");
                $scope.wardDis = false;
            } else {
                $scope.wardDis = true;
                vm.Customer.District = undefined;
                vm.Customer.Ward = undefined;
            }

        }
        $scope.onWardChanged = function () {
            if (vm.selectedDistrict !== " Phường / Xã... ") {
                vm.Customer.Ward = vm.selectedWard.name_with_type;
            } else {
                vm.Customer.Ward = undefined;
            }
        }

        //dropdown ten nv bán hàng
        vm.staffData = {
            type: "odata-v4",
            transport: {
                read: {
                    url: "/odata/Staffs",
                }
            }
        }
        $scope.onStaffChanged = function () {
            if (vm.selectedStaff.FullName !== " Tên nhân viên ") {
                vm.model.SaleEmployeeName = vm.selectedStaff.FullName;
                vm.model.SaleEmployeeID = vm.selectedStaff.ID;
            } else {
                vm.model.SaleEmployeeName = undefined;
                vm.model.SaleEmployeeID = undefined;
            }
        }
    }])

    
   