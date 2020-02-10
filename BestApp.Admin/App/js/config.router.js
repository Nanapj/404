'use strict';

angular.module('app')
    .run(
        ['$rootScope', '$state', '$stateParams',
            function ($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
                
                $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                  if (localStorage.getItem("UserLogged") != null) {
                      $rootScope.UserLogged = JSON.parse(localStorage.getItem("UserLogged"));
                  } else {
                      if (toState.name != 'account.login' && toState.name != 'account.register') {
                          event.preventDefault();
                          $state.go('account.login');
                      }
                  }
                });

            }
        ]
    )
    .config(
        ['$stateProvider', '$urlRouterProvider', 'JQ_CONFIG', 'MODULE_CONFIG',
            function ($stateProvider, $urlRouterProvider, JQ_CONFIG, MODULE_CONFIG) {
                var layout = "home/app";

                $stateProvider
                    .state('app', {
                        abstract: true,
                        url: '/app',
                        templateUrl: layout
                    })
                    .state('app.dashboard', {
                        url: '/dashboard',
                        templateUrl: '/home/dashboard',
                        resolve: {
                            deps: ['uiLoad', function (uiLoad) {
                                return uiLoad.load('/App/ctrl/DashboardController/dashboardCtrl.js'); // Resolve promise and load before view 
                            }]
                        }
                    })
                    .state('app.profile', {
                      url: '/profile',
                      templateUrl: '/Account/ResetPassword',
                      resolve: {
                          deps: ['uiLoad', function (uiLoad) {
                              return uiLoad.load('/App/ctrl/accountCtrl.js'); // Resolve promise and load before view 
                          }]
                      }
                  })
                    .state('app.cat', {
                        abstract: true,
                        url: '/cat',
                        template: '<div ui-view class="fade-in-down"></div>',
                        resolve: {
                            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('/App/ctrl/catCtrl.js'); // Resolve promise and load before view 
                            }]
                        }
                    })
                    .state('app.cat.index', {
                        url: '/index',
                        templateUrl: '/cat',
                    })
                    .state('app.staff', {
                        abstract: true,
                        url: '/staff',
                        template: '<div ui-view class="fade-in-down"></div>',
                        resolve: {
                            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('/App/ctrl/StaffController/staffCtrl.js'); // Resolve promise and load before view 
                            }]
                        }
                    })
                    .state('app.staff.index', {
                        url: '/index',
                        templateUrl: '/staff/index'
                    })
                    .state('app.staff.create', {
                        url: '/create',
                        templateUrl: '/staff/create'
                    })
                    .state('app.staff.edit', {
                        url: '/edit/:ID',
                        templateUrl: '/staff/edit',
                        resolve: {
                            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('/App/ctrl/StaffController/editStaffCtrl.js'); // Resolve promise and load before view 
                            }]
                        }
                    })
                    .state('app.crevent', {
                        abstract:true,
                        url: '/crevent',
                        template: '<div ui-view class="fade-in-down"></div>',
                        resolve: {
                            deps: ['$ocLazyLoad', function($ocLazyLoad) { 
                                return $ocLazyLoad.load('/App/ctrl/CREventController/crEventIndexCtrl.js');
                            }]
                        }
                    })
                    .state('app.crevent.index', {
                        url: '/index',
                        templateUrl: '/crevent/Index'
                    })
                    .state('app.crevent.creventcreation', {
                        url: '/creventcreation',
                        templateUrl: '/crevent/EventCreation',
                        resolve: {
                            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                                return $ocLazyLoad.load('/App/ctrl/CREventController/crEventCreationCtrl.js');
                            }]
                        }
                    })
                    .state('app.crevent.creventmanager', {
                        url: '/creventmanager',
                        templateUrl:'/crevent/EventManager',
                        resolve: {
                            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                                return $ocLazyLoad.load('/App/ctrl/CREventController/crEventManagerCtrl.js');
                            }]
                        }
                    })
                    .state('app.crevent.crremindermanager', {
                        url: '/crremindermanager',
                        templateUrl:'/crevent/ReminderManager',
                        resolve: {
                            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                                return $ocLazyLoad.load('/App/ctrl/CREventController/crReminderManagerCtrl.js');
                            }]
                        }
                    })
                    .state('app.department', {
                        abstract: true,
                        url: '/department',
                        template: '<div ui-view class="fade-in-down"></div>',
                        resolve: {
                            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('/App/ctrl/DepartmentController/departmentCtrl.js'); // Resolve promise and load before view 
                            }]
                        }
                    }).
                    state('app.department.index', {
                        url: '/index',
                        templateUrl: '/department/Index'
                    })
                    .state('app.department.create', {
                        url:'/create',
                        templateUrl: '/department/Create'
                    })
                    .state('app.department.edit', {
                        url: '/edit/:ID',
                        templateUrl:'/department/Edit',
                        resolve: {
                            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                                return $ocLazyLoad.load('/App/ctrl/DepartmentController/departmentEditCtrl.js');
                            }]
                        }
                    })
                    .state('app.customer', {
                        url:'/customer',
                        template: '<div ui-view class="fade-in-down"></div>',
                        resolve: {
                            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('/App/ctrl/CustomerController/cusCtrl.js'); // Resolve promise and load before view 
                            }]
                        }
                    })
                    .state('app.customer.index', {
                        url:'/index',
                        templateUrl: '/customer/Index'
                    })
                    .state('app.customer.profile', {
                        url:'/profile/:ID',
                        templateUrl: '/customer/ProfileDetail',
                        resolve: {
                            deps: ['$ocLazyLoad', function($ocLazyLoad){
                                return $ocLazyLoad.load('/App/ctrl/CustomerController/cusProfileCtrl.js');
                            }]
                        }
                    })
                    .state('app.producttype', {
                        url:'/producttype',
                        template: '<div ui-view class="fade-in-down"></div>',
                        resolve: {
                            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                                return $ocLazyLoad.load('/App/ctrl/ProductTypeController/ProductTypeCtrl.js');
                            }]
                        }
                    })
                    .state('app.producttype.create', {
                        url: '/create',
                        templateUrl: '/producttype/create'
                    })
                    .state('app.producttype.index', {
                        url:'/index',
                        templateUrl:'/producttype/Index'
                    })
                    .state('app.producttype.edit', {
                        url: '/edit/:ID',
                        templateUrl: '/producttype/edit',
                        resolve: {
                            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('/App/ctrl/ProductTypeController/ProductTypeEditCtrl.js'); // Resolve promise and load before view 
                            }]
                        }
                    })
                    .state('app.creventsource',{
                        url:'/creventsource',
                        template: '<div ui-view class="fade-in-down"></div>',
                        resolve: {
                            devs: ['$ocLazyLoad', function($ocLazyLoad) {
                                return $ocLazyLoad.load('/App/ctrl/CrEventSourceController/crEventSourceCtrl.js');
                            }]
                        }
                    })
                    .state('app.creventsource.index', {
                        url:'/index',
                        templateUrl: '/CrEventSource/Index'
                    })
                    .state('app.creventsource.create', {
                        url:'/create',
                        templateUrl: '/CrEventSource/Create'
                    })
                    .state('app.creventsource.edit', {
                        url: '/edit/:ID',
                        templateUrl:'/CrEventSource/Edit',
                        resolve: {
                            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                                return $ocLazyLoad.load('/App/ctrl/CrEventSourceController/crEventSourceEditCtrl.js');
                            }]
                        }
                    })
                    .state('account', {
                        url: '/account',
                        template: '<div ui-view class="fade-in-right-big smooth"></div>'
                    })
                    .state('account.login', {
                        url: '/login',
                        templateUrl: '/account/login',
                        resolve: {
                            deps: ['uiLoad', function (uiLoad) {
                                return uiLoad.load('/App/ctrl/loginCtrl.js'); // Resolve promise and load before view 
                            }]
                        }
                    })
                    .state('account.register', {
                        url: '/register',
                        templateUrl: '/account/register',
                        resolve: {
                            deps: ['uiLoad', function (uiLoad) {
                                return uiLoad.load('/App/ctrl/registerCtrl.js'); // Resolve promise and load before view 
                            }]
                        }
                    });
                  
                $urlRouterProvider.otherwise('app/dashboard');


          function load(srcs, callback) {
            return {
                deps: ['$ocLazyLoad', '$q',
                  function( $ocLazyLoad, $q ){
                    var deferred = $q.defer();
                    var promise  = false;
                    srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
                    if(!promise){
                      promise = deferred.promise;
                    }
                    angular.forEach(srcs, function(src) {
                      promise = promise.then( function(){
                        if(JQ_CONFIG[src]){
                          return $ocLazyLoad.load(JQ_CONFIG[src]);
                        }
                        angular.forEach(MODULE_CONFIG, function(module) {
                          if( module.name == src){
                            name = module.name;
                          }else{
                            name = src;
                          }
                        });
                        return $ocLazyLoad.load(name);
                      } );
                    });
                    deferred.resolve();
                    return callback ? promise.then(function(){ return callback(); }) : promise;
                }]
            }
          }


      }
    ]
  );
