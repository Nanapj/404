'use strict';

angular.module('app')
    .controller('DashboardCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', function ($scope, $state, $stateParams, $http, toaster){
        var canvasctx = document.getElementById('canvasChart').getContext('2d');
        var piectx = document.getElementById('pieChart').getContext('2d');
        var colandlinectx = document.getElementById('columnAndLineChart').getContext('2d');
        var barctx = document.getElementById('barChart').getContext('2d');
        $scope.initialDashboard = function() {
        }
        $scope.initialDashboard();
        var pieData = {
              datasets: [{
                  data: [10, 20, 30],
                  backgroundColor: ['#878BB6','#4ACAB4','#FF8153']
              }],
              // These labels appear in the legend and in the tooltips when hovering different arcs
              labels: [
                  'Red',
                  'Yellow',
                  'Blue'
              ]
          };
        var canvasData = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [{
              label: 'Thống kê cuộc gọi hàng tháng',
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              data: [2000, 3500, 3005, 2498, 1220, 2230, 2045]
          }]
        };
        var colandlineData = {
            datasets: [{
              label: 'Bar Dataset',
              data: [10, 20, 30, 40],
              backgroundColor: 'rgba(255,0,0,0.2)'
            }, {
                label: 'Line Dataset',
                data: [50, 50, 50, 50],
                // Changes this dataset to become a line
                type: 'line',
                backgroundColor: 'rgba(135,206,250,0.2)'
            }],
            labels: ['January', 'February', 'March', 'April']
        };
        var barData = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [{
              label: 'Thống kê cuộc gọi hàng tháng',
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              data: [2000, 3500, 3005, 2498, 1220, 2230, 2045]
          }]
        }
        var barDataOptions = {
          scales: {
              xAxes: [{
                  barPercentage: 0.5,
                  barThickness: 20,
                  maxBarThickness: 8,
                  minBarLength: 2,
                  gridLines: {
                      offsetGridLines: true
                  }
              }]
          }
      };
        var canvasChart = new Chart(canvasctx, {
            // The type of chart we want to create
            type: 'line',
            // The data for our dataset
            data: canvasData,
            // Configuration options go here
            options: {}
        });
        var pieChart = new Chart(piectx, {
          type: 'pie',
          data: pieData
        });
        var colandlineChart = new Chart(colandlinectx, {
          type:'bar',
          data: colandlineData
        });
        var barChart = new Chart(barctx, {
          type:'bar',
          data: barData,
          options: barDataOptions
        });
        $scope.schedulerOptions = {
          date: new Date("2013/6/13"),
          startTime: new Date("2013/6/13 07:00 AM"),
          height: 600,
          views: [
              "day",
              { type: "workWeek", selected: true },
              "week",
              "month",
          ],
          timezone: "Etc/UTC",
          dataSource: {
              batch: true,
              transport: {
                  read: {
                      url: "https://demos.telerik.com/kendo-ui/service/tasks",
                      dataType: "jsonp"
                  },
                  update: {
                      url: "https://demos.telerik.com/kendo-ui/service/tasks/update",
                      dataType: "jsonp"
                  },
                  create: {
                      url: "https://demos.telerik.com/kendo-ui/service/tasks/create",
                      dataType: "jsonp"
                  },
                  destroy: {
                      url: "https://demos.telerik.com/kendo-ui/service/tasks/destroy",
                      dataType: "jsonp"
                  },
                  parameterMap: function(options, operation) {
                      if (operation !== "read" && options.models) {
                          return {models: kendo.stringify(options.models)};
                      }
                  }
              },
              schema: {
                  model: {
                      id: "taskId",
                      fields: {
                          taskId: { from: "TaskID", type: "number" },
                          title: { from: "Title", defaultValue: "No title", validation: { required: true } },
                          start: { type: "date", from: "Start" },
                          end: { type: "date", from: "End" },
                          startTimezone: { from: "StartTimezone" },
                          endTimezone: { from: "EndTimezone" },
                          description: { from: "Description" },
                          recurrenceId: { from: "RecurrenceID" },
                          recurrenceRule: { from: "RecurrenceRule" },
                          recurrenceException: { from: "RecurrenceException" },
                          ownerId: { from: "OwnerID", defaultValue: 1 },
                          isAllDay: { type: "boolean", from: "IsAllDay" }
                      }
                  }
              },
              filter: {
                  logic: "or",
                  filters: [
                      { field: "ownerId", operator: "eq", value: 1 },
                      { field: "ownerId", operator: "eq", value: 2 }
                  ]
              }
          },
          resources: [
              {
                  field: "ownerId",
                  title: "Owner",
                  dataSource: [
                      { text: "Alex", value: 1, color: "#f8a398" },
                      { text: "Bob", value: 2, color: "#51a0ed" },
                      { text: "Charlie", value: 3, color: "#56ca85" }
                  ]
              }
          ]
      };
    }
]);