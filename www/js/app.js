// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var mode = 'DEBUG';
var ServerRoot = '';

var weekDaysList = ["六", "日", "一", "二", "三", "四", "五"];
var monthList = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

angular.module('starter', ['ionic', 'starter.controllers', 'starter.product-controller', 'starter.datacontrollers','starter.outsideworkcontroller', 'starter.cart-controller', 'starter.services', 'ion-tree-list', 'checklist-model', 'angular.filter', 'ti-segmented-control'])

    .constant('mapkey', 'f42572d0237047d15f2a6306b7e763b7')

    .constant('HanthinkApiAddress', 'http://www.hanthink.cc:808/hanthinkapi/')

    .run(function($ionicPlatform, StorageService, $state) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            var customer = StorageService.getObject("customer_info");

            if (customer && customer.ip) {
              ServerRoot = customer.ip;
            }

            var loggedUser = StorageService.getObject('currentuser');

            if (loggedUser && loggedUser.token && customer && customer.ip) {

                $state.go('tab.home');
            } else {
                $state.go('sign-in');
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider) {

        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive

            .state('sign-in', {
                url: '/sign-in',
                templateUrl: 'templates/sign-in.html',
                controller: 'LoginCtrl'
            })

            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })

            .state('tab.home', {
                url: '/home',
                views: {
                    'tab-home': {
                        templateUrl: 'templates/tab-home.html',
                        controller: 'HomeCtrl'
                    }
                }
            })
            .state('tab.cart', {
                url: '/shopcart',
                views: {
                    'tab-cart': {
                        templateUrl: 'templates/tab-shopcart.html',
                        controller: 'ShopCartCtrl'
                    }
                }
            })

            // Each tab has its own nav history stack:

            .state('tab.reporttypes', {
                url: '/reporttypes',
                views: {
                    'tab-reporttypes': {
                        templateUrl: 'templates/tab-report.html',
                        controller: 'ReportTypesCtrl'
                    }
                }
            })

            .state('product-list', {
                url: '/products/:categoryid',
                templateUrl: 'templates/product/product-list.html',
                controller: 'ProductListCtrl'

            })

            .state('product-detail', {
                url: '/product/:productid',
                templateUrl: 'templates/product/product-detail.html',
                controller: 'ProductDetailCtrl'

            })

            .state('report-search', {
                url: '/searchreport/:typeid',
                templateUrl: 'templates/search-report.html',
                controller: 'ReportSearchCtrl'

            })

            .state('report-search-result', {
                url: '/reports',
                templateUrl: 'templates/report/reports.html',
                controller: 'ReportResultCtrl'

            })
            .state('tab.data', {
                url: '/data',
                views: {
                    'tab-data': {
                        templateUrl: 'templates/tab-data.html',
                        controller: 'DataTypesCtrl'
                    }
                }
            })

            .state('data-search', {
                url: '/data/:typeid/:typename',
                templateUrl: 'templates/data/data-input.html',
                controller: 'DataCtrl'

            })

            .state('tab.chats', {
                url: '/chats',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/tab-chats.html',
                        controller: 'ChatsCtrl'
                    }
                }
            })
            .state('chatdetail', {
                url: '/chats/:chatId/:face/:type',
                templateUrl: 'templates/chat-detail.html',
                controller: 'ChatDetailCtrl'

            })

            .state('tasks', {
                url: '/tasks',
                templateUrl: 'templates/tab-customer.html',
                controller: 'CustomerCtrl'
            })

          .state('tab.outsidework', {
            url: '/outsidework',
            views: {
              'tab-outsidework': {
                templateUrl: 'templates/tab-outside-work.html',
                controller: 'OutSideWorkCtrl'
              }
            }
          })
            .state('customer-detail', {
                url: '/customer/:customerId',
                templateUrl: 'templates/customer-detail.html',
                controller: 'CustomerDetailController'
            })
        ;

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/sign-in');
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.navBar.alignTitle('center');

    });
