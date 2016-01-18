angular.module('starter.controllers', ['ionic-datepicker'])

    .controller('HomeCtrl', function ($scope, $state, $window, $ionicScrollDelegate) {
        $scope.categories = [
            {id: 1, name: '潮流女装'}, {id: 2, name: '日常用品'}, {id: 3, name: '军火'}, {id: 4, name: '核武器'}, {
                id: 6,
                name: '书籍'
            }, {id: 1, name: '食品'}, {id: 2, name: '日常用品'}, {id: 3, name: '军火'}, {id: 4, name: '核武器'}, {
                id: 6,
                name: '书籍'
            }, {id: 1, name: '食品'}, {id: 2, name: '日常用品'}, {id: 3, name: '军火'}, {id: 4, name: '核武器'}, {
                id: 6,
                name: '书籍'
            }
        ];

        $scope.detailCategories = [
            {id: 1, name : '毛呢大衣', image : 'http://m.360buyimg.com/mobile/s100x100_jfs/t2305/354/925073102/2343/4c4c7033/563341f8Nd8edf0fc.jpg'},
            {id: 2, name : '羽绒服', image : 'http://m.360buyimg.com/mobile/s100x100_jfs/t2539/348/30382811/8390/15365285/56334287Nb3f282d0.jpg'},
            {id: 3, name : '针织衫', image : 'http://m.360buyimg.com/mobile/s100x100_jfs/t1966/126/905412055/7275/8b097549/563342e4N096f101d.jpg'},
            {id: 4, name : '连衣裙', image : 'http://m.360buyimg.com/mobile/s100x100_jfs/t2446/159/924672446/2448/2699d176/56334334N29f3d85d.jpg'},
            {id: 5, name : '棉服', image : 'http://m.360buyimg.com/mobile/s100x100_jfs/t1975/196/891084911/3889/8bd63534/56334380Ne4a77479.jpg'}
        ];
        $scope.selectedCategory = {};
        $scope.screenHeight = $window.innerHeight;
        $scope.screenWidth = parseInt($window.innerWidth / 3);

        $scope.clickFirstLevelCategory = function (category, index) {

            clearSelectionStatus();

            category.active = true;

            $scope.selectedCategory = category;

            var middleIndex = parseInt(parseInt($window.innerHeight / 52) / 2);

            var heightToTop = 52 * (index - middleIndex);
            if (heightToTop > 0) {
                $ionicScrollDelegate.scrollTo(0, heightToTop, true);
            } else {
                $ionicScrollDelegate.scrollTop();
            }

        };

        function clearSelectionStatus() {
            angular.forEach($scope.categories, function (value, index) {
                if (value.active) value.active = false;
            });
        }

        $scope.goProductListPage  = function(category) {

            $state.go('product-list', {categoryid : category.id});
        };
    })

    .controller('LoginCtrl', function ($scope, AuthenticationService, $state, $rootScope, $ionicPopup, UtilService, StorageService, $ionicHistory) {

        var customer = StorageService.getObject("customer_info");

        var code = '';
        if (customer && customer.code) {
            code = customer.code;
        }

        $scope.user = {username: '', password: null, code: code};

        $scope.signIn = function (user) {

            $scope.alreadyAlert = false;

            UtilService.showLoadingScreen();

            if (user && user.username && user.password && user.code) {

                //var customerInformation = StorageService.getObject("customer_info");
                //var savedCode = customerInformation.code;
                //
                //if (savedCode && savedCode == user.code) {
                //
                //  AuthenticationService.getToken($scope.user);
                //
                //} else {
                AuthenticationService.getUserIpInformation($scope.user, function () {

                    AuthenticationService.getToken($scope.user);
                });
                // }

            } else {

                UtilService.closeLoadingScreen();

                UtilService.showAlert('请输入用户名，密码及公司代码');

            }

        };

        $rootScope.$on('user-server-ip-loaded-event', function (event, data) {

            if (data && data.ip) {

                StorageService.setObject('customer_info', {ip: data.ip, code: $scope.user.code});
                ServerRoot = data.ip;

            }
        });


        $scope.alreadyAlert = false;
        $rootScope.$on('login-event', function (event, data) {

            var response = data.response;

            if (response && response.code) {

                switch (response.code) {

                    case "5":

                        if (!$scope.alreadyAlert) {
                            UtilService.showAlert(response.message);
                        }
                        $scope.alreadyAlert = true;
                        break;

                    case "6":

                        $ionicHistory.clearHistory();

                        $ionicHistory.nextViewOptions({
                            disableAnimate: true,
                            disableBack: true,
                            historyRoot: true
                        });

                        $rootScope.userAvatar = response.url;

                        var currentuser = {
                            username: $scope.user.username,
                            password: $scope.user.password,
                            token: response.token,
                            url: response.url
                        };

                        UtilService.setCurrentLoggedInUser(currentuser);

                        StorageService.setObject('currentuser', currentuser);

                        $state.go('tab.chats');

                        break;
                    default:

                        UtilService.showAlert(response.message);
                        break;
                }
            }

            UtilService.closeLoadingScreen();
        });
    })

    .controller('DataTypesCtrl', function ($scope, DataService, $rootScope, UtilService, $window) {
        $scope.$on('$ionicView.enter', function (e) {
            DataService.getTypes();
        });

        $scope.types = [];

        $rootScope.$on('data-type-load-event', function (event, data) {

            if (data.types) {
                $scope.types = data.types;

                angular.forEach($scope.types, function (value, index) {

                    value.icon = UtilService.getIconByIndex(index + 4);
                    value.customColor = UtilService.getRandomColorName();
                });
            }
            UtilService.closeLoadingScreen();
        });

        $scope.itemHeight = $window.innerWidth / 3;
    })

    .controller('ReportTypesCtrl', function ($scope, ReportService, $rootScope, UtilService, $window) {

        $scope.$on('$ionicView.enter', function (e) {
            ReportService.getTypes();
        });

        $scope.types = [];

        $rootScope.$on('report-type-load-event', function (event, data) {

            if (data.types) {
                $scope.types = data.types;

                angular.forEach($scope.types, function (value, index) {

                    value.icon = UtilService.getIconByIndex(index);
                    value.customColor = UtilService.getRandomColorName();
                });

            }
            UtilService.closeLoadingScreen();
        });

        $scope.itemHeight = $window.innerWidth / 3;
    })

    .controller('ReportResultCtrl', function ($rootScope, $scope, $state, UtilService, ReportService, $ionicModal) {

        $scope.currentPageNumber = 1;
        $scope.message = {pullingText: '下拉加载下一页'};
        $scope.$on('$ionicView.enter', function (e) {

            ReportService.queryReport(ReportService.getLastSearchCondition(), $scope.currentPageNumber);

        });

        $scope.selectedReport = {};
        $scope.showReportDetail = function (report) {
            $scope.selectedReport = report;

            $scope.modal.show();
        };

        $scope.reports = [];
        $scope.top3Attributes = [];

        var top3AttributesFound = false;
        $rootScope.$on('search-report-load-event', function (event, data) {

            if (data.reports && data.reports.length > 0) {

                angular.forEach(data.reports, function (value, index) {
                    $scope.reports.push(value);
                });

                if (!top3AttributesFound) {
                    var singleReportKeys = Object.keys(data.reports[0]);
                    top3AttributesFound = true;

                    $scope.top3Attributes.push(singleReportKeys[0]);
                    $scope.top3Attributes.push(singleReportKeys[1]);
                    $scope.top3Attributes.push(singleReportKeys[2]);

                }

            } else {
                $scope.message.pullingText = '已没有更多数据';
            }

            UtilService.closeLoadingScreen();
        });

        $ionicModal.fromTemplateUrl('templates/modal/single-report-detail.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.closeAutoCompleteDialog = function () {
            $scope.modal.hide();

        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {

        });

        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            // Execute action
        });
    })

    .controller('ReportSearchCtrl', function ($scope, ReportService, $rootScope, $stateParams, $ionicHistory, UtilService, $ionicModal, $ionicActionSheet, $state) {

        $scope.$on('$ionicView.enter', function (e) {

            var typeId = $stateParams.typeid;

            ReportService.loadReportSearchConditions(typeId);

        });

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
            $scope.modal.hide();

        };
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
                ReportService.loadFinalOptionResultWithCategory($scope.currentSelectCondition.id, optionId, '', 1, 'baobiaotiaojian');
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

            ReportService.searchOptionsWithKeyword($scope.keywordCondition.name, $scope.currentSelectCondition.id, $scope.currentPageIndex, 'baobiaotiaojian');

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

            $scope.currentSelectCondition.moren1 = option.mingcheng;
            $scope.modal.hide();

        };

        $scope.queryReport = function () {

            ReportService.setLastSearchCondition($scope.conditions);
            $state.go('report-search-result');
        };

        $scope.openAutoComplete = function (condition) {
            $scope.currentSelectCondition = condition;

            if (condition.id) {

                $scope.openModal(condition);
            }

        };

        $scope.goback = function () {
            $ionicHistory.goBack();
        };

        $scope.datepickerObject = {
            titleLabel: '选择日期',  //Optional
            todayLabel: '今天',  //Optional
            closeLabel: '关闭',  //Optional
            setLabel: '确定',  //Optional
            setButtonType: 'button-assertive',  //Optional
            todayButtonType: 'button-calm',  //Optional
            closeButtonType: 'button-calm',  //Optional
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

        $scope.currentSelectPositionType = 'moren1';
        $scope.openDateDialog = function (condition, type) {

            $scope.currentSelectCondition = condition;
            $scope.currentSelectPositionType = type;
        };

        function datePickerCallback(val) {

            if (typeof(val) === 'undefined') {
                console.log('Date not selected');
            } else {

                if ($scope.currentSelectPositionType === 'moren2') {
                    $scope.currentSelectCondition.moren2 = val;
                } else {
                    $scope.currentSelectCondition.moren1 = val;
                }
            }
        }

        $ionicModal.fromTemplateUrl('templates/modal/auto-complete-content.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });


        $scope.openModal = function (condition) {

            $scope.keywordCondition.name = '';
            ReportService.loadReportAutocompleteOptions(condition.id, 'baobiaotiaojian');

            $scope.modal.show();
        };

        $scope.closeAutoCompleteDialog = function () {
            $scope.modal.hide();
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {
            $scope.currentPageIndex = 1;
            $scope.options = [];

            $scope.thereisNoMorePages = false;

            $scope.menuShown = true;
        });

        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            // Execute action
        });
    })

    .controller('ChatsCtrl', function ($window, Camera, $ionicActionSheet, CustomerService, $ionicPopup, $ionicHistory, StorageService, $scope, Chats, $rootScope, UtilService, $state, $ionicModal) {

        $scope.currentUserName = UtilService.getCurrentLoggedInUser().username;

        $scope.logoffUser = function () {

            $ionicPopup.show({
                template: '确定安全退出系统吗？',
                title: '注销',
                scope: $scope,
                buttons: [
                    {text: '取消'},
                    {
                        text: '<b>确定</b>',
                        type: 'button-positive',
                        onTap: function (e) {

                            $scope.userProfileDialog.hide();

                            var user = StorageService.getObject("currentuser");
                            user.password = '';
                            StorageService.setObject('currentuser', user);

                            var customerInformation = StorageService.getObject("customer_info");
                            customerInformation.ip = '';
                            StorageService.setObject('customer_info', customerInformation);

                            $ionicHistory.clearHistory();
                            $ionicHistory.clearCache();

                            $ionicHistory.nextViewOptions({
                                disableAnimate: true,
                                disableBack: true,
                                historyRoot: true
                            });

                            UtilService.setCurrentLoggedInUser({});

                            $state.go('sign-in');

                        }
                    }
                ]
            });

        };

        $scope.feedback = {comments: ''};
        $scope.submitFeedback = function () {

            CustomerService.submitFeedback($scope.feedback);

        };
        $ionicModal.fromTemplateUrl('templates/modal/feedback.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.feedbackModal = modal;
        });

        $scope.openFeedbackDialog = function () {
            $scope.feedbackModal.show();
        };

        $scope.closeFeedbackDialog = function () {
            $scope.feedbackModal.hide();
        };

        $scope.showUserCenter = function () {
            $scope.userProfileDialog.show();
        };

        $scope.closeUserProfileDialog = function () {
            $scope.userProfileDialog.hide();
        };

        $scope.closePublishDialog = function () {
            $scope.publishDialog.hide();
        };

        $scope.showPublishDialog = function () {
            $scope.publishDialog.show();
        };

        $scope.publish = {comments: ''};
        $scope.submitPublish = function () {

            CustomerService.submitBroadcast($scope.publish);
        };

        $rootScope.$on('broadcast-uploaded-event', function () {

            UtilService.closeLoadingScreen();

            $scope.publishDialog.hide();
            $scope.publish.comments = '';
        });

        $rootScope.$on('feedback-uploaded-event', function (event, data) {

            UtilService.closeLoadingScreen();

            $scope.feedbackModal.hide();
            $scope.feedback.comments = '';

        });

        $rootScope.userAvatar = UtilService.getCurrentLoggedInUser().url;

        var camera = 0;
        var photoAlbum = 1;
        // $scope.data = {imageURI: ''};
        $scope.takePicture = function (type) {

            var options = {
                quality: 85,
                destinationType: 0,
                sourceType: type,
                allowEdit: true,
                encodingType: 1, //png
                targetWidth: $window.innerWidth,
                targetHeight: $window.innerHeight,
                saveToPhotoAlbum: false,
                mediaType: 0
            };

            $scope.data = {imageURI: ''};
            Camera.getPicture(options).then(function (imageURI) {

                //$scope.data.imageURI = imageURI;

                CustomerService.uploadUserAvatar(imageURI);
            }, function (err) {
                console.debug('拍照失败 ' + err);
            });
        };

        $rootScope.$on('user-avatar-uploaded-event', function (event, data) {
            if (data.avatar) {

                $rootScope.userAvatar = data.avatar;

                var user = StorageService.getObject("currentuser");
                user.url = data.avatar;
                StorageService.setObject('currentuser', user);

            }

            UtilService.closeLoadingScreen();
        });
        $scope.openSelectSourceTypeDialog = function () {

            $ionicActionSheet.show({
                buttons: [
                    {text: '从相册选取'},
                    {text: '拍照'}
                ],
                titleText: '更换头像',
                cancelText: '取消',
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked: function (index) {

                    $scope.takePicture(index);

                    return true;
                }
            });
        };

        $ionicModal.fromTemplateUrl('templates/modal/user-profile-center.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.userProfileDialog = modal;
        });

        $ionicModal.fromTemplateUrl('templates/modal/new-publish.html', {
            id: 1,
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.publishDialog = modal;
        });

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {

            $scope.userProfileDialog.remove();
            $scope.feedbackModal.remove();
            $scope.publishDialog.remove();

        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {

        });

        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            // Execute action
        });

        $scope.contact = {searchingKeyword: ''};
        $scope.selectedTabIndex = 1;
        $scope.filterChatsByType = function (index) {

            if (index || index == 0) {

                $scope.selectedTabIndex = index + 1;

            }

            $scope.filterChats = getChatsByType();
            console.debug($scope.filterChats);
            $scope.$applyAsync();

        };


        function getChatsByType() {

            var chats = [];
            angular.forEach($scope.chats, function (value, index) {

                if ($scope.selectedTabIndex == value.leixing) {

                    if ($scope.contact.searchingKeyword) {

                        var zhujifu = value.zhujifu;

                        if (value.fsr.indexOf($scope.contact.searchingKeyword) > -1 ||
                            (zhujifu && angular.lowercase(zhujifu).indexOf(angular.lowercase($scope.contact.searchingKeyword)) > -1 )) {
                            chats.push(value);
                        }

                    } else {
                        chats.push(value);
                    }

                }
            });

            return chats;
        }


        $scope.$on('$ionicView.enter', function (e) {

            Chats.loadAllMyChats();

        });

        $scope.chats = [];
        $scope.typeSelectedIndex = 0;
        $scope.filterChats = [];
        $rootScope.$on('all-my-chats-load-event', function (event, data) {

            if (data.chats) {
                $scope.chats = data.chats;

                angular.forEach($scope.chats, function (value, index) {

                    if (!value.url1) {
                        value.url1 = UtilService.getRandomAvatar();
                    }
                    // value.face = UtilService.getRandomAvatar();
                });

                $scope.filterChats = data.chats;

                $scope.filterChatsByType();
            }

            UtilService.closeLoadingScreen();
        });


        $scope.showSingleChatList = function (chat) {

            $state.go('chatdetail', {chatId: chat.fsr, face: chat.url1, type: chat.leixing});
        };

    })

    .controller('ChatDetailCtrl', function ($timeout, $state, $scope, $stateParams, Chats, UtilService, $rootScope, $ionicHistory, $ionicModal, $ionicScrollDelegate) {

        $scope.chatId = $stateParams.chatId;

        $scope.currentUser = UtilService.getCurrentLoggedInUser().username;

        console.debug($scope.currentUser);

        $scope.face = $stateParams.face;
        $scope.type = $stateParams.type;

        $scope.messages = [];

        $scope.loadMoreChats = function () {

            if (!$scope.noMoreMessage) {
                $scope.loadingMore = true;

                $scope.pageIndex++;
                Chats.loadMessagesFromChat($scope.chatId, $scope.type, $scope.pageIndex);

                $timeout(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                }, 2000);
            } else {
                $scope.$broadcast('scroll.refreshComplete');
            }

        };
        $scope.pageIndex = 1;
        $scope.loadingMore = false;
        $scope.$on('$ionicView.enter', function (e) {
            Chats.loadMessagesFromChat($scope.chatId, $scope.type, 1);

            $scope.noMoreMessage = false;
        });

        $scope.spiner = {message: '下拉加载更多历史消息'};
        $rootScope.$on('chat-list-load-event', function (event, data) {

            if (data.messages && data.messages.length > 0) {

                if ($scope.loadingMore) {
                    angular.forEach(data.messages, function (value, event) {

                        $scope.messages.unshift(value);
                    });

                    $scope.loadingMore = false;

                    $ionicScrollDelegate.scrollTop();
                } else {
                    $scope.messages = data.messages;
                    $ionicScrollDelegate.scrollBottom();

                }

            } else {
                $scope.loadingMore = false;

                $scope.spiner.message = '已无更多历史消息';
                $scope.noMoreMessage = true;
            }

            $scope.$broadcast('scroll.refreshComplete');
            UtilService.closeLoadingScreen();
        });

        $scope.showProcessing = false;
        $scope.singleMessageDetail = {};
        $rootScope.$on('single-approve-message-load-event', function (event, data) {

            if (data.messages) {
                $scope.singleMessageDetail = data.messages;

                console.debug($scope.singleMessageDetail);
            }

            UtilService.closeLoadingScreen();
        });

        $rootScope.$on('approve-message-proccessed-event', function (event, data) {

            UtilService.closeLoadingScreen();

            $scope.modal.hide();

        });

        $scope.goChatsList = function () {

            $ionicHistory.clearHistory();
            //$ionicHistory.clearCache();

            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true,
                historyRoot: true
            });

            $scope.pageIndex = 1;
            $state.go('tab.chats');
        };

        $ionicModal.fromTemplateUrl('templates/modal/aprove-detail.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.currentMessage = {};
        $scope.openModal = function (message) {

            Chats.loadApproveMessageDetails(message);
            $scope.modal.show();

            $ionicScrollDelegate.$getByHandle('messageDetailContent').scrollTop(true);

            $scope.currentMessage = message;
            $scope.comment.content = '';
        };

        $scope.closeMessageDetailDialog = function () {
            $scope.modal.hide();
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {
            $scope.currentPageIndex = 1;
            $scope.options = [];

            $scope.thereisNoMorePages = false;

            $scope.menuShown = true;

            Chats.loadMessagesFromChat($scope.chatId, $scope.type, 1);
        });

        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            // Execute action
        });

        $scope.comment = {
            content: ''
        };

        $scope.approve = function (flag) {

            Chats.approve($scope.currentMessage.id, flag, $scope.comment.content);
        };

        $scope.input = {
            message: ''
        };

        $scope.sendMessage = function () {

            $scope.showProcessing = true;

            Chats.sendMessage($scope.input.message, $scope.chatId);

        };

        $rootScope.$on('message-sent-event', function (event, data) {

            $scope.showProcessing = false;

            var lastMessage = angular.copy($scope.input.message);

            if (lastMessage) {
                var newMessage = {fsr: $scope.currentUser, neirong: lastMessage};
                $scope.messages.push(newMessage);
            }

            $ionicScrollDelegate.scrollBottom();

            $scope.input.message = '';

        });

    })


    .controller('CustomerCtrl', function ($scope, $state, CustomerService, StorageService, $ionicHistory, UtilService, $rootScope) {
        $scope.customers = [];

        $scope.tasks = [];
        $scope.$on('$ionicView.enter', function (e) {

            $scope.tasks = [];

            CustomerService.loadTasks(1, "");

        });

        $rootScope.$on('task-list-load-event', function (event, data) {

            if (data.tasks && data.tasks.length > 0) {

                angular.forEach(data.tasks, function (value, key) {
                    $scope.tasks.unshift(value);
                });

            } else {
                UtilService.showAlert('没有更多数据');
            }

            $scope.$broadcast('scroll.refreshComplete');
            UtilService.closeLoadingScreen();
        });

        $scope.inputValue = {
            keyword: ''
        };

        $scope.currentPageIndex = 1;
        $scope.searchCustomers = function (wantNextPage) {


            if (wantNextPage) {
                $scope.currentPageIndex++;
            } else {
                $scope.currentPageIndex = 1;
                $scope.tasks = [];
            }

            CustomerService.loadTasks($scope.currentPageIndex, $scope.inputValue.keyword);
        };

        $scope.showCustomerDetail = function (task) {

            CustomerService.setLastCustomer(task);

        };

        $scope.createNewTask = function () {
            $state.go('customer-detail');
        };

        $scope.goTaskIndexPage = function () {

            $ionicHistory.clearHistory();

            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true,
                historyRoot: true
            });

            $state.go('tab.outsidework');
        }
    })

    .controller('CustomerDetailController', function ($ionicScrollDelegate, $filter, $state, $scope, CustomerService, $stateParams, $ionicHistory, UtilService, $rootScope, $window, /* Upload, $cordovaCamera,*/ Camera) {

        $scope.flag = {isTempWork: false};
        $scope.currentTask = {};
        $scope.$on('$ionicView.enter', function (e) {

            $scope.currentTask = CustomerService.getLastCustomer();

            if ($scope.currentTask.id) {
                $scope.flag.isTempWork = false;

            } else {

                $scope.flag.isTempWork = true;

                var today = $filter('date')(new Date(), 'yyyy-MM-dd');
                $scope.currentTask.riqi = today;

            }

        });

        $scope.$on('$ionicView.leave', function (e) {

            CustomerService.setLastCustomer({});

        });

        $scope.takePicture = function () {

            var options = {
                quality: 85,
                destinationType: 0,
                sourceType: 1,
                allowEdit: true,
                encodingType: 1, //png
                targetWidth: $window.innerWidth - 32,
                targetHeight: $window.innerHeight - 186,
                saveToPhotoAlbum: false,
                mediaType: 0
            };

            $scope.data = {imageURI: ''};
            Camera.getPicture(options).then(function (imageURI) {

                $scope.data.imageURI = imageURI;

                $scope.taskImageStyle = {
                    'height': ($window.innerHeight - 186) + 'px', 'width': ($window.innerWidth - 32) + 'px',
                    'background-image': 'url(data:image/png;base64,' + imageURI + ')', 'background-size': 'cover',
                    'border-radius': '.5em', 'border': '2px #FFFFFF'
                };

                $ionicScrollDelegate.scrollBottom();

            }, function (err) {
                console.debug('拍照失败 ' + err);
            });

        };

        $scope.itemWidth = $window.innerWidth;

        $scope.goBack = function () {
            $ionicHistory.goBack();
        };

        $rootScope.$on('task-finished-event', function (event, data) {

            UtilService.closeLoadingScreen();

            $ionicHistory.clearHistory();

            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true,
                historyRoot: true
            });

            $state.go('tab.outsidework');


        });

        $scope.additionalTaskInfo = {address: $rootScope.locationAddress, finished: true, comments: ''};

        $scope.submitTask = function () {

            var finished = $scope.additionalTaskInfo.finished ? "1" : "0";

            var imageData = '';
            if ($scope.data && $scope.data.imageURI) {
                imageData = $scope.data.imageURI;
            }

            CustomerService.executeTask(imageData, $scope.currentTask.id, $scope.additionalTaskInfo.address,
                $scope.currentTask.riqi, $scope.currentTask.kehu, $scope.additionalTaskInfo.comments, finished);

        };
    });
