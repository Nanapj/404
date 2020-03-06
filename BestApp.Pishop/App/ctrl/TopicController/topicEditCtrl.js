'use strict';
angular.module('app')
    .controller('TopicEditCtrl', ['$scope', '$state', '$stateParams', '$http', 'toaster', function ($scope, $state, $stateParams, $http, toaster){
        var _url = "/odata/TopicPSs";
        var vm = this;
        vm.access_token = localStorage.getItem('access_token');
        vm.model = {};
        vm.topicBack = topicBack;
        var _blogURL = "/odata/BlogPSs";
        $scope.initTopic = function() {
            $http({
                method: 'GET',
                url: _url+'?ID=' + $stateParams.ID.replace(/['"]+/g, '')  ,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ vm.access_token.replace(/['"]+/g, '')
                },
              }).then(function successCallback(response) {
                  console.log()
                  
                    var staff = response.data;
                    vm.model = staff;
                    vm.blogData.Category = staff.BlogCategory;
                    vm.blogData.ID = staff.BlogPSID;
                    console.log("blog" + vm.blogData.Category);
                    console.log("Topic");
                    console.log(vm.model)
                  
                
                }, function errorCallback(response) {
                  console.log(response);
            });
        }
        $scope.onBlogSelChanged = function() {
            vm.model.BlogPSID = vm.selectedBlogData.ID;
           console.log(vm.model.BlogPSID )
            
        }
        vm.blogData = { 
            type: "odata-v4",
            serverFiltering: true,
            transport: {
                read: {
                    url: _blogURL,
                }
            }
        }
        $scope.initTopic();
        function topicBack(){
            $state.go('app.topic.index');
        }
        $scope.toolEdit={
            tools: [
                "bold",
                "italic",
                "underline",
                "strikethrough",
                "justifyLeft",
                "justifyCenter",
                "justifyRight",
                "justifyFull",
                "insertUnorderedList",
                "insertOrderedList",
                "indent",
                "outdent",
                "createLink",
                "unlink",
                "insertImage",
                "insertFile",
                "subscript",
                "superscript",
                "tableWizard",
                "createTable",
                "addRowAbove",
                "addRowBelow",
                "addColumnLeft",
                "addColumnRight",
                "deleteRow",
                "deleteColumn",
                "mergeCellsHorizontally",
                "mergeCellsVertically",
                "splitCellHorizontally",
                "splitCellVertically",
                "viewHtml",
                "formatting",
                "cleanFormatting",
                "copyFormat",
                "applyFormat",
                "fontName",
                "fontSize",
                "foreColor",
                "backColor",
                "print"
            ],
            resizable: {
                content: true,
                toolbar: true,
                
            },
        }
        vm.editSubmit = function() {
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
                    toaster.pop('success', "Thành công", "Đã cập nhật xong");
                    $state.go('app.topic.index');
                } else {
                    toaster.pop('error', "Lỗi", "Có lỗi trong quá trình cập nhật");
                }
            });
        }
    }
]);