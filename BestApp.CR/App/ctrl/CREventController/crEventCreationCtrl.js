'use strict';
angular.module('app')
    .controller('crEventCreationCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', '$anchorScroll', function ($scope, $state, $stateParams, $http, toaster, $anchorScroll){
        var vm = this; 
        var _eventURL = "/odata/Events";
        var _departmentURL = "/odata/Departments";
        var _cusURL = "/odata/Customers";
        var _cityURL = "/odata/Cities";
        var _districtURL = "/odata/Districts";
        var _eventReminder = "/odata/ReminderNotes";
        var _wardURL = "/odata/Wards";
        var _tagURL = "/odata/Tags";
        var _eventTypeURL = "/odata/EventTypes";
        var _productTypeOdata = "/odata/ProductTypes";
        var _interactURL = "/odata/InteractionHistories/";
        var _pitechCusURL = "https://pitechadminapiv3.azurewebsites.net/project404.aspx/GetCustomerInfoByPhone";
        var _pitechDevURL = "https://pitechadminapiv3.azurewebsites.net/project404.aspx/GetDeviceListByPhoneNumber";
        var _pitechDeviceDetailsURL = "https://pitechadminapiv3.azurewebsites.net/project404.aspx/GetDeviceInfoBySerialNo";
        var _pitechSessionId = "2d0d89b1-0c3a-4579-4bec-cb5bf75fb3a6";
        vm.creUpdCusClicked = creUpdCusClicked;
        vm.access_token = localStorage.getItem('access_token');
        vm.secActived = false;
        vm.citySearch = "";
        vm.selectedCity = "";
        vm.selectedDistrict = "";
        vm.selectedWard = "";
        vm.street="";
        vm.selectedDate = new Date();
        vm.reminderSelectedDate = new Date();
        vm.cityCode ="";
        vm.districtCode = "";
        vm.selectedEventData ="";
        vm.selectedPurposeData = "";
        vm.eventProductTypeSelectedData = "";
        vm.reminderProductTypeSelectedData = "";
        vm.reminderEvent = {};
        vm.eventCR = {
            DetailEvents: [],
            InteractionHistories: [],
            ReminderNotes: [],
            Tags: [],
            EStatusLogs: []
        }
        vm.reminderCR = {
            ReminderNotes: [],
            InteractionHistories: [],
            Tags: []
        }
        vm.crDepartmentListTag = [];     
        vm.reminderDepartmentListTag = [];
        vm.crtagSelectected = [];
        vm.reminderTagSelected = [];
        vm.eventCRDetails = {};
        vm.interactionHistoryObj = {};
        vm.reminderInteractHistory = {};
        vm.reminderCRDetails = {};
        vm.tooltipsVisible = false;
        vm.serialSelectedData = "";
        vm.reminderSerialSelectedData = "";
        vm.serialData = {
            data: []
        };
        vm.reminderSerialData = {
            data: []
        }
        
        $scope.districtDis = 1;
        $scope.wardDis = 1;
        $scope.eventTypeDis = 1;
        $scope.purDis = 1;
        $scope.tab2Invisible = true;
        $scope.tab1Inisible = true;
        $scope.pitechInfoInvi = true;
        $scope.actions = [
            { text: 'Ok', action: onResetOk },
            { text: 'Cancel', primary: true, action: onResetCancel }
        ];
        vm.EventIDReturn = "";
        $scope.dropVisible = true;
        $scope.serialVisible = false;

        // $scope.gotoDiv = function(x) {
        //     if ($location.hash() !== newHash) {
        //       $location.hash(x);
        //     } else {
        //       $anchorScroll();
        //     }
        // };
        //genegrate GUID()
        function compareDate(str1){
            // str1 format should be dd/mm/yyyy. Separator can be anything e.g. / or -. It wont effect
            var dt1   = parseInt(str1.substring(0,2));
            var mon1  = parseInt(str1.substring(3,5));
            var yr1   = parseInt(str1.substring(6,10));
            var date1 = new Date(yr1, mon1-1, dt1);
            return date1;
            }
        $scope.crTagItemClicked = function(item,_this,index) {
            var idButtonClicked = "#crbutton"+item.ID;
            var idButtonClicked2 = "#crbutton"+item.ID+"a";
            if($(idButtonClicked).css("background-color") !== 'rgb(66, 133, 244)'){
                $(idButtonClicked).css({
                    "background-color" : "#4285F4",
                    "color" : "white !important"
                });
                $(idButtonClicked).addClass("tag-blue-color");  
                $(idButtonClicked2).css({
                    "background-color" : "#4285F4",
                    "color" : "white !important"
                });
                $(idButtonClicked2).addClass("tag-blue-color");     
                vm.crtagSelectected.push(item);
               
            } else {
                $(idButtonClicked).css({
                    "color" : "#58666e !important",
                    "background-color":"white"      
                });
                $(idButtonClicked).removeClass("tag-blue-color");   
                $(idButtonClicked2).css({
                    "color" : "#58666e !important",
                    "background-color":"white"      
                });
                $(idButtonClicked2).removeClass("tag-blue-color"); 
                vm.crtagSelectected.splice(index,1);
            }
            console.log(vm.crtagSelectected);
        };
        $scope.crTagItemClickeda = function(item,_this,index) {
            var idButtonClicked = "#crbutton"+item.ID+"a";
            var idButtonClicked2 = "#crbutton"+item.ID;
            if($(idButtonClicked).css("background-color") !== 'rgb(66, 133, 244)'){
                $(idButtonClicked).css({
                    "background-color" : "#4285F4",
                    "color" : "white !important"
                });
                $(idButtonClicked2).addClass("tag-blue-color");  
                $(idButtonClicked2).css({
                    "background-color" : "#4285F4",
                    "color" : "white !important"
                });
                $(idButtonClicked2).addClass("tag-blue-color");     
                vm.crtagSelectected.push(item);
               
            } else {
                $(idButtonClicked).css({
                    "color" : "#58666e !important",
                    "background-color":"white"      
                });
                $(idButtonClicked).removeClass("tag-blue-color");   
                $(idButtonClicked2).css({
                    "color" : "#58666e !important",
                    "background-color":"white"      
                });
                $(idButtonClicked2).removeClass("tag-blue-color"); 
                vm.crtagSelectected.splice(index,1);
            }
            console.log(vm.crtagSelectected);
        };
        $scope.ReminderTagItemClicked = function(item,_this,index) {
            var idButtonClicked = "#rebutton"+item.ID;
            if($(idButtonClicked).css("background-color") !== 'rgb(66, 133, 244)'){
                $(idButtonClicked).css({
                    "background-color" : "#4285F4"
                });
                $(idButtonClicked).addClass("tag-blue-color");     
                vm.reminderTagSelected.push(item);
               
            } else {
                $(idButtonClicked).css({
                    "background-color":"white"      
                });
                $(idButtonClicked).removeClass("tag-blue-color");   
                vm.reminderTagSelected.splice(index,1);
            }
            console.log(vm.reminderTagSelected);
        };
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
            district.dataSource.transport.options.read.url = _districtURL+"?$filter=parent_code eq '" + filterDisVal + "'&$orderby=name&$top=100";
            district.dataSource.read().then(function() {
                $scope.districtDis = 0;
            });
        }
        function creUpdCusClicked() {
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
                            vm.systemCustomer.ID = response.data.ID;
                            toaster.pop('success', "Thành công", "Đã tạo thông tin khách hàng");
                            $scope.eventTypeDis = "false";
                        }
                    });
                } else {
                    if(vm.selectedDate !== undefined && vm.selectedDate !== ""){
                        if(moment(vm.selectedDate).format('YYYY-MM-DDTHH:mm:ss') !== "Invalid date" && vm.selectedDate !== "" && vm.selectedDate !== undefined) {
                            var time = moment(vm.selectedDate).format('YYYY-MM-DDTHH:mm:ss');
                            time+='Z';
                            vm.systemCustomer.Birthday = time;
                        }
                    }
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
                            toaster.pop('success', "Thành công", "Đã cập nhật thông tin khách hàng");
                        }
                        else if(response.status == 204) {
                            
                            toaster.pop('success', "Thành công", "Đã cập nhật thông tin khách hàng");
                        }
                    });
                }
            }
        }
        $scope.onCityChanged = function () {   
            $scope.districtDis = 1;   
            $scope.wardDis = 1;
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
            var time = moment(vm.selectedDate);
            vm.systemCustomer.Birthday = time.utc().format();
        }
        $scope.reminderOnSelectedDate = function() {
            var time = moment(vm.reminderSelectedDate);
        }
        $scope.onDateSoldChanged = function () {
            console.log(vm.eventCR.DateSold)
        }
        $scope.onDistrictChanged = function() {
            $scope.wardDis = 1;
            if(vm.selectedDistrict !== " Quận / Huyện... ") {
                vm.systemCustomer.District = vm.selectedDistrict.name_with_type;
                var filterWardVal = vm.selectedDistrict.code != undefined ? vm.selectedDistrict.code : "";
                var ward = $("#warddropdown").data("kendoDropDownList");
                ward.dataSource.transport.options.read.url = _wardURL+"?$filter=parent_code eq '" + filterWardVal + "'&$orderby=name&$top=100";
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
            if(vm.selectedDistrict !== " Phường / Xã... ") {
                vm.systemCustomer.Ward = vm.selectedWard.name_with_type;
            } else {
                vm.systemCustomer.Ward = undefined;
            }   
        }
        $scope.onEventSelChanged = function() {
            $scope.purDis = 1;
            console.log(vm.selectedEventData);
            if(vm.selectedEventData.Name !== " Nguồn sự kiện... ") {
                var tabStrip = $("#eventTabstrip").kendoTabStrip().data("kendoTabStrip");
                 $("#purposedropdown").data("kendoDropDownList").dataSource.read().then(function() {
                     $($("#purposedropdown").data("kendoDropDownList").dataItems()).each(function (item) {
                        if(this.parent_id !== vm.selectedEventData.id) {
                             $("#purposedropdown").data("kendoDropDownList").dataSource.remove(this);
                         }
                     });    
                 });
                vm.purposeData = vm.selectedEventData.EventPurposes;
                $scope.purDis = 0;
            } else {
                $scope.tab1Inisible = true;
                $scope.tab2Invisible = true;
                $scope.purDis = 1;
            }
            
        }
        $('#serialDropdown').click(function() {
            alert( "Handler for .click() called." );
        });
        $scope.onSerialSelChanged = function () {
            console.log(vm.serialSelectedData.device_serial);
            $http({
                url: _pitechDeviceDetailsURL,
                method: 'POST',
                data: JSON.stringify({
                    "sessionId":_pitechSessionId,
                    "phoneNumber": vm.searchingNumber,
                    "serial":vm.serialSelectedData.device_serial,
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
            }).error(function(response) {
                toaster.pop('error', "Thất bại", response.error);
            })
            .then(function(response){
               if(response.data.d.Success === true) {
                    console.log(response.data.d.Item);

                    vm.eventCRDetails.AgencySold = response.data.d.Item.agency_sold;
                    vm.eventCRDetails.DateSold = moment(compareDate(response.data.d.Item.date_sold)).format("DD/MM/YYYY");
                    vm.eventCRDetails.AssociateName = response.data.d.Item.associate_name;
               }
            });
        }
        $scope.onPurSelChanged = function() {
            console.log(vm.selectedPurposeData);
            // tabStrip.disable(tabStrip.tabGroup.children().eq(0));
            if(vm.selectedPurposeData.Name !== " Mục đích... ") {
                var tabStrip = $("#eventTabstrip").kendoTabStrip().data("kendoTabStrip");
                tabStrip.disable(tabStrip.tabGroup.children().eq(1));
                $scope.tab1Inisible = false;
            }  else {
                $scope.tab1Inisible = true;
                $scope.tab2Invisible = true;
            }
        }
        $scope.onReminderSerialSelChanged = function () {
            console.log(vm.reminderSerialSelectedData.device_serial);
            // $http({
            //     url: _pitechDeviceDetailsURL,
            //     method: 'POST',
            //     data: JSON.stringify({
            //         "sessionId":"501b30b8-bc46-b1b6-46ba-68c2eb5f688c",
            //         "phoneNumber": vm.searchingNumber,
            //         "serial":vm.reminderSerialSelectedData.device_serial,
            //     }),
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            // }).error(function(response) {
            //     toaster.pop('error', "Thất bại", response.error);
            // })
            // .then(function(response){
            //    if(response.data.d.Success === true) {
            //         console.log(response.data.d.Item);
            //    }
            // });
        }
        $scope.onEventProductTypeSelChanged = function() {
            if(vm.eventProductTypeSelectedData.Name == "FOX" && vm.serialData.length > 0) {
                $("#serialDropdown").data("kendoDropDownList").dataSource.read().then(function() {
                    $($("#serialDropdown").data("kendoDropDownList").dataItems()).each(function (item) {
                        var deviceSerial = this.device_serial.substring(0,2);
                        if(deviceSerial !== "AT") {
                            $("#serialDropdown").data("kendoDropDownList").dataSource.remove(this);
                        }
                    });    
                });
            } else if(vm.eventProductTypeSelectedData.Name == "RHINO" && vm.serialData.length > 0) {
                $("#serialDropdown").data("kendoDropDownList").dataSource.read().then(function() {
                    $($("#serialDropdown").data("kendoDropDownList").dataItems()).each(function (item) {
                        var deviceSerial = this.device_serial.substring(0,2);
                        if(deviceSerial !== "RD") {
                            $("#serialDropdown").data("kendoDropDownList").dataSource.remove(this);
                        }
                    });    
                });
            }
        }
        $scope.onReminderProductTypeSelChanged = function() {
            if(vm.reminderProductTypeSelectedData.Name == "FOX" && vm.serialData.length > 0) {
                $("#serialReminderDropdown").data("kendoDropDownList").dataSource.read().then(function() {
                    $($("#serialReminderDropdown").data("kendoDropDownList").dataItems()).each(function (item) {
                        var deviceSerial = this.device_serial.substring(0,2);
                        if(deviceSerial !== "AT") {
                            $("#serialReminderDropdown").data("kendoDropDownList").dataSource.remove(this);
                        }
                    });    
                });
            } else if(vm.reminderProductTypeSelectedData.Name == "RHINO" && vm.serialData.length > 0) {
                $("#serialReminderDropdown").data("kendoDropDownList").dataSource.read().then(function() {
                    $($("#serialReminderDropdown").data("kendoDropDownList").dataItems()).each(function (item) {
                        var deviceSerial = this.device_serial.substring(0,2);
                        if(deviceSerial !== "RD") {
                            $("#serialReminderDropdown").data("kendoDropDownList").dataSource.remove(this);
                        }
                    });    
                });
            }
        }
        function initialCtrl() {
            $("#districtdropdown").kendoDropDownList({
                autoBind: false
            });
            $("#warddropdown").kendoDropDownList({
                autoBind: false
            });
            $("#historyScheduler").kendoScheduler({
                autoBind:false
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
        kendo.init("#listOfCrTag");
        kendo.init("#listOfCrTaga");
        kendo.init("#listOfRemindTag");
        vm.departmentSelectOptions = {
            placeholder: "Bộ phận...",
            dataTextField: "Name",
            dataValueField: "ID",
            change: onCrDepartmentChanged,
            deselect: onCrDepartmentDeselect,
            select: onCrDepartmentSelect,
            valuePrimitive: true,
            autoBind: false,
            dataSource: {
                type: "odata-v4",
                serverFiltering: true,
                transport: {
                    read: {
                        url: _departmentURL,
                    }
                }
            }
        };
        vm.reminderDepartmentSelectOptions = {
            placeholder: "Bộ phận...",
            dataTextField: "Name",
            dataValueField: "ID",
            change: onReminderDepartmentChanged,
            deselect: onReminderDepartmentDeselect,
            select: onReminderDepartmentSelect,
            valuePrimitive: true,
            autoBind: false,
            dataSource: {
                type: "odata-v4",
                serverFiltering: true,
                transport: {
                    read: {
                        url: _departmentURL,
                    }
                }
            }
        };
        vm.departmentSelectedIds = [ ];
        vm.reminderDepartmentSelectedIds = [];

        function onCrDepartmentChanged() {
            var multiselect = $("#crDepartmentMulDrop").data("kendoMultiSelect");
            var multiselect2 = $("#crDepartmentMulDropa").data("kendoMultiSelect");
            
            console.log(multiselect.value());
            console.log(multiselect.value().length);
            console.log(multiselect.value()[multiselect.value().length - 1]);
            console.log(multiselect2.value());
            console.log(multiselect2.value().length);
            console.log(multiselect2.value()[multiselect2.value().length - 1]);
            console.log(vm.departmentSelectedIds);
        }
        function onReminderDepartmentChanged() {    
            console.log(vm.reminderDepartmentSelectedIds);
        }
        function onCrDepartmentSelect(e) {
            var dataItem = e.dataItem;
            console.log(dataItem);
            $http({
                method: 'GET',
                url: _tagURL+"?$filter=DepartmentID eq " + dataItem.ID ,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                },
              }).then(function successCallback(response) {
                  if(response.data.value.length > 0) { 
                    var listItem = response.data.value;
                    vm.crDepartmentListTag.push({
                        department: dataItem,
                        tagList: listItem
                    });
                    console.log("This is the department list");
                    console.log(vm.crDepartmentListTag);
                    console.log(response.data.value[0]);
                  } else {
                      toaster.pop('info', "Rỗng","Phòng ban chưa có tag");
                  }
                }, function errorCallback(response) {
                  console.log(response);
            });
        }
        function onReminderDepartmentSelect(e) {
            console.log("Selected");
            var dataItem = e.dataItem;
            console.log(dataItem);
            $http({
                method: 'GET',
                url: _tagURL+"?$filter=DepartmentID eq " + dataItem.ID ,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                },
              }).then(function successCallback(response) {
                  if(response.data.value.length > 0) { 
                    var listItem = response.data.value;
                    vm.reminderDepartmentListTag.push({
                        department: dataItem,
                        tagList: listItem
                    });
                    console.log("This is the department list");
                    console.log(vm.reminderDepartmentListTag);
                    console.log(response.data.value[0]);
                  } else {
                      toaster.pop('info', "Rỗng","Phòng ban chưa có tag");
                  }
                }, function errorCallback(response) {
                  console.log(response);
            });
            
        }
        function onCrDepartmentDeselect(e) {
            var data = e.dataItem;
            var isHaveInList = vm.crDepartmentListTag.find(element => function() {
                element.department === data;
            })
            if(isHaveInList !== undefined && isHaveInList.tagList.length >0) {
                isHaveInList.tagList.forEach(function(element, index, object) {              
                    vm.crtagSelectected.forEach(function(child, _index, _object) {
                        if (child === element) {
                            _object.splice(_index, 1);
                        }
                    });
                });
                vm.crDepartmentListTag.forEach(function(element,index,object) {
                    if(element.department === data) {
                        object.splice(index,1);
                    }
                });
                if(vm.crDepartmentListTag.length == 0) {
                    vm.crDepartmentListTag = [];
                }
            }
            console.log(vm.crtagSelectected);
            console.log(isHaveInList);
            console.log("Deselected");
            console.log(this.value());
            $('#listOfCrTag').load();
            $('#listOfCrTaga').load();
        }
        function onReminderDepartmentDeselect(e) {
            var data = e.dataItem;
            var isHaveInList = vm.reminderDepartmentListTag.find(element => function() {
                element.department === data;
            })
            if(isHaveInList !== undefined && isHaveInList.tagList.length >0) {
                isHaveInList.tagList.forEach(function(element, index, object) {              
                    vm.reminderTagSelected.forEach(function(child, _index, _object) {
                        if (child === element) {
                            _object.splice(_index, 1);
                        }
                    });
                });
                vm.reminderDepartmentListTag.forEach(function(element,index,object) {
                    if(element.department === data) {
                        object.splice(index,1);
                    }
                });
            }
            console.log(vm.reminderTagSelected);
            console.log(isHaveInList);
            console.log("Deselected");
            console.log(this.value());
        }
        vm.districtData = {
            type: "odata-v4",
            transport: {
                read: {
                    url: _districtURL,
                }
            }
        };
        vm.eventData = { 
            type: "odata-v4",
            serverFiltering: true,
            transport: {
                read: {
                    url: _eventTypeURL+"?$expand=EventPurposes",
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
                    $scope.eventTypeDis = 0;
                    var tabStrip = $("#eventTabstrip").kendoTabStrip().data("kendoTabStrip");
                    tabStrip.disable(tabStrip.tabGroup.children().eq(1));
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
                            //   var scheduler = $("#historyScheduler").data("kendoScheduler");
                            //   scheduler.dataSource.transport.options.read.url = _interactURL+"GetInteractionHistoryByCustomer?PhoneNumber="+vm.searchingNumber;
                            //   scheduler.dataSource.read();
                            //   scheduler.refresh();
                              var historyGrid = $("#historyGrid").data("kendoGrid");
                              historyGrid.dataSource.transport.options.read.url = _interactURL+"GetInteractionHistoryByCustomer?PhoneNumber="+vm.searchingNumber;
                              historyGrid.dataSource.read();
                              if(response.data.value.length > 0) {   
                                vm.cityCode = response.data.value[0].code;
                                district.dataSource.transport.options.read.url = _districtURL+"?$filter=parent_code eq '" + vm.cityCode + "'&$orderby=name&$top=100";
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
                                            ward.dataSource.transport.options.read.url = _wardURL+"?$filter=parent_code eq '" +  vm.districtCode + "'&$orderby=name&$top=100";
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
                                           
                                            console.log('no found');
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
                    toaster.pop('info', "Mới", "Thông tin khách hàng chưa có");
                    vm.secActived = true;
                    vm.tabDisable = false; 
                    vm.systemCustomer.PhoneNumber = vm.searchingNumber;
                  }
                
                }, function errorCallback(response) {
                  console.log(response);
            });
            $http({
                url: _pitechCusURL,
                method: 'POST',
                data: JSON.stringify({
                    "sessionId":_pitechSessionId,
                    "phoneNumber": vm.searchingNumber
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
            }).error(function(response) {
                toaster.pop('error', "Thất bại", response.error);
            })
            .then(function(response){
                // console.log("Success");
                // console.log(response.data.d);
                // console.log(response.data.d.Info);
                if(response.data.d.Success === true) {
                    vm.pitechCustomer = response.data.d.Item;
                    if(vm.pitechCustomer == null) {
                        $scope.serialVisible = true;
                    }
                    $http({
                        url: _pitechCusURL,
                        method: 'POST',
                        data: JSON.stringify({
                            "sessionId":_pitechSessionId,
                            "phoneNumber": vm.searchingNumber
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    }).error(function(response) {
                        toaster.pop('error', "Thất bại", response.error);
                    })
                    .then(function(response){
                        // console.log("Success");
                        // console.log(response.data.d);
                        // console.log(response.data.d.Info);
                        if(response.data.d.Success === true) {
                            vm.pitechCustomer = response.data.d.Item;
                            $http({
                                url: _pitechDevURL,
                                method: 'POST',
                                data: JSON.stringify({
                                    "sessionId":_pitechSessionId,
                                    "phoneNumber": vm.searchingNumber
                                }),
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                            }).error(function(response) {
                                toaster.pop('error', "Thất bại", response.error);
                            })
                            .then(function(response){
                                if(response.data.d.Success === true) {
                                    if(response.data.d.Item.length < 1) {
                                        $scope.serialVisible = true;
                                    }
                                    vm.serialData = {
                                        data: response.data.d.Item
                                    };
                                    vm.reminderSerialData = {
                                        data: response.data.d.Item
                                    };
                                    // $('body').kendoTooltip({
                                    //     filter: 'li.k-item',
                                    //     position: 'right',
                                    //     show: function(e){
                                    //         // console.log(this.content[0].childNodes[0].data);
                                    //         // console.log(this.content[0].childNodes[0].data);
                                    //         if(this.content[0].childNodes.length > 0 ) {
                                    //             if(this.content[0].childNodes[0].childNodes.length > 0) { 
                                    //                 this.content.parent().css("visibility", "visible");
                                    //             }    
                                    //         }  
                                    //     },
                                    //     hide:function(e){
                                    //         this.content.parent().css("visibility", "hidden");
                                    //     },
                                    //     content: function(e){
                                    //       var item = $('#serialDropdown').data("kendoDropDownList").dataItem($(e.target));
                                    //     //   var item2 = $('#serialReminderDropdown').data("kendoDropDownList").dataItem($(e.target));
                                    //       if(item.device_serial !== '') {
                                    //         console.log(item);
                                    //         //   console.log(item.device_serial);
                                    //           if(item.device_serial == '' || item.device_serial == undefined) {
                                    //               var result = "NO";
                                    //               return result;
                                    //           } else {
                                    //             var result = '<h4>Mã thiết bị: '+item.device_serial+'</h4>'+'<h5>Tên thiết bị: '+item.device_name+'</h5>';
                                    //             if(item.owner_yesno === true) {
                                    //                 result +='<h5>Là chủ sở hữu</h5>';
                                    //             } else {
                                    //                 result +='<h5>Không phải chủ sở hữu</h5>';
                                    //             }
                                    //             return result;
                                    //         }
                                    //       }
                                    //     //   if(item2.device_serial !== '') {
                                    //     //     console.log(item2);
                                    //     //     //   console.log(item.device_serial);
                                    //     //       if(item2.device_serial == '' || item2.device_serial == undefined) {
                                    //     //           var result = "NO";
                                    //     //           return result;
                                    //     //       } else {
                                    //     //         var result = '<h4>Mã thiết bị: '+item2.device_serial+'</h4>'+'<h5>Tên thiết bị: '+item2.device_name+'</h5>';
                                    //     //         if(item2.owner_yesno === true) {
                                    //     //             result +='<h5>Là chủ sở hữu</h5>';
                                    //     //         } else {
                                    //     //             result +='<h5>Không phải chủ sở hữu</h5>';
                                    //     //         }
                                    //     //         return result;
                                    //     //     }
                                    //     //   }
                                    //     },
                                    //     width: 150,
                                    //     height: 150
                                    //   });
                                    // console.log(vm.serialData);
                                } else {
                                    console.log("Không có thông tin")
                                }
                            });
                            $scope.pitechInfoInvi = false;
                        } else {
                            $scope.pitechInfoInvi = true;
                        }
                    });
                    $scope.pitechInfoInvi = false;
                } else {
                    $scope.pitechInfoInvi = true;
                    $scope.serialVisible = true;
                }
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
        vm.pitechCustomer = {};
        vm.purposeData = [];
        vm.reminderProductData = {
            type: "odata-v4",
            serverFiltering: true,
            transport: {
                read: {
                    url: _productTypeOdata,
                }
            }
        }
        vm.eventProductTypeData = {
            type: "odata-v4",
            serverFiltering: true,
            transport: {
                read: {
                    url: _productTypeOdata,
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
        $scope.crCusCreate = function() {
            swal({
                title: "Tạo phiếu hẹn",
                text: "Bạn có muốn tạo phiếu hẹn không?",
                icon: "info",
                buttons: {
                    cancel: "Không",
                    catch: {
                      text: "Có",
                      value: true,
                    }
                },
                dangerMode: false,
              })
              .then((willCreate) => {
                if (willCreate) { 
                   
                    if(vm.systemCustomer.ID === undefined || vm.systemCustomer.ID === "") {
                        toaster.pop('error', "Thiếu thông tin", "Thiếu thông tin khách hàng");
                    } else if(vm.selectedEventData.ID === undefined || vm.selectedPurposeData.ID === undefined) {
                        toaster.pop('error', "Thiếu thông tin", "Chọn đủ nguồn sự kiện và mục đích sự kiện");
                    } 
                    else {              
                        if(vm.crtagSelectected.length < 1) {
                            toaster.pop('error', "Thiếu thông tin", "Vui lòng chọn ít nhất 1 tag");
                        } 
                        else {
                            var json = JSON.stringify( vm.crtagSelectected, function( key, value ) {
                                if( key === "$$hashKey" ) {
                                    return undefined;
                                }   
                                return value;
                            });
                            vm.eventCR.CustomerID = vm.systemCustomer.ID;
                            if(vm.serialSelectedData.device_serial !== "" && vm.serialSelectedData.device_serial !== " Serial... " && vm.serialSelectedData.device_serial !== undefined) {
                                vm.eventCRDetails.Serial = vm.serialSelectedData.device_serial;
                            }
                            vm.eventCRDetails.ProductID = vm.eventProductTypeSelectedData.ID;
                            vm.eventCR.DetailEvents.push(vm.eventCRDetails);
                            vm.crtagSelectected = JSON.parse(json);                       
                            vm.eventCR.Tags = vm.crtagSelectected;
                            vm.eventCR.EventTypeID = vm.selectedEventData.ID;
                            vm.eventCR.EventPurposeID = vm.selectedPurposeData.ID;
                            if(moment(vm.eventCRDetails.DateSold).format('YYYY-MM-DDTHH:mm:ss') !== "Invalid date" && vm.eventCRDetails.DateSold !== "" && vm.eventCRDetails.DateSold !== undefined) {
                                var time = moment(vm.eventCRDetails.DateSold).format('YYYY-MM-DDTHH:mm:ss');
                                time+='Z';
                                vm.eventCRDetails.DateSold = time;
                            } else {
                                var time = moment().format('YYYY-MM-DDTHH:mm:ss');
                                time+='Z';
                                vm.eventCRDetails.DateSold = time;
                            }
                            $http({
                                url: _eventURL,
                                method: 'POST',
                                data: JSON.stringify(vm.eventCR),
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                                },
                            }).success(function(data, status, headers, config) {
                                debugger;
                                console.log(data);
                                console.log(status);
                                console.log(headers);
                                console.log(config);
                            }).
                            error(function(data, status, headers, config) {
                                debugger;
                                console.log(data);
                                console.log(status);
                                console.log(headers);
                                console.log(config);
                            })
                            .then(function(response){
                                console.log(response.data.ID);
                                vm.EventIDReturn = response.data.ID;
                                vm.eventCR = {
                                    DetailEvents: [],
                                    InteractionHistories: [],
                                    ReminderNotes: [],
                                    Tags: [],
                                    EStatusLogs: []
                                }
                                $scope.tab2Invisible = false;
                                $scope.tab1Inisible = true;
                                
                                var tabstrip = $("#eventTabstrip").data("kendoTabStrip");
                                tabstrip.disable(tabstrip.tabGroup.children().eq(0));
                                tabstrip.enable(tabstrip.tabGroup.children().eq(1));
                                var myTab = tabstrip.tabGroup.children("li").eq(1);
                                tabstrip.select(myTab);
                                if(response.status == 201) {
                                    toaster.pop('success', "Thành công", "Đã tạo sự kiện");        
                                    $('html, body').animate({
                                        scrollTop: $("#start-one").offset().top
                                    }, 2000);         
                                }
                            });
                        }  
                    } 
                    
                } else {
                    debugger;
                    if(vm.systemCustomer.ID === undefined || vm.systemCustomer.ID === "") {
                        toaster.pop({type: 'info', title: 'Thiếu thông tin', body: 'Thiếu thông tin khách hàng'})
                    }else if(vm.selectedEventData.ID === undefined || vm.selectedPurposeData.ID === undefined || vm.selectedEventData.ID === "" || vm.selectedPurposeData.ID === "") {
                        toaster.pop({type: 'info', title: 'Thiếu thông tin', body: 'Chọn đủ nguồn sự kiện và mục đích sự kiện'})
                    }  
                    else {              
                        if(vm.crtagSelectected.length < 1) {
                            toaster.pop('info', "Thiếu thông tin", "Vui lòng chọn ít nhất 1 tag");
                        } 
                        else {
                            var json = JSON.stringify( vm.crtagSelectected, function( key, value ) {
                                if( key === "$$hashKey" ) {
                                    return undefined;
                                }   
                                return value;
                            });
                            vm.eventCR.CustomerID = vm.systemCustomer.ID;
                            if(vm.serialSelectedData.device_serial !== "" && vm.serialSelectedData.device_serial !== " Serial... " && vm.serialSelectedData.device_serial !== undefined) {
                                vm.eventCRDetails.Serial = vm.serialSelectedData.device_serial;
                            }
                            vm.eventCRDetails.ProductID = vm.eventProductTypeSelectedData.ID;
                            vm.eventCR.DetailEvents.push(vm.eventCRDetails);
                            vm.crtagSelectected = JSON.parse(json);                       
                            vm.eventCR.Tags = vm.crtagSelectected;
                            vm.eventCR.EventTypeID = vm.selectedEventData.ID;
                            vm.eventCR.EventPurposeID = vm.selectedPurposeData.ID;
                            if(moment(vm.eventCRDetails.DateSold).format('YYYY-MM-DDTHH:mm:ss') !== "Invalid date" && vm.eventCRDetails.DateSold !== "" && vm.eventCRDetails.DateSold !== undefined) {
                                var time = moment(vm.eventCRDetails.DateSold).format('YYYY-MM-DDTHH:mm:ss');
                                time+='Z';
                                vm.eventCRDetails.DateSold = time;
                            } else {
                                var time = moment().format('YYYY-MM-DDTHH:mm:ss');
                                time+='Z';
                                vm.eventCRDetails.DateSold = time;
                            }
    
                            $http({
                                url: _eventURL,
                                method: 'POST',
                                data: JSON.stringify(vm.eventCR),
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                                },
                            }).error(function(response) {
                                toaster.pop('error', "Thất bại", response);
                            }).success(function(data, status, headers, config) {
                                debugger;
                                console.log(data);
                                console.log(status);
                                console.log(headers);
                                console.log(config);
                            }).
                            error(function(data, status, headers, config) {
                                debugger;
                                console.log(data);
                                console.log(status);
                                console.log(headers);
                                console.log(config);
                            })
                            .then(function(response){
                                if(response.status == 201) {
                                    toaster.pop('success', "Thành công", "Đã tạo phiếu thành công");                 
                                }
                                location.reload();
                            });
                        }  
                    }                               
                }
              });
           
        }
        $scope.reminderCreate = function () {
            vm.eventCR.CustomerID = vm.systemCustomer.ID;
        
            if(vm.eventCR.CustomerID == undefined || vm.eventCR.CustomerID === "") {
                toaster.pop('error', "Thiếu thông tin", "Thiếu thông tin khách hàng");
            } else 
            if(!vm.reminderCRDetails.ReminderDate){
                toaster.pop('error', "Ngày hẹn", "Vui lòng chọn ngày hẹn");
            }
            var time = moment(compareDate(vm.eventCRDetails.DateSold)).format('YYYY-MM-DDTHH:mm:ss');
            time+='Z';
            var json = JSON.stringify( vm.crtagSelectected, function( key, value ) {
                if( key === "$$hashKey" ) {
                    return undefined;
                }   
                return value;
            });
            vm.crtagSelectected = JSON.parse(json);
            vm.eventCRDetails.DateSold = time;
            vm.eventCR.DetailEvents.push(vm.eventCRDetails);
            vm.eventCR.Tags = vm.crtagSelectected;
            if(vm.serialSelectedData.device_serial !== "" && vm.serialSelectedData.device_serial !== " Serial... " && vm.serialSelectedData.device_serial !== undefined) {
                vm.eventCRDetails.Serial = vm.serialSelectedData.device_serial;
            }
            vm.eventCRDetails.ProductID = vm.eventProductTypeSelectedData.ID;
            vm.eventCR.EventTypeID = vm.selectedEventData.ID;
            vm.eventCR.EventPurposeID = vm.selectedPurposeData.ID;
            vm.interactionHistoryObj.Type ="Gọi điện";
            vm.interactionHistoryObj.Note = vm.eventCRDetails.Note;
            vm.eventCR.InteractionHistories.push(vm.interactionHistoryObj);
            vm.reminderCRDetails.Serial = vm.serialSelectedData.device_serial;
            vm.reminderCRDetails.EventID = vm.EventIDReturn;
            
            $http({
                url: _eventReminder,
                method: 'POST',
                data: JSON.stringify(vm.reminderCRDetails),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                },
            }).error(function(response) {
                toaster.pop('error', "Thất bại", response.error.innererror.message);
            })
            .then(function(response){
                if(response.status == 201) {
                    toaster.pop('success', "Thành công", "Đã tạo lịch hẹn thành công");
                    location.reload();    
                }
            });
        }
        $scope.transferInfo = function() {
            debugger;
            vm.systemCustomer.Name = vm.pitechCustomer.customer_fullname;
            vm.systemCustomer.Address = vm.pitechCustomer.customer_address;
            //Transfer the city from pitech information
            if(vm.pitechCustomer.customer_province !== undefined && vm.pitechCustomer.customer_province ) {
                var City = $('#citydropdown').data('kendoDropDownList');
                if(vm.pitechCustomer.customer_province.includes("Tp.")) {
                    var cityName = vm.pitechCustomer.customer_province.slice(4, vm.pitechCustomer.customer_province.length);
                    City.select(function (dataItem) {
                        return dataItem.name === cityName;
                    });
                } else {                
                    City.select(function (dataItem) {
                        return dataItem.name === vm.pitechCustomer.customer_province;
                    });
                }
                var itemSelected = City.dataItem();
                vm.systemCustomer.City = City.text();
                vm.cityCode = itemSelected.code;
                var district = $('#districtdropdown').data("kendoDropDownList");
                district.dataSource.transport.options.read.url = _districtURL+"?$filter=parent_code eq '" + vm.cityCode + "'&$orderby=name&$top=100";
    
                //Transfer the district from pitech information
                vm.systemCustomer.District = vm.pitechCustomer.customer_district;
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
                                var District = $('#districtdropdown').data("kendoDropDownList");
                                District.select(function(dataItem) {
                                    $scope.districtDis = 0;                 
                                    var iscorrect = dataItem.name_with_type.trim() === vm.systemCustomer.District.trim();
                                    return dataItem.name_with_type.trim() === vm.systemCustomer.District.trim();
                                });
                                var districtSelected = District.dataItem();
                                vm.systemCustomer.District = District.text();
                            });
                          
                           
                            
                            vm.systemCustomer.Ward = vm.pitechCustomer.customer_ward;
                            var ward = $('#warddropdown').data("kendoDropDownList");
                            //Check the code of district is loaded
                            //console.log('Districtcode: ' + vm.districtCode);
                            ward.dataSource.transport.options.read.url = _wardURL+"?$filter=parent_code eq '" +  vm.districtCode + "'&$orderby=name&$top=100";
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
                            if(vm.pitechCustomer.customer_birthday !== "" && vm.pitechCustomer !== undefined) {
                                var date = compareDate(vm.pitechCustomer.customer_birthday);
                                vm.selectedDate = date;

                                console.log(date);
                            }
                          } else 
                          {
                            //If no found, show here
                            //console.log('no found');
                          }
                        
                        }, function errorCallback(response) {
                          console.log(response);
                    });             
                }
            }
        }
        $scope.windowOptions = {
            title : 'Lịch sử tương tác',
            width : "70%",
            height : 600,
            visible : false,
            actions: [
                "Pin",
                "Minimize",
                "Maximize",
                "Close"
            ],
            position: { top: "40%" , left: "20%" },
            close: onHistoryClose,
            modal: false,
        }

        $scope.schedulerOptions = {
            date: new Date(),
            startTime: new Date("2019/01/01"),
            height: 600,
            views: [
                "agenda"
            ],
            timezone: "Etc/UTC",
            dataSource: {
                batch: false,
                transport: {
                    read: {
                        url: _interactURL+"GetInteractionHistoryByCustomer?PhoneNumber="+vm.searchingNumber,
                        dataType: "odata-v4"
                    }
                },
                schema: {
                    model: {
                        id: "ID",
                        fields: {
                            taskId: { from: "ID", type: "string" },
                            title: { from: "EventCode", defaultValue: "No title"},
                            start: { type: "date", from: "CreatDate" },
                            end: { type: "date", from: "CreatDate" }
                        }
                    }
                }
            }
        };
        $scope.historyGridOptions = {
            dataSource: {
                type: "odata-v4",
                transport: {
                    read: _interactURL+"GetInteractionHistoryByCustomer?PhoneNumber="+vm.searchingNumber
                },
                pageSize: 50,
                serverPaging: true,
                serverSorting: true,
                resizable: true,
                schema: {
                    parse: function(response) {
                        var histories = [];
                        for (var i = 0; i < response.value.length; i++) {
                            var dateNoTime = new Date(response.value[i].CreatDate);
                            var history = {
                                Type: response.value[i].Type,
                                EventCode: response.value[i].EventCode,
                                EventNote: response.value[i].EventNote,
                                EventPurpose: response.value[i].EventPurpose,
                                EventType: response.value[i].EventType,
                                DetailEventNote: response.value[i].DetailEventNote,   
                                Serial: response.value[i].Serial,
                                CreatDate: response.value[i].CreatDate,
                                CreatDateNoTime: new Date(
                                    dateNoTime.getFullYear(),
                                    dateNoTime.getMonth(),
                                    dateNoTime.getDate()
                                ),
                                Note: response.value[i].Note
                            };
                            histories.push(history);
                        }
                        return histories;
                    },
                    model: {
                        fields: {
                            Type: {type: "string"},
                            EventCode: {type: "string"},
                            EventNote: {type: "string"},
                            EventPurpose: {type: "string"},
                            EventType: {type: "string"},
                            DetailEventNote: {type: "string"},
                            Serial: {type: "string"},
                            CreatDate: { type: "date" },
                            CreatDateNoTime: { type: "date" },
                            Note: {type: "string"}
                        }
                    }
                }
            },
            sortable: true,
            pageable: true,
            groupable: true,
            columnMenu: true,
            height: 500,
           
            columns: [
                {
                    field: "Type",
                    title: "Hình thức tương tác",
                },
                {
                    field:"EventCode",
                    title:"Mã phiếu"
                },
                {
                    field: "EventNote",
                    title: "Ghi chú sự kiện"
                },
                {
                    field:"EventPurpose",
                    title:"Mục đích"
                },
                {
                    title:"Loại phiếu",
                    field:"EventType"
                }, 
                {
                    field: "DetailEventNote",
                    title: "Ghi chú chi tiết"
                },
                {
                    field: "Serial",
                    title: "Serial"
                },
                {
                    field:"CreatDateNoTime",
                    title:"Ngày tạo",
                    template: "#= kendo.toString(CreatDate, 'dd/MM/yyyy HH:mm:ss') #",
                    groupHeaderTemplate: "#= kendo.toString(value, 'dd/MM/yyyy') #"
                }, 
                {
                    field: "Note",
                    title: "Ghi chú"
                }
            ]
        };

        $scope.contentChanged = function (editor, html, text) {
            vm.eventCR.Note = text;
           console.log(vm.eventCR.Note);
        };
        $scope.CREventDetailscontentChanged = function(editor, html, text) {
            vm.eventCRDetails.Note = text;
        }
        $scope.reminderContentChanged = function(editor, html, text) {
            vm.reminderCR.Note = text;
        }
        $scope.reminderCRDetailContentChanged =  function(editor, html, text) {
            vm.reminderCRDetails.Note = text;
        }
        function onHistoryClose() {

        }
        $scope.initialEventCreationCtrl = function() {  
        }
        $scope.initialEventCreationCtrl();
    }
]);