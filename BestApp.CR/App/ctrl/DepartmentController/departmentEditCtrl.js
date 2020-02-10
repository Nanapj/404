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
        vm.departmentId = $stateParams.ID.replace(/['"]+/g, '');
        vm.access_token = localStorage.getItem('access_token');
        vm.model = {};
        vm.editDepartmentBack = editDepartmentBack ;
        var editBlock = blockUI.instances.get('EditBlockUI');
        function toolbarTemplate() {
            return kendo.template($("#toolbar").html());
        }
        function ChangeToSlug(title)
        {
            var slug;

            //Lấy text từ thẻ input title 

            //Đổi chữ hoa thành chữ thường
            slug = title.toLowerCase();

            //Đổi ký tự có dấu thành không dấu
            slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
            slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
            slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
            slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
            slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
            slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
            slug = slug.replace(/đ/gi, 'd');
            //Xóa các ký tự đặt biệt
            slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
            //Đổi khoảng trắng thành ký tự gạch ngang
            slug = slug.replace(/ /gi, "-");
            //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
            //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
            slug = slug.replace(/\-\-\-\-\-/gi, '-');
            slug = slug.replace(/\-\-\-\-/gi, '-');
            slug = slug.replace(/\-\-\-/gi, '-');
            slug = slug.replace(/\-\-/gi, '-');
            //Xóa các ký tự gạch ngang ở đầu và cuối
            slug = '@' + slug + '@';
            slug = slug.replace(/\@\-|\-\@|\@/gi, '');
            //In slug ra textbox có id “slug”
            slug = "#" + slug;
            return slug;
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
                    var staff = response.data.value[0];
                    vm.model = staff;
                  } 
                  else 
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
                url: _url+'('+ $stateParams.ID.replace(/['"]+/g, '') +')',
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
                            var code = dataItem.CodeTag;
                            if(code !== undefined && code.replace(/\s/g, '') !== "") {
                                dataItem.CodeTag = ChangeToSlug(code);
                            } else {
                                dataItem.CodeTag = ChangeToSlug(dataItem.NameTag);
                            }
                            return _tagUrl+"(" + dataItem.ID + ")";
                        }
                    },
                    create: {
                        url: function (dataItem) {                   
                            // delete dataItem;
                            dataItem.ID = CreateGuid();
                            delete dataItem.ID;
                            var code = dataItem.CodeTag;
                            if(code !== undefined && code !== "") {
                                dataItem.CodeTag = ChangeToSlug(code);
                            } else {
                                dataItem.CodeTag = ChangeToSlug(dataItem.NameTag);
                            }
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
                { command: ["edit", "destroy"], title: "&nbsp;", width: "250px" }
            ],
            editable: "inline"
        };
        function editDepartmentBack() {
            $state.go('app.department.index');
        }
        function customBoolEditor(container, options) {
            var guid = kendo.guid();
            $('<input class="k-checkbox" id="' + guid + '" type="checkbox" name="Discontinued" data-type="boolean" data-bind="checked:Discontinued">').appendTo(container);
            $('<label class="k-checkbox-label" for="' + guid + '">&#8203;</label>').appendTo(container);
        }
    }
]);