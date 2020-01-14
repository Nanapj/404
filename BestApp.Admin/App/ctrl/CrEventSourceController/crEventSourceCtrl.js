'use strict';

angular.module('app')
    .controller('CrEventSourceCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', 'blockUI', function ($scope, $state, $stateParams, $http, toaster, blockUI){
        var _url = "/odata/EventTypes";
        var vm = this;
        vm.model = {};
        vm.access_token = localStorage.getItem('access_token');
        vm.selectedEventType = {};
        vm.toolbarTemplate = toolbarTemplate;
        vm.create = create;
        vm.edit = edit;
        vm.destroy = destroy;
        vm.backToSourceClicked = backToSourceClicked;
        var blockui = blockUI.instances.get('BlockUI');
        
        function toolbarTemplate() {
            return kendo.template($("#toolbar").html());
        }
        function create(){
            $state.go('app.creventsource.create');
            vm.editMode = false;
        }
        function backToSourceClicked() {
            $state.go('app.creventsource.index');
        }
        function edit(){
            if(vm.selectedEventType.ID !== undefined && vm.selectedEventType.ID !== "") {
                $state.go('app.creventsource.edit', {
                    ID: vm.selectedEventType.ID
                });
            } else {
                toaster.pop('info', "Chưa chọn", "Vui lòng chọn nguồn sản phẩm");
            }
        }

        function destroy(){
           if(vm.selectedEventType.ID != undefined && vm.selectedEventType.ID != null) {
               swal({
                  title: "Xác nhận xóa?",
                  text: "Bạn có chắc xóa nguồn sự kiện",
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
               })
               .then((willDelete) => {
                  if (willDelete) {
                        //   swal("Poof! Your imaginary file has been deleted!", {
                        //     icon: "success",
                        //   });
                        $http({
                            method: 'DELETE',
                            url: _url+'(' + vm.selectedEventType.ID +')',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                            },
                        }).then(function successCallback(response) {
                            toaster.pop('success', "Thành công", "Đã xóa thông tin nguồn sự kiện");
                            $('#crEventSourceGrid').data('kendoGrid').dataSource.read();
                            $('#crEventSourceGrid').data('kendoGrid').refresh();
                        },function errorCallback(error) {
                            toaster.pop('error', "Thất bại", error.data.error.innererror.message);
                        });
                  
                  } else {
                    
                  }
               });
           } else {
            toaster.pop('warning', "Chưa chọn", "Không có thông tin nào được chọn");
           }
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
            height: 500,
            dataBound: onDataBound,
            change: onChange,
            columns: [
                {
                    field: "Name",
                    title: "Tên nguồn sự kiện",
                    width: "50px"
                }
            ]
        };
        function onDataBound(e) {
            this.expandRow(this.tbody.find("tr.k-master-row").first());
        }
        function onChange(e) {
            var grid = $('#crEventSourceGrid').data('kendoGrid');
            var selectedItem = grid.dataItem(grid.select());
            console.log(selectedItem);
            vm.selectedEventType = selectedItem;
        }
        function customBoolEditor(container, options) {
            var guid = kendo.guid();
            $('<input class="k-checkbox" id="' + guid + '" type="checkbox" name="Discontinued" data-type="boolean" data-bind="checked:Discontinued">').appendTo(container);
            $('<label class="k-checkbox-label" for="' + guid + '">&#8203;</label>').appendTo(container);
        }
        vm.createSubmit = function() {
            blockui.start();
            if((vm.model.Name != "" && vm.model.Name != null) 
            ){
               $http({
                  url: _url,
                  method: 'POST',
                  data: JSON.stringify(vm.model),
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                  },
              }).then(function(response){
                  if(response.status == 201) {
                      toaster.pop('success', "Thành công", "Đã tạo nguồn sự kiện");
                      $state.go('app.creventsource.edit', {
                        ID: response.data.ID
                      });
                      blockui.stop();
                  }
              });

            } else {
               toaster.pop('warning', "Rỗng tên", "Vui lòng điền tên nguồn sự kiện");
               blockui.stop();
            }
           
         }
    
    
    
    }]
);