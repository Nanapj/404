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
                        templateUrl: '/home/dashboard'
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
                                return $ocLazyLoad.load('/App/ctrl/staffCtrl.js'); // Resolve promise and load before view 
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
