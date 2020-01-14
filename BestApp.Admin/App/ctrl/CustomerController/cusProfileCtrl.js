'use strict';
angular.module('app')
    .controller('cusProfileCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', function ($scope, $state, $stateParams, $http, toaster){
    var vm = this;
    var _urlCus = "/odata/Customers";
    var _crEventURL = "/odata/Events/GetEventByCustomer";
    vm.access_token = localStorage.getItem('access_token');
    vm.model = {};
    vm.customer = {};
    vm.selectedEvent = {};
    vm.crDepartmentListTag = [];    
    vm.tagsList = [];
    vm.eventDetailList = [];
    vm.eventHistoryList= [];
    vm.eventTags = [];
    vm.eventReminders = [];
    $scope.showWindow = false;
    vm.backClicked = backClicked ;
    vm.cusId = $stateParams.ID.replace(/['"]+/g, '');
    $scope.initStaffEdit = function() {
        $http({
            method: 'GET',
            url: _urlCus+'?$filter=ID eq ' + vm.cusId,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
            },
          }).then(function successCallback(response) {
              if(response.data.value.length > 0) { 
                var customer = response.data.value[0];
                vm.customer = customer;
                vm.customer.Birthday = moment(vm.customer.Birthday).format("DD/MM/YYYY");
              } else 
              {
                toaster.pop('warning', "Rỗng", "Không tìm thấy thông tin khách hàng");
              }
            
            }, function errorCallback(response) {
              console.log(response);
        });
    }
    $scope.cusEventOptions = {
      toolbar: ["search"],
      dataSource: {
          type: "odata-v4",
          transport: {
              read: _crEventURL+"?$expand=DetailEvents,InteractionHistories,Tags,ReminderNotes,EStatusLogs&orderby CreatDate desc&CustomerID="+vm.cusId
          },         
          schema: {
              parse: function(response) {
                var events = [];
                for (var i = 0; i < response.value.length; i++) {
                  var dateNoTime = new Date(response.value[i].CreatDate);
                  var event = {
                      ID: response.value[i].ID,
                      Code: response.value[i].Code,
                      CustomerName: response.value[i].CustomerName,
                      PhoneNumber: response.value[i].PhoneNumber,
                      Address: response.value[i].Address,
                      Status: response.value[i].Status,
                      EventTypeName: response.value[i].EventTypeName,
                      EventPurposeName: response.value[i].EventPurposeName,
                      Status: response.value[i].Status,
                      CreatDate: new Date(
                          dateNoTime.getFullYear(),
                          dateNoTime.getMonth(),
                          dateNoTime.getDate(),
                          dateNoTime.getHours(),
                          dateNoTime.getMinutes(),
                          dateNoTime.getSeconds()
                      ),
                      Note: response.value[i].Note,
                      DetailEvents: response.value[i].DetailEvents,
                      InteractionHistories: response.value[i].InteractionHistories,
                      Tags:  response.value[i].Tags,
                      ReminderNotes: response.value[i].ReminderNotes
                  };
                  events.push(event);
                }
                return events;
              },
              total: function (response) {
                  return response.length;
              },
              model: {
                fields: {
                  Code: {type: "string"},
                  CustomerName: {type: "string"},
                  PhoneNumber: {type: "string"},
                  Address: {type: "string"},
                  Status: {type: "string"},
                  EventTypeName: {type: "string"},
                  EventPurposeName: {type: "string"},
                  Status: {type: "string"},
                  CreatDate: { type: "date" },
                  Note: { type: "string" }
                }
              },
              serverPaging: true,
              serverFiltering: true,
              serverSorting: true,
              pageable: {
                  pageSize: 10,
                  refresh: true
              },
              groupable: true,
              reorderable: true,
          }      
      },
      sortable: true,
      pageable: {
          pageSize: 10,
          refresh: true
      },
      groupable: true,
      reorderable: true,
      columnMenu: true,
      serverPaging: true,
      serverSorting: true,
      resizable: true,     
      height: 500,
      dataBound: onDataBound,
      change: onChange,
      columns: [
          {
              field: "ID",
              title: "ID",
              hidden: true
          },
          {
              field: "Code",
              title: "Mã Phiếu"
          },
          {
              field:"CreatDate",
              title:"Ngày tạo",
              template: "#= kendo.toString(CreatDate, 'dd/MM/yyyy HH:mm:ss') #",
              groupHeaderTemplate: "#= kendo.toString(value, 'dd/MM/yyyy') #",
              filterable: {
                  ui: function (element) {
                      element.kendoDatePicker({
                        format: "dd/MM/yyyy"
                      });
                  },
                  extra: true,
                  operators: {
                  //specify filters according to the field type - string, date, number
                      date: {
                          eq: "Equal to",
                          neq: "Not equal to",
                          gte: "Is after or equal to",
                          gt: "Is after",
                          lte: "Is before or equal to",
                          lt: "Is before"
                      }
                  }                   
              }
          },
          {
              field: "CustomerName",
              title: "Tên khách hàng"
          },
          {
              field: "PhoneNumber",
              title: "Số điện thoại"
          },
          {
              field: "Address",
              title: "Địa chỉ"
          },
          {
              field: "Status",
              title: "Trạng thái phiếu"
          },
          {
              field: "EventTypeName",
              title: "Loại sự kiện"
          },
          {
              field: "EventPurposeName",
              title: "Mục đích"
          },
          {
              field: "Note",
              title: "Ghi chú sự kiện"
          },
          { command: [{ text: "Chi tiết", click: showDetails }], title: " Tùy chỉnh ", width: "300px" }
      ]
    };
    $scope.detailsGridOption =  {
      dataSource:{
          data: vm.eventDetailList,
          schema: {
              parse: function(response){
                  var details =[];
                  for (var i = 0; i < response.length; i++) {
                      var dateNoTime = new Date(response[i].CreatDate);
                      var detail = {
                          ID: response[i].ID,
                          Serial: response[i].Serial,
                          EventCode: response[i].EventCode,
                          ProductCode: response[i].ProductCode,
                          ProductName: response[i].ProductName,
                          AgencySold: response[i].AgencySold,
                          AssociateName: response[i].AssociateName,
                          CreatDate: new Date(
                              dateNoTime.getFullYear(),
                              dateNoTime.getMonth(),
                              dateNoTime.getDate()
                          ),
                          Note: response[i].Note
                      };
                      details.push(detail);
                    }
                    return details;
              },
              model: {
                  fields: {
                      ID: { type: "string" },
                      Serial: { type: "string" },
                      EventCode: { type: "string" },
                      ProductCode: { type: "string" },
                      ProductName: { type: "string" },
                      AgencySold: { type: "string" },
                      AssociateName: { type: "string" },
                      CreatDate: { type: "date" },
                      Note: { type: "string" }
                  }
              }
          },    
      } ,
      sortable: true,
      pageable: {
          pageSize: 5,
          refresh: true
      },
      groupable: true,
      reorderable: true,
      columnMenu: true,
      height: 500,
      cache: false,
      columns: [
          { field: "Serial", title: "Serial" },
          { field: "EventCode", title: "Mã sự kiện" },
          { field: "ProductCode", title: "Mã sản phẩm"},
          { field: "ProductName",  title: "Tên sản phẩm"},
          { field: "AgencySold", title: "Đại lí bán"},
          { field: "AssociateName", title: "Tên nhân viên"},
          {  
              field:"CreatDate",
              title:"Ngày tạo",
              template: "#= kendo.toString(CreatDate, 'dd/MM/yyyy HH:mm:ss') #",
              groupHeaderTemplate: "#= kendo.toString(value, 'dd/MM/yyyy') #"
          },
          { field: "Note", title: "Ghi chú" }
      ]
    };
    $scope.historyGridOption = {
      dataSource: {
          data: vm.eventHistoryList,
          schema: {
              parse: function(response){
              var histories =[];
              for (var i = 0; i < response.length; i++) {
                  var dateNoTime = new Date(response[i].CreatDate);
                  var history = {
                      ID: response[i].ID,
                      EventCode: response[i].EventCode,
                      Note: response[i].Note,
                      Status: response[i].Status,
                      CreatDate:new Date(
                          dateNoTime.getFullYear(),
                          dateNoTime.getMonth(),
                          dateNoTime.getDate()
                      )
              };
              histories.push(history);
              }
              return histories;
          },
          model: {
              fields: {
                  ID: { type: "string" },
                  EventCode: {type: "string"},
                  Note: { type: "string" },
                  Status: { type: "string" },
                  CreatDate: { type: "date" }
              }
          }
          }
      },
      sortable: true,
      pageable: {
          refresh: true,
          pageSize:10,
      },
      groupable: true,
      reorderable: true,
      columnMenu: true,
      height: 468,
      columns: [
          { field: "EventCode", title: "Mã sự kiện" },
          { field: "Note", title: "Nội dung phiếu"},
          { field: "Status",  title: "Trạng thái phiếu"},
          {  
              field:"CreatDate",
              title:"Ngày tạo",
              template: "#= kendo.toString(CreatDate, 'dd/MM/yyyy HH:mm:ss') #",
              groupHeaderTemplate: "#= kendo.toString(value, 'dd/MM/yyyy') #"
          },
          {
              field: "Note", title: " Ghi chú"
          }
      ]
    }
    $scope.tagDetailsOption ={
      data: vm.eventTags,
      sortable: true,
      pageable: {
          refresh: true,
          pageSize:10,
      },
      groupable: true,
      reorderable: true,
      columnMenu: true,
      height: 468,
      columns: [
          {
              field: "ID",
              hidden: true,
          },
          {
              field: "NameTag",
              title: "Tên tag"
          },
          {
              field: "CodeTag",
              title: "Mã tag"
          },
          {
              field: "DepartmentName",
              title: "Phòng ban được tag"
          }
      ]
    }
    $scope.reminderDetailsOption = {
      dataSource: {
          data: vm.eventReminders,
          schema: {
              parse: function(response) {
                  var reminders =[];
                  for (var i = 0; i < response.length; i++) {
                      var createDateNotTime = new Date(response[i].CreatDate);
                      var reminderDateNoTime = new Date(response[i].ReminderDate);
                      var reminder = {
                          ID: response[i].ID,
                          Note: response[i].Note,
                          CreatDate:  new Date(
                              createDateNotTime.getFullYear(),
                              createDateNotTime.getMonth(),
                              createDateNotTime.getDate(),
                              createDateNotTime.getHours(),
                              createDateNotTime.getMinutes(),
                              createDateNotTime.getSeconds(),
                          ),
                          ReminderDate: new Date(
                              reminderDateNoTime.getFullYear(),
                              reminderDateNoTime.getMonth(),
                              reminderDateNoTime.getDate(),
                              reminderDateNoTime.getMinutes(),
                              reminderDateNoTime.getSeconds(),
                          )
                  };
                  reminders.push(reminder);
                  }
                  return reminders;
              },
              model: {
                  fields: {
                      ID: { type: "string" },
                      Note: { type: "string" },
                      CreatDate: { type: "date" },
                      ReminderDate: { type: "date" },
                  }
              }
          }
      },
      sortable: true,
      pageable: {
          refresh: true,
          pageSize:10,
      },
      groupable: true,
      reorderable: true,
      columnMenu: true,
      height: 468,
      columns: [
          {
              field: "ID",
              hidden: true,
          },
          {
              field: "Note",
              title: "Ghi chú lịch hẹn",
              attributes: {
                  "class": "breakWord120"

              }
          },
          {
              field:"CreatDate",
              title:"Ngày tạo",
              template: "#= kendo.toString(CreatDate, 'dd/MM/yyyy HH:mm:ss') #",
              groupHeaderTemplate: "#= kendo.toString(value, 'dd/MM/yyyy') #"
          },
          {
              field:"ReminderDate",
              title:"Ngày hẹn",
              template: "#= kendo.toString(ReminderDate, 'dd/MM/yyyy HH:mm:ss') #",
              groupHeaderTemplate: "#= kendo.toString(value, 'dd/MM/yyyy') #"
          }
      ]
    }
    function showDetails(e) {
      e.preventDefault();
      var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
      vm.selectedEvent = dataItem;  
      updateGrid();     
      if(vm.eventDetailList.length > 0) {
          vm.eventDetailList = [];
      }
      if(vm.eventHistoryList.length > 0) {
          vm.eventHistoryList = [];
      }
      if(vm.eventTags.length > 0) {
          vm.eventTags = [];
      }
      if(vm.eventReminders.length > 0) {
          vm.eventReminders = [];
      }
      for(var i = 0 ; i < vm.selectedEvent.DetailEvents.length ; i++) {
          vm.eventDetailList.push(vm.selectedEvent.DetailEvents[i]);
      }
      for(var i = 0 ; i < vm.selectedEvent.InteractionHistories.length ; i++) {
          vm.eventHistoryList.push(vm.selectedEvent.InteractionHistories[i]);
      }
      for(var i = 0 ; i < vm.selectedEvent.Tags.length ; i++) {
          vm.eventTags.push(vm.selectedEvent.Tags[i]);
      }  
      for(var i = 0 ; i < vm.selectedEvent.ReminderNotes.length ; i++) {
          vm.eventReminders.push(vm.selectedEvent.ReminderNotes[i]);
      }
      var detailsDatasource = new kendo.data.DataSource({
          data: vm.eventDetailList,
          schema: {
              parse: function(response){
                  var details =[];
                  for (var i = 0; i < response.length; i++) {
                      var dateNoTime = new Date(response[i].CreatDate);
                      var detail = {
                          ID: response[i].ID,
                          Serial: response[i].Serial,
                          EventCode: response[i].EventCode,
                          ProductCode: response[i].ProductCode,
                          ProductName: response[i].ProductName,
                          AgencySold: response[i].AgencySold,
                          AssociateName: response[i].AssociateName,
                          CreatDate: response[i].CreatDate,
                          CreatDateNoTime: new Date(
                              dateNoTime.getFullYear(),
                              dateNoTime.getMonth(),
                              dateNoTime.getDate()
                          )
                      };
                      details.push(detail);
                    }
                    return details;
              },
              model: {
                  fields: {
                      ID: { type: "string" },
                      Serial: { type: "string" },
                      EventCode: { type: "string" },
                      ProductCode: { type: "string" },
                      ProductName: { type: "string" },
                      AgencySold: { type: "string" },
                      AssociateName: { type: "string" },
                      CreatDate: { type: "date" },
                      CreatDateNoTime: { type: "date" },
                  }
              }
          },    
          
        });
      var historyDatasource = new kendo.data.DataSource({ 
          data: vm.selectedEvent.InteractionHistories,
          schema: {
              parse: function(response){
              var histories =[];
              for (var i = 0; i < response.length; i++) {
                  var dateNoTime = new Date(response[i].CreatDate);
                  var history = {
                      ID: response[i].ID,
                      EventCode: response[i].EventCode,
                      Note: response[i].Note,
                      Status: response[i].Status,
                      CreatDate: response[i].CreatDate,
                      CreatDateNoTime: new Date(
                          dateNoTime.getFullYear(),
                          dateNoTime.getMonth(),
                          dateNoTime.getDate(),
                          dateNoTime.getHours(),
                          dateNoTime.getMinutes(),
                          dateNoTime.getSeconds()
                      )
              };
              histories.push(history);
              }
              return histories;
          },
          model: {
              fields: {
                  ID: { type: "string" },
                  EventCode: {type: "string"},
                  Note: { type: "string" },
                  Status: { type: "string" },
                  CreatDate: { type: "date" },
                  CreatDateNoTime: { type: "date" },
              }
          }
          }
      });
      var tagDatasource = new kendo.data.DataSource({
          data: vm.eventTags
      });
      var reminderDatasource = new kendo.data.DataSource({
          data: vm.eventReminders,
          schema: {
              parse: function(response) {
                  var reminders =[];
                  for (var i = 0; i < response.length; i++) {
                      var createDateNotTime = new Date(response[i].CreatDate);
                      var reminderDateNoTime = new Date(response[i].ReminderDate);
                      var reminder = {
                          ID: response[i].ID,
                          Note: response[i].Note,
                          CreatDate:  new Date(
                              createDateNotTime.getFullYear(),
                              createDateNotTime.getMonth(),
                              createDateNotTime.getDate(),
                              createDateNotTime.getHours(),
                              createDateNotTime.getMinutes(),
                              createDateNotTime.getSeconds(),
                          ),
                          ReminderDate: new Date(
                              reminderDateNoTime.getFullYear(),
                              reminderDateNoTime.getMonth(),
                              reminderDateNoTime.getDate(),
                              reminderDateNoTime.getHours(),
                              reminderDateNoTime.getMinutes(),
                              reminderDateNoTime.getSeconds(),
                          )
                  };
                  reminders.push(reminder);
                  }
                  return reminders;
              },
              model: {
                  fields: {
                      ID: { type: "string" },
                      Note: { type: "string" },
                      CreatDate: { type: "date" },
                      ReminderDate: { type: "date" },
                  }
              }
          }
      });
      $scope.showWindow = true;
      $("#detailWindow").kendoWindow({
          position: {
            top: "20%", 
            left: "5%"
          },
          width: 600,
          height: 458,
          maxWidth: 600
        });
      $("#detailWindow").data("kendoWindow").open();
      $('a.k-pager-refresh.k-link').click();
      $('#eventDetailsGrid').data('kendoGrid').setDataSource(detailsDatasource);
      $("#eventDetailsGrid").data("kendoGrid").dataSource.read();
      $("#eventDetailsGrid").data("kendoGrid").refresh();
      $('#historyDetailsGrid').data('kendoGrid').setDataSource(historyDatasource);
      $("#historyDetailsGrid").data("kendoGrid").dataSource.read();
      $("#historyDetailsGrid").data("kendoGrid").refresh();
      $('#tagDetailsGrid').data('kendoGrid').setDataSource(tagDatasource);
      $("#tagDetailsGrid").data("kendoGrid").dataSource.read();
      $("#tagDetailsGrid").data("kendoGrid").refresh();
      $('#reminderDetailsGrid').data('kendoGrid').setDataSource(reminderDatasource);
      $("#reminderDetailsGrid").data("kendoGrid").dataSource.read();
      $("#reminderDetailsGrid").data("kendoGrid").refresh();
    };
    function onChange(e) {
    var grid = $('#eventGrid').data('kendoGrid');
    var selectedItem = grid.dataItem(grid.select());
    vm.selectedEvent = selectedItem;
    updateGrid();
    }
    function updateGrid() {
      if(vm.eventDetailList.length > 0) {
          vm.eventDetailList = [];
      }
      if(vm.eventHistoryList.length > 0) {
          vm.eventHistoryList = [];
      }
      if(vm.eventTags.length > 0) {
          vm.eventTags = [];
      }
      if(vm.eventReminders.length > 0) {
          vm.eventReminders = [];
      }
      for(var i = 0 ; i < vm.selectedEvent.DetailEvents.length ; i++) {
          vm.eventDetailList.push(vm.selectedEvent.DetailEvents[i]);
      }
      for(var i = 0 ; i < vm.selectedEvent.InteractionHistories.length ; i++) {
          vm.eventHistoryList.push(vm.selectedEvent.InteractionHistories[i]);
      }
      for(var i = 0 ; i < vm.selectedEvent.Tags.length ; i++) {
          vm.eventTags.push(vm.selectedEvent.Tags[i]);
      }  
      for(var i = 0 ; i < vm.selectedEvent.ReminderNotes.length ; i++) {
          vm.eventReminders.push(vm.selectedEvent.ReminderNotes[i]);
      }
      var detailsDatasource = new kendo.data.DataSource({
          data: vm.eventDetailList,
          schema: {
              parse: function(response){
                  var details =[];
                  for (var i = 0; i < response.length; i++) {
                      var dateNoTime = new Date(response[i].CreatDate);
                      var detail = {
                          ID: response[i].ID,
                          Serial: response[i].Serial,
                          EventCode: response[i].EventCode,
                          ProductCode: response[i].ProductCode,
                          ProductName: response[i].ProductName,
                          AgencySold: response[i].AgencySold,
                          AssociateName: response[i].AssociateName,
                          CreatDate: response[i].CreatDate,
                          CreatDateNoTime: new Date(
                              dateNoTime.getFullYear(),
                              dateNoTime.getMonth(),
                              dateNoTime.getDate()
                          )
                      };
                      details.push(detail);
                    }
                    return details;
              },
              model: {
                  fields: {
                      ID: { type: "string" },
                      Serial: { type: "string" },
                      EventCode: { type: "string" },
                      ProductCode: { type: "string" },
                      ProductName: { type: "string" },
                      AgencySold: { type: "string" },
                      AssociateName: { type: "string" },
                      CreatDate: { type: "date" },
                      CreatDateNoTime: { type: "date" },
                  }
              }
          },    
          
        });
      var historyDatasource = new kendo.data.DataSource({ 
          data: vm.eventHistoryList,
          schema: {
              parse: function(response){
              var histories =[];
              for (var i = 0; i < response.length; i++) {
                  var dateNoTime = new Date(response[i].CreatDate);
                  var history = {
                      ID: response[i].ID,
                      EventCode: response[i].EventCode,
                      Note: response[i].Note,
                      Status: response[i].Status,
                      CreatDate: response[i].CreatDate,
                      CreatDateNoTime: new Date(
                          dateNoTime.getFullYear(),
                          dateNoTime.getMonth(),
                          dateNoTime.getDate(),
                          dateNoTime.getHours(),
                          dateNoTime.getMinutes(),
                          dateNoTime.getSeconds()
                      )
              };
              histories.push(history);
              }
              return histories;
          },
          model: {
              fields: {
                  ID: { type: "string" },
                  EventCode: {type: "string"},
                  Note: { type: "string" },
                  Status: { type: "string" },
                  CreatDate: { type: "date" },
                  CreatDateNoTime: { type: "date" },
              }
          }
          }
      });
      var tagDatasource = new kendo.data.DataSource({
          data: vm.eventTags
      });
      var reminderDatasource = new kendo.data.DataSource({
          data: vm.eventReminders,
          schema: {
              parse: function(response) {
                  var reminders =[];
                  for (var i = 0; i < response.length; i++) {
                      var createDateNotTime = new Date(response[i].CreatDate);
                      var reminderDateNoTime = new Date(response[i].ReminderDate);
                      var reminder = {
                          ID: response[i].ID,
                          Note: response[i].Note,
                          CreatDate:  new Date(
                              createDateNotTime.getFullYear(),
                              createDateNotTime.getMonth(),
                              createDateNotTime.getDate(),
                              createDateNotTime.getHours(),
                              createDateNotTime.getMinutes(),
                              createDateNotTime.getSeconds(),
                          ),
                          ReminderDate: new Date(
                              reminderDateNoTime.getFullYear(),
                              reminderDateNoTime.getMonth(),
                              reminderDateNoTime.getDate(),
                              reminderDateNoTime.getHours(),
                              reminderDateNoTime.getMinutes(),
                              reminderDateNoTime.getSeconds(),
                          )
                  };
                  reminders.push(reminder);
                  }
                  return reminders;
              },
              model: {
                  fields: {
                      ID: { type: "string" },
                      Note: { type: "string" },
                      CreatDate: { type: "date" },
                      ReminderDate: { type: "date" },
                  }
              }
          }
      });
    }
      function onDataBound(e) {
        this.expandRow(this.tbody.find("tr.k-master-row").first());
      }
      $scope.initStaffEdit();
      function backClicked() {
        $state.go('app.customer.index');
      }
    }
]);