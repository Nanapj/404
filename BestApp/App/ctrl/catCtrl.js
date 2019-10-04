'use strict';

angular.module('app')
    .controller('CatCtrl', ['$scope', '$state', '$http', function ($scope, $state, $http){
        console.log('CatCtrl loaded!');
        var _url = "/odata/Cats";
        var vm = this;

        vm.toolbarTemplate = toolbarTemplate;
        vm.create = create;
        
        function create(){
            $state.go('app.dashboard');
        }

        function toolbarTemplate() {
            return kendo.template($("#toolbar").html());
        }

        $scope.mainGridOptions = {
            dataSource: {
                type: "odata-v4",
                transport: {
                    read: _url
                },
                pageSize: 5,
                serverPaging: true,
                serverSorting: true
            },
            sortable: true,
            pageable: true,
            height: 600,
            dataBound: function() {
                this.expandRow(this.tbody.find("tr.k-master-row").first());
            },
            columns: [{
                field: "Name",
                title: "Name",
                width: "50px"
                },{
                field: "Age",
                title: "Age",
                width: "120px"
            }]
        };
}]);