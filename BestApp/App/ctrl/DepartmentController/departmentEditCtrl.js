'use strict';

angular.module('app')
    .controller('DepartmentEditCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', 'blockUI', function ($scope, $state, $stateParams, $http, toaster, blockUI){
        var _url = "/odata/Departments";
        var _tagUrl = "/odata/Tags";
        function CreateGuid() {  
            function _p8(s) {  
               var p = (Math.random().toString(16)+"000000000").substr(2,8);  
               return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;  
            }  
            return _p8() + _p8(true) + _p8(true) + _p8();  
         }  
        var vm = this;
        vm.departmentId = $stateParams.Id.replace(/['"]+/g, '');
        vm.access_token = localStorage.getItem('access_token');
        vm.model = {};
        var editBlock = blockUI.instances.get('EditBlockUI');
        function toolbarTemplate() {
            return kendo.template($("#toolbar").html());
        }
        $scope.initDepartmentEdit = function() {
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
                    toaster.pop('warning', "Rỗng", "Không tìm thấy thông tin phòng ban");
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
        $scope.tagGridOptions = {
            dataSource: {
                type:'odata-v4',
                transport: {
                    read: {
                        url: function () {
                            return _tagUrl+"?$filter=DepartmentID eq "+ vm.departmentId ;
                        }
                    },
                    update: {
                        url: function (dataItem) {
                            return _tagUrl+"(" + dataItem.ID + ")";
                        }
                    },
                    create: {
                        url: function (dataItem) {                   
                            // delete dataItem;
                            dataItem.ID = CreateGuid();
                            delete dataItem.ID;
                            dataItem.DepartmentID = vm.departmentId;
                            $http({
                                method: 'POST',
                                url: _tagUrl,
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                                },
                                data: JSON.stringify(dataItem)
                              }).then(function successCallback(response) {
                                    if(response.status == 201) {
                                        toaster.pop('success', "Thành công", "Đã tạo tag cho phòng ban");
                                        $('#departmentTagGrid').data('kendoGrid').dataSource.read();
                                        $('#departmentTagGrid').data('kendoGrid').refresh();
                                        return _tagUrl;
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
                                url: _tagUrl+"("+dataItem.ID+")",
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                                },
                                data: JSON.stringify(dataItem)
                              }).then(function successCallback(response) {
                                    if(response.status == 200) {
                                        toaster.pop('success', "Xóa", "Đã xóa thông tin tag");
                                        $('#departmentTagGrid').data('kendoGrid').dataSource.read();
                                        $('#departmentTagGrid').data('kendoGrid').refresh();
                                        return _tagUrl;
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
                            NameTag: { validation: { required: false } },
                            CodeTag: { type: "string" },
                            CreateDate: { type:"datetime" , editable: false },
                            DepartmentID: {type: "string"}
                        }
                    }
                }
            },
            sortable: true,
            pageable: true,
            height: 468,
            columns: [
                { field: "NameTag", title: "Tên tag" , width: "120px" },
                { field: "CodeTag", title: "Mã tag", width: "120px" },
                { field: "CreateDate", title: "Ngày tạo", width: "120px" },
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