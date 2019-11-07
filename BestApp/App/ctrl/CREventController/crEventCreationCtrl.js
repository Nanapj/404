'use strict';
angular.module('app')
    .controller('crEventCreationCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', function ($scope, $state, $stateParams, $http, toaster){
        var vm = this; 
        var _cusURL = "/odata/Customers";
        var _cityURL = "/odata/Cities";
        var _districtURL = "/odata/Districts";
        var _wardURL = "/odata/Wards";
        vm.createClicked = createClicked;
        vm.access_token = localStorage.getItem('access_token');
        vm.secActived = false;
        vm.citySearch = "";
        vm.selectedCity = "";
        vm.selectedDistrict = "";
        vm.selectedWard = "";
        vm.street="";
        vm.selectedDate = new Date();
        vm.cityCode ="";
        vm.districtCode = "";
        vm.selectedEventData ="";
        vm.selectedPurposeData = "";
        $scope.districtDis = 1;
        $scope.wardDis = 1;
        $scope.purDis = 1;
        $scope.actions = [
            { text: 'Ok', action: onResetOk },
            { text: 'Cancel', primary: true, action: onResetCancel }
        ];
        //genegrate GUID()
        function generateUUID() { 
            var d = new Date().getTime();
            var d2 = (performance && performance.now && (performance.now()*1000)) || 0;
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16;
                if(d > 0){
                    r = (d + r)%16 | 0;
                    d = Math.floor(d/16);
                } else {
                    r = (d2 + r)%16 | 0;
                    d2 = Math.floor(d2/16);
                }
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        }
        function refreshDistrict() {
            vm.systemCustomer.District = undefined;
            vm.systemCustomer.Ward = undefined;
            var filterDisVal = vm.selectedCity.code != undefined ? vm.selectedCity.code : "";
            var district = $("#districtdropdown").data("kendoDropDownList");
            district.dataSource.transport.options.read.url = _districtURL+"?$filter=parent_code eq '" + filterDisVal + "'&$orderby=name";
            district.dataSource.read().then(function() {
                $scope.districtDis = 0;
            });
        }
        function createClicked() {
            if(vm.systemCustomer.Name == undefined || vm.systemCustomer.Name =="") {
                toaster.pop('warning', "Rỗng", "Vui lòng điền tên khách hàng");
            } else {
                if(vm.systemCustomer.ID == undefined || vm.systemCustomer.ID == "") {
                    vm.systemCustomer.ID = generateUUID();
                    if(vm.systemCustomer.Birthday == undefined || vm.systemCustomer.Birthday == ""){
                        var time = moment(vm.selectedDate);
                        vm.systemCustomer.Birthday = time.utc().format();
                    }
                    $http({
                        url: _cusURL,
                        method: 'POST',
                        data: JSON.stringify(vm.systemCustomer),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                        },
                    }).error(function(response) {
                        toaster.pop('error', "Thất bại", response.error.innererror.message);
                    })
                    .then(function(response){
                        if(response.status == 201) {
                            toaster.pop('success', "Thành công", "Đã tạo thông tin khách hàng");
                        }
                    });
                } else {
                    $http({
                        url: _cusURL+"("+vm.systemCustomer.ID+")",
                        method: 'PUT',
                        data: JSON.stringify(vm.systemCustomer),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                        },
                    }).error(function(response) {
                        toaster.pop('error', "Thất bại", response.error.innererror.message);
                    })
                    .then(function(response){
                        if(response.status == 201) {
                            console.log(response.ID);
                            
                            toaster.pop('success', "Thành công", "Đã cập nhật thông tin khách hàng");
                        }
                        if(response.status == 204) {
                            console.log(response.ID);
                            
                            toaster.pop('success', "Thành công", "Đã cập nhật thông tin khách hàng");
                        }
                    });
                }
            }
            
            console.log(vm.systemCustomer);
        }
        $scope.onCityChanged = function () {   
            debugger;
            $scope.districtDis = 1;   
            $scope.wardDis = 1;
            console.log(vm.selectedCity);
            if(vm.selectedCity !== " Thành phố... ") {
                vm.systemCustomer.City = vm.selectedCity.name_with_type;
                refreshDistrict();
                var ward = $("#warddropdown").data("kendoDropDownList");
                ward.dataSource.read();
                ward.value("");
            } else {
                vm.systemCustomer.City = undefined;
                vm.systemCustomer.District = undefined;
                vm.systemCustomer.Ward = undefined;
            }   
        }
        $scope.onSelectedDate = function() {
            console.log(vm.selectedDate);
            var time = moment(vm.selectedDate);
            vm.systemCustomer.Birthday = time.utc().format();
            console.log(time.utc().format());
        }
        $scope.onDistrictChanged = function() {
            debugger;
            console.log(vm.selectedDistrict);
            $scope.wardDis = 1;
            if(vm.selectedDistrict !== " Quận / Huyện... ") {
                vm.systemCustomer.District = vm.selectedDistrict.name_with_type;
                var filterWardVal = vm.selectedDistrict.code != undefined ? vm.selectedDistrict.code : "";
                var ward = $("#warddropdown").data("kendoDropDownList");
                ward.dataSource.transport.options.read.url = _wardURL+"?$filter=parent_code eq '" + filterWardVal + "'&$orderby=name";
                ward.dataSource.read().then(function(){
                    }
                );
                ward.value("");
                $scope.wardDis = 0;
            } else {
                vm.systemCustomer.District = undefined;
                vm.systemCustomer.Ward = undefined;
            }   
            
        }
        $scope.onWardChanged = function() {
            console.log(vm.selectedWard);
            if(vm.selectedDistrict !== " Phường / Xã... ") {
                vm.systemCustomer.Ward = vm.selectedWard.name_with_type;
            } else {
                vm.systemCustomer.Ward = undefined;
            }   
        }
        $scope.onEventSelChanged = function() {
            $scope.purDis = 1;
            var purposedropdown = $("#purposedropdown").data("kendoDropDownList");
            purposedropdown.dataSource.filter({
                field: 'parent_id',
                operator: 'eq',
                value: vm.selectedEventData.id
            });
            purposedropdown.listView.setDSFilter(purposedropdown.dataSource.filter());
            purposedropdown.value(1);
            purposedropdown.dataSource.read();
            console.log(vm.selectedEventData);
        }
        $scope.onPurSelChanged = function() {
            console.log(vm.selectedPurposeData);
        }
        function initialCtrl() {
            $("#districtdropdown").kendoDropDownList({
                autoBind: false
            });
            $("#warddropdown").kendoDropDownList({
                autoBind: false
            });
        }
        initialCtrl();
        vm.cityData = {
            type: "odata-v4",
            serverFiltering: true,
            transport: {
                read: {
                    url: _cityURL,
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
            type: "odata-v4",
            transport: {
                read: {
                    url: _districtURL,
                }
            }
        };
        vm.eventData = { 
            type: "jsonp",
            serverFiltering: true,
            transport: {
                read: {
                    url: "../../App/localdata/EventType.json",
                }
            }
        }
        vm.message = '';   
        vm.noteEvent = '';

        vm.searchPhoneNum = function() {
            $http({
                method: 'GET',
                url: _cusURL+"?$filter=trim(PhoneNumber) eq '" + vm.searchingNumber + "'",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                },
              }).then(function successCallback(response) {
                  if(response.data.value.length > 0) { 
                    vm.secActived = true;
                    vm.tabDisable = false;
                    vm.systemCustomer = response.data.value[0];
                    //Check the customer view model
                    // console.log(vm.systemCustomer.District);
                    // console.log(vm.systemCustomer.City);
                    // console.log(vm.systemCustomer.Ward);
                    if(vm.systemCustomer.Birthday !== undefined && vm.systemCustomer.Birthday !== "") {
                        vm.selectedDate = vm.systemCustomer.Birthday;
                    }
                    var city = $('#citydropdown').data("kendoDropDownList");
                    var district = $('#districtdropdown').data("kendoDropDownList");

                    if(vm.systemCustomer.City !== undefined && vm.systemCustomer.City !== "") {          
                        $http({
                            method: 'GET',
                            url: _cityURL+"?$filter=trim(name_with_type) eq '" + vm.systemCustomer.City + "'",
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                            },
                          }).then(function successCallback(response) {
                              if(response.data.value.length > 0) {   
                                vm.cityCode = response.data.value[0].code;
                                console.log('Citicode '+ vm.cityCode);
                                district.dataSource.transport.options.read.url = _districtURL+"?$filter=parent_code eq '" + vm.cityCode + "'&$orderby=name";
                                city.select(function(dataItem) {
                                    return dataItem.name_with_type === vm.systemCustomer.City;
                                });
                                //After get the city continue to the district
                                if(vm.systemCustomer.District !== undefined && vm.systemCustomer.District !== "") {            
                                    $http({
                                        method: 'GET',
                                        url: _districtURL+"?$filter=trim(name_with_type) eq '" + vm.systemCustomer.District + "'",
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                                        },
                                      }).then(function successCallback(response) {
                                          if(response.data.value.length > 0) {   
                                            //Check the filter city by this code
                                            // console.log('got the city by filter');
                                            vm.districtCode = response.data.value[0].code;
                                            district.dataSource.read().then(function() {
                                                $scope.districtDis = 0;
                                            });
                                            district.select(function(dataItem) {
                                                $scope.districtDis = 0;                 
                                                return dataItem.name_with_type === vm.systemCustomer.District;
                                            });
                                            var ward = $('#warddropdown').data("kendoDropDownList");
                                            //Check the code of district is loaded
                                            //console.log('Districtcode: ' + vm.districtCode);
                                            ward.dataSource.transport.options.read.url = _wardURL+"?$filter=parent_code eq '" +  vm.districtCode + "'&$orderby=name";
                                            ward.dataSource.read().then(function(){
                                                    //Check if there is ward data load on the server
                                                    //console.log('reloaded the ward data');
                                                    if(vm.systemCustomer.Ward !== undefined && vm.systemCustomer.Ward !== "") {     
                                                        ward.select(function(dataItem) {
                                                            $scope.wardDis = 0;
                                                            return dataItem.name_with_type === vm.systemCustomer.Ward;
                                                        });
                                                    }
                                                }
                                            );
                                           
                                          } else 
                                          {
                                            //If no found, show here
                                            //console.log('no found');
                                          }
                                        
                                        }, function errorCallback(response) {
                                          console.log(response);
                                    });             
                                }
                              } else 
                              {
                               console.log('no found');
                              }
                            
                            }, function errorCallback(response) {
                              console.log(response);
                        });        
                    }
                  
                   
                  } else 
                  {
                    toaster.pop('warning', "Rỗng", "Không tìm thấy thông tin khách hàng");
                    vm.secActived = true;
                    vm.tabDisable = false; 
                    vm.systemCustomer.PhoneNumber = vm.searchingNumber;
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
        // function onCityDropChange(e) {
        //     alert(vm.selectedCity);
        // }
        vm.pitechCutomer = {
            'FullName': 'Nguyễn Văn A',
            'Address' : 'Số 1 Lê Duẩn',
            'City' : 'Hồ Chí Minh',
            'District' : 'Quận 3',
            'Ward' : '7',
            'Birthday' : '01/01/1909'
        };
        vm.purposeData = {
            type: "jsonp",
            serverFiltering: true,
            transport: {
                read: {
                    url: "../../App/localdata/purpose.json",
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
            type: "odata-v4",
            serverFiltering: true,
            transport: {
                read: {
                    url: _wardURL,
                }
            }
        };       
        $scope.initialEventCreationCtrl = function() {  
        }
        $scope.initialEventCreationCtrl();
    }
]);