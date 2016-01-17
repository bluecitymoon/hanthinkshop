angular.module('starter.outsideworkcontroller', [])

  .controller('OutSideWorkCtrl', function ($ionicScrollDelegate, $ionicModal, $window, $scope, $state, CustomerService, StorageService, $ionicHistory, UtilService, $rootScope, Location, ReportService) {

    $scope.mapSize = {
      width: $window.innerWidth,
      height: parseInt( $window.innerHeight - $window.innerWidth /3 * 2 - 50)
    };

    $scope.currentPosition = {
      lng: null,
      lat: null,
      accuracy: null
    };

    $scope.positionFetched = false;

    $scope.map;
    $scope.geolocation;

    $rootScope.locationAddress = '';
    $scope.$on('$ionicView.enter', function (e) {

      $ionicScrollDelegate.scrollTop();
      Location.getLocation().then(function(position) {

        updatePostion(position);

      }, function() {
        console.debug('定位失败，可能会影响部分功能。');
      });

      $scope.map = new BMap.Map("allmap");
      var point = new BMap.Point(116.331398,39.897445);
      $scope.map.centerAndZoom(point,17);

    });

    function updatePostion(position, callback) {

      var lat = position.coords.latitude;
      var lng = position.coords.longitude;

      var new_point = new BMap.Point(lng,lat);

      var convertor = new BMap.Convertor();

      var pointArr = [];
      pointArr.push(new_point);

      convertor.translate(pointArr, 1, 5, translateCallback);

      $scope.positionFetched = true;

      $scope.currentPosition.lng = lng;
      $scope.currentPosition.lat = lat;

      if (callback) {
        callback();
      }
    }

    function translateCallback(data) {

      if(data.status === 0) {

        var marker = new BMap.Marker(data.points[0]);
        $scope.map.addOverlay(marker);

        var label = new BMap.Label("您的位置",{ offset: new BMap.Size(20, -10)});
        marker.setLabel(label);

        var point = data.points[0];
        $scope.map.setCenter(point);

        new BMap.Geocoder().getLocation(point, function(rs){
          var addComp = rs.addressComponents;

          var province = addComp.province;
          var city = addComp.city;

          var others = addComp.district  + addComp.street  + addComp.streetNumber ;
          if (province == city) {
            $rootScope.locationAddress = city + others;
          } else {
            $rootScope.locationAddress = province + city + others;
          }

          $scope.newCustomer.address = $rootScope.locationAddress;
        });

      } else {
        UtilService.showAlert("未知的GPS位置，部分功能受限。");
      }

    }

    $scope.workItems = [
      {name: '考勤签到', icon: 'ion-log-in', id: 'signin', customColor: 'balanced'},
      {name: '考勤签退', icon: 'ion-log-out', id: 'signout', customColor: 'assertive'},
      {name: '工作制定', icon: 'ion-ios-compose-outline', id: 'taskPlan', customColor: 'positive'},
      {name: '工作执行', icon: 'ion-ios-color-wand', id: 'executePlan', customColor: 'royal'},
      {name: '临时工作', icon: 'ion-ios-paper-outline', id: 'tempWork', customColor: 'energized '},
      {name: '新增客户', icon: 'ion-ios-personadd-outline', id: 'newCustomer', customColor: 'calm'}
      //{name: '意见反馈', icon: 'ion-social-octocat', id: 'submitComment', customColor: 'assertive'},
      //{name: '安全退出', icon: 'ion-ios-close-empty', id: 'safeExit', customColor: 'assertive'},

    ];

    $scope.itemHeight = $window.innerWidth / 3;

    $scope.userClickSingleButton = function (work) {

      switch (work.id) {
        case 'signin' :

          if ($scope.positionFetched) {
            CustomerService.userWorkSign($scope.currentPosition, '1', $rootScope.locationAddress);
          } else {
            UtilService.showAlert('签到失败，系统正在定位');
          }

          break;
        case 'signout' :

          if ($scope.positionFetched) {
            CustomerService.userWorkSign($scope.currentPosition, '0');
          } else {
            UtilService.showAlert('签退失败，系统正在定位');
          }

          break;
        case 'taskPlan' :

          $scope.newTaskModal.show();

          break;

        case 'executePlan' :

          $state.go('tasks');

          break;
        case 'tempWork' :
          $state.go('customer-detail', {customerId: 'new'});

          break;
        case 'newCustomer' :
          $scope.openModal();
          break;

        case 'safeExit' :
          logoffUser();
          break;

        case 'submitComment' :
          $scope.feedbackModal.show();

          break;
        default :
          break;

      }
    };

    $scope.closeFeedbackDialog = function() {
      $scope.feedbackModal.hide();
    };

    $scope.closeSelectUserDialog = function () {
      $scope.selectUserModal.hide();
    };

    $scope.openSelectUserPopupInCreateJobPage = function() {

      $scope.selectUserModal.show();
      CustomerService.loadJobUsers();
    };

    function logoffUser() {

      StorageService.setObject('currentuser', {});
      StorageService.setObject('customer_info', {});

      $ionicHistory.clearHistory();
      $ionicHistory.clearCache();

      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true,
        historyRoot: true
      });

      $state.go('sign-in');
    };

    $scope.saveCustomer = function() {

      $scope.newCustomer.lng = $scope.currentPosition.lng;
      $scope.newCustomer.lat = $scope.currentPosition.lat;

      CustomerService.createNewCustomer($scope.newCustomer);

    };

    $rootScope.$on('new_customer_saved', function(event, data) {
      UtilService.closeLoadingScreen();

      UtilService.showAlert('操作成功！');

      $scope.modal.hide();

    });

    $scope.submitTask = function() {

      CustomerService.createNewTask($scope.task);
    };

    $rootScope.$on('new_task_created', function(event, data) {

      UtilService.closeLoadingScreen();

      UtilService.showAlert('操作成功', function() {
        $scope.newTaskModal.hide();

        $scope.task = {visitDate : new Date(), customers: []};
      });

    });

    $scope.users = [];
    $rootScope.$on('job-users-load-event', function(event, data) {

      if (data.users) {
        $scope.users = data.users;
      }

      UtilService.closeLoadingScreen();
    });

    $scope.selectUser = function(user) {
        $scope.task.user = user;
        $scope.selectUserModal.hide();
    };

    $scope.datepickerObject = {
      titleLabel: '选择日期',  //Optional
      todayLabel: '今天',  //Optional
      closeLabel: '关闭',  //Optional
      setLabel: '确定',  //Optional
      setButtonType: 'button-balanced',  //Optional
      todayButtonType: 'button-balanced',  //Optional
      closeButtonType: 'button-balanced',  //Optional
      inputDate: new Date(),  //Optional
      mondayFirst: true,  //Optional
      weekDaysList: weekDaysList, //Optional
      monthList: monthList, //Optional
      templateType: 'modal', //Optional
      showTodayButton: 'true', //Optional
      modalHeaderColor: 'bar-balanced', //Optional
      modalFooterColor: 'bar-balanced', //Optional
      from: new Date(2000, 8, 2), //Optional
      to: new Date(2020, 8, 25),  //Optional
      callback: function (val) {  //Mandatory
        datePickerCallback(val);
      },
      dateFormat: 'yyyy/MM/dd', //Optional
      closeOnSelect: true //Optional
    };

    function datePickerCallback(val) {

      if (typeof(val) === 'undefined') {
        console.log('Date not selected');
      } else {
        $scope.task.visitDate = val;
        $scope.datepickerObject.inputDate = val;
      }
    }

    $scope.task = {visitDate : new Date(), customers: []};
    $ionicModal.fromTemplateUrl('templates/modal/new-job.html', {
      scope: $scope,
      animation: 'slide-in-up',
      id: 1
    }).then(function (modal) {
      $scope.newTaskModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal/new-customer-input.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal/select-user.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.selectUserModal = modal;
    });

    $scope.currentMessage = {};
    $scope.newCustomer = {};
    $scope.openModal = function (message) {

      $scope.modal.show();

    };

    $scope.closeMessageDetailDialog = function () {
      $scope.modal.hide();
      $scope.newTaskModal.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modal.remove();
      $scope.newTaskModal.remove();
      $scope.selectUserModal.remove();
      $scope.customerMoal.remove();

    });

    $scope.$on('modal.hidden', function () {
      $scope.newCustomer = {address: $rootScope.locationAddress};
    });

    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });


    //auto-complete-module
    $ionicModal.fromTemplateUrl('templates/modal/auto-complete-content.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.customerMoal = modal;
    });

    $scope.keywordCondition = {name: ''};
    $scope.openCustomerSelectionDialog = function () {

      $scope.selectUserModal.hide();

      $scope.keywordCondition.name = '';
      ReportService.loadReportAutocompleteOptions(4357, 'mobandangan');

      $scope.customerMoal.show();
    };

    $scope.closeAutoCompleteDialog = function () {
      $scope.customerMoal.hide();
    };


    $scope.conditions = [];
    $scope.options = [];
    $scope.allOptions = [];
    //$scope.detailOptions = [];
    $scope.menuOptions = [];

    $scope.optionTreeObject = [];

    $scope.collapse = true;

    $scope.toggleCollapse = function (item) {
      $scope.collapse = !$scope.collapse;

      showSecondLevelOptionsAndLoadOptions(item);

    };

    $scope.menuShown = true;
    $scope.toggleMenu = function () {
      $scope.menuShown = !$scope.menuShown;
    };

    $scope.customTemplate = 'item_default_renderer';

    $scope.toggleTemplate = function () {
      if ($scope.customTemplate == 'ion-item.tmpl.html') {
        $scope.customTemplate = 'item_default_renderer'
      } else {
        $scope.customTemplate = 'ion-item.tmpl.html'
      }
    };

    $rootScope.$on('search-report-conditions-load-event', function (event, data) {

      if (data.conditions) {
        $scope.conditions = data.conditions;
      }
      UtilService.closeLoadingScreen();
    });

    $scope.currentOptionsType = '';
    $scope.currentSelectCondition = {};

    $rootScope.$on('search-report-options-load-event', function (event, data) {

      if (data.options) {
        angular.forEach(data.options, function (value, key) {

          if (key == 'leibie') {
            $scope.allOptions = value;


            var firstLevelOptions = [];
            angular.forEach(value, function (o, k) {

              if (o.bianma && o.bianma.length == 4) {

                o.name = o.mingcheng;
                o.checked = true;
                firstLevelOptions.push(o);
              }
            });

            buildTreeObjectForMenu(firstLevelOptions);

            $scope.optionTreeObject = firstLevelOptions;

            $scope.menuOptions = firstLevelOptions;


          } else {

            if (value && value.length == 0) {

              $scope.thereisNoMorePages = true;
              UtilService.showAlert('没有发现数据');

            } else {
              angular.forEach(value, function (o, k) {

                $scope.options.unshift(o);
              });
            }
          }

          $scope.currentOptionsType = key;

          $scope.$broadcast('scroll.refreshComplete');

        });
      } else {
        UtilService.showAlert('没有发现数据');
      }

      UtilService.closeLoadingScreen();
    });

    function buildTreeObjectForMenu(options) {

      angular.forEach(options, function (value, index) {

        var nextLevelOptionArray = findNextLevelOptions(value);

        if (nextLevelOptionArray.length > 0) {
          value.tree = nextLevelOptionArray;
          buildTreeObjectForMenu(nextLevelOptionArray);
        }

      });

    };

    function findNextLevelOptions(inputOption) {

      var secondLevelOptions = [];
      var firstLevelOptionLength = inputOption.bianma.length;
      angular.forEach($scope.allOptions, function (option, i) {

        if (option.bianma) {

          var secondLevelOptionLength = option.bianma.length;
          var gap = secondLevelOptionLength - firstLevelOptionLength;

          if (gap == 2 && option.bianma.indexOf(inputOption.bianma) > -1) {

            option.name = option.mingcheng;
            option.checked = true;

            secondLevelOptions.push(option);
          }
        }
      });

      return secondLevelOptions;
    };

    $scope.closeDetailDialog = function () {
      $scope.customerMoal.hide();

    };
    $scope.currentSelectCondition = {id: 4357, shujuleixing: 'mobandangan'};
    $scope.showSecondLevelOptionsAndLoadOptions = function ($event) {

      var optionId = $event.target.id;

      //THERE is a <SPAN> under <ion-item>. when user clicks on the span, what we want is actually the ion-item. so we ask for its parent element.
      if (!optionId) {
        optionId = $event.target.parentElement.id;
      }

      //var text = $event.target.innerText;
      //if (text) {
      //    $scope.keywordCondition.name = text;
      //}

      if (optionId) {
        ReportService.loadFinalOptionResultWithCategory($scope.currentSelectCondition.id, optionId, '', 1, 'mobandangan');
      }
    };

    $scope.keywordCondition = {name: ''};

    $scope.currentPageIndex = 1;
    $scope.searchOptionsWithKeyword = function (wantNextPage) {

      if ($scope.thereisNoMorePages && wantNextPage) {

        UtilService.showAlert('没有更多的数据了');
        $scope.$broadcast('scroll.refreshComplete');

        return;
      }

      if (wantNextPage) {
        $scope.currentPageIndex++;
      } else {

        //without wantNextPage parameter means 'clicking search' button.
        clearUpLastQueryData();
      }

      ReportService.searchOptionsWithKeyword($scope.keywordCondition.name, $scope.currentSelectCondition.id, $scope.currentPageIndex, 'mobandangan');

    };

    function clearUpLastQueryData() {

      $scope.options = [];
      $scope.currentPageIndex = 1;
    }

    $rootScope.$on('search-option-detail-load-event', function (event, data) {

      var detailOptionsList = data.detailOptions;
      if (detailOptionsList) {

        $scope.options = detailOptionsList;
      }

      UtilService.closeLoadingScreen();

    });

    $scope.showSecondLevelOptionsOrCloseDialog = function (option) {

      $scope.task.customers.push({kehu: option.mingcheng});
      $scope.customerMoal.hide();

    };


  });
