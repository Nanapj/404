angular.module('app')
    .controller('CrEventSourceEditCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', 'blockUI', function ($scope, $state, $stateParams, $http, toaster, blockUI){
        var _url = "/odata/EventTypes";
        var _eventPurUrl = "/odata/EventPurposes";
        function CreateGuid() {  
            function _p8(s) {  
               var p = (Math.random().toString(16)+"000000000").substr(2,8);  
               return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;  
            }  
            return _p8() + _p8(true) + _p8(true) + _p8();  
         }  
        var vm = this;
        vm.eventTypeId = $stateParams.ID.replace(/['"]+/g, '');
        vm.access_token = localStorage.getItem('access_token');
        vm.model = {};
        vm.backToSourceClicked = backToSourceClicked;
        var editBlock = blockUI.instances.get('EditBlockUI');
        function toolbarTemplate() {
            return kendo.template($("#toolbar").html());
        }
        $scope.initDepartmentEdit = function() {
            $http({
                method: 'GET',
                url: _url+'?$filter=Id eq ' + $stateParams.ID.replace(/['"]+/g, ''),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                },
              }).then(function successCallback(response) {
                  if(response.data.value.length > 0) { 
                    var eventType = response.data.value[0];
                    vm.model = eventType;
                  } else 
                  {
                    toaster.pop('warning', "Rỗng", "Không tìm thấy thông tin nguồn sự kiện");
                  }
                
                }, function errorCallback(response) {
                  console.log(response);
            });
        }
        $scope.initDepartmentEdit();
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
        $scope.eventPurposeOptions = {
            dataSource: {
                type:'odata-v4',
                transport: {
                    read: {
                        url: function () {
                            return _eventPurUrl+"?$filter=EventTypeID eq "+ vm.eventTypeId ;
                        }
                    },
                    update: {
                        url: function (dataItem) {
                            return _eventPurUrl+"(" + dataItem.ID + ")";
                        }
                    },
                    create: {
                        url: function (dataItem) {                   
                            // delete dataItem;
                            dataItem.ID = CreateGuid();
                            delete dataItem.ID;
                            dataItem.EventTypeID = vm.eventTypeId;
                            $http({
                                method: 'POST',
                                url: _eventPurUrl,
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                                },
                                data: JSON.stringify(dataItem)
                              }).then(function successCallback(response) {
                                    if(response.status == 201) {
                                        toaster.pop('success', "Thành công", "Đã tạo mục đích cho nguồn sự kiện");
                                        $('#eventPurposeGrid').data('kendoGrid').dataSource.read();
                                        $('#eventPurposeGrid').data('kendoGrid').refresh();
                                        return _eventPurUrl;
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
                                url: _eventPurUrl+"("+dataItem.ID+")",
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                                },
                                data: JSON.stringify(dataItem)
                              }).then(function successCallback(response) {
                                    if(response.status == 200) {
                                        toaster.pop('success', "Xóa", "Đã xóa mục đích");
                                        $('#eventPurposeGrid').data('kendoGrid').dataSource.read();
                                        $('#eventPurposeGrid').data('kendoGrid').refresh();
                                        return _eventPurUrl;
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
                            EventTypeID: { type: "string" },
                            EventTypeName: {type: "string"}
                        }
                    }
                }
            },
            sortable: true,
            pageable: true,
            height: 468,
            columns: [
                { field: "Name", title: "Tên mục đích" , width: "120px" },
                { command: ["edit", "destroy"], title: "&nbsp;", width: "250px" }
            ],
            editable: "inline"
        };
        function customBoolEditor(container, options) {
            var guid = kendo.guid();
            $('<input class="k-checkbox" id="' + guid + '" type="checkbox" name="Discontinued" data-type="boolean" data-bind="checked:Discontinued">').appendTo(container);
            $('<label class="k-checkbox-label" for="' + guid + '">&#8203;</label>').appendTo(container);
        }
        function backToSourceClicked() {
            $state.go('app.creventsource.index');
          }
    
    }]
);