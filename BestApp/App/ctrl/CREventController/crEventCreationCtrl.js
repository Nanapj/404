'use strict';
angular.module('app')
    .controller('crEventCreationCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', function ($scope, $state, $stateParams, $http, toaster){
        var vm = this; 
        var _cusURL = "/odata/Customers";
        vm.access_token = localStorage.getItem('access_token');
        vm.secActived = false;
        vm.citySearch = "";
        vm.selectedCity = "";
        $scope.actions = [
            { text: 'Ok', action: onResetOk },
            { text: 'Cancel', primary: true, action: onResetCancel }
        ];
        $scope.cityOption = {
            change: onCityDropChange()
        }
        vm.cityData = {
            dataType: 'jsonp',
            transport: {
                read: {
                    url: "../../App/locationdata/tinh_tp.json",
                }
            }
        };
        vm.dateOfBirth = {};
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
        vm.departmentSelectedIds = [ 4, 7 ];
        vm.districtData = {
            dataType: 'jsonp',
            transport: {
                read: {
                    url: "../../App/locationdata/quan_huyen.json",
                }
            }
        };
        vm.eventData = { 
            type: "odata-v4",
            serverFiltering: true,
            transport: {
                read: {
                    url: "https://demos.telerik.com/kendo-ui/service-v4/odata/Products",
                }
            }
        }
        vm.message = '';   
        vm.noteEvent = '';

        vm.searchPhoneNum = function() {
            $http({
                method: 'GET',
                url: _cusURL+"?$filter=PhoneNumber eq '" + vm.searchingNumber + "'",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                },
              }).then(function successCallback(response) {
                  if(response.data.value.length > 0) { 
                     vm.secActived = true;
                     vm.tabDisable = false;
                     vm.systemCustomer = response.data.value[0];
                  } else 
                  {
                    toaster.pop('warning', "Rỗng", "Không tìm thấy thông tin khách hàng");
                    vm.secActived = true;
                    vm.tabDisable = false; 
                  }
                
                }, function errorCallback(response) {
                  console.log(response);
            });
        }

        function onResetOk(e) {
            location.reload();    
        }
        function onResetCancel(e) {
            
        }
        function onCityDropChange(e) {
            alert(vm.selectedCity);
        }
        vm.pitechCutomer = {
            'FullName': 'Nguyễn Văn A',
            'Address' : 'Số 1 Lê Duẩn',
            'City' : 'Hồ Chí Minh',
            'District' : 'Quận 3',
            'Ward' : '7',
            'Birthday' : '01/01/1909'
        };
        vm.purposeData = {
            type: "odata-v4",
            serverFiltering: true,
            transport: {
                read: {
                    url: "https://demos.telerik.com/kendo-ui/service-v4/odata/Products",
                }
            }
        }
        vm.productData = {
            type: "odata-v4",
            serverFiltering: true,
            transport: {
                read: {
                    url: "https://demos.telerik.com/kendo-ui/service-v4/odata/Products",
                }
            }
        }
        vm.reminderNote = {
            type: "odata-v4",
            serverFiltering: true,
            transport: {
                read: {
                    url: "https://demos.telerik.com/kendo-ui/service-v4/odata/Products",
                }
            }
        }
        $scope.phoneNumChange = function() {
            if(vm.searchingNumber != null && 
                vm.searchingNumber != undefined && 
                vm.searchingNumber.length == 10 
            ){
                vm.tabDisable = false;
            } else {
                vm.tabDisable = true;
            }
        }
        vm.searchingNumber = '';
        vm.selectOptions = {
            placeholder: "Tag...",
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
        vm.selectedIds = [ 4, 7 ];
        vm.systemCustomer = {}
        vm.tabDisable = true;
        vm.wardData = {
            dataType: 'jsonp',
            transport: {
                read: {
                    url: "../../App/locationdata/xa_phuong.json",
                }
            }
        };       
        $scope.initialEventCreationCtrl = function() {  
        }
        $scope.initialEventCreationCtrl();
    }
]);