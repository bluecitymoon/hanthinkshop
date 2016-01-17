angular.module('starter.services', [])

  .factory('Camera', ['$q', function($q) {

    return {
      getPicture: function(options) {
        var q = $q.defer();

        navigator.camera.getPicture(function(result) {
          // Do any magic you need
          q.resolve(result);
        }, function(err) {
          q.reject(err);
        }, options);

        return q.promise;
      }
    }
  }])

  .factory('Location', ['$q', function($q) {

    return {
      getLocation: function() {
        var q = $q.defer();

        navigator.geolocation.getCurrentPosition(function(position) {
          q.resolve(position);
        }, function(error) {
          q.reject(error);
        });

        return q.promise;
      }
    }
  }])

    .factory('AuthenticationService', function ($http, HanthinkApiAddress, $rootScope, UtilService, StorageService) {

        function getToken(user) {
            console.debug(user);
            $http({
                url: ServerRoot + 'jsyanzheng/yz',
                data: {username: user.username, password: user.password},
                method: 'POST'
            }).success(function (response, status, headers, config) {

                $rootScope.$emit('login-event', {response: response});

            }).error(function (response, status, headers, config) {

                response.code = "500";
                if (!response.message) {

                    response.message = "服务器发生了错误。";
                }
                console.debug(response);

            });

        }

        function getUserIpInformation(user, callback) {

          $http({
            url: HanthinkApiAddress + 'jsyanzheng/bangding',
            data: {bangdingma: user.code},
            method: 'POST'
          }).success(function (response, status, headers, config) {

            StorageService.setObject('customer_info', {ip: response, code: user.code});
            ServerRoot = response;

            if (response && callback) {
              callback();
            }

            //$rootScope.$emit('user-server-ip-loaded-event', {ip: response});

          }).error(function (response, status, headers, config) {

            UtilService.showAlert("服务器在鉴定你的公司代码时出错，可能是<b class='assertive'>无效的</b>公司代码");

            UtilService.closeLoadingScreen();

          });
        }

        return {
            getToken: getToken,
            getUserIpInformation: getUserIpInformation
        }
    })

    .factory('DataService', function ($http,  $rootScope, UtilService) {

        var userData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token};

        function getTypes() {

            UtilService.showLoadingScreen();
            $http({
                url: ServerRoot + 'danju/getdanju',
                data: userData,
                method: 'POST'
            }).success(function (response, status, headers, config) {


                if (response.code) {
                    UtilService.showAlert(response.message);
                } else {
                    $rootScope.$emit('data-type-load-event', {types: response});
                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });

        }

        function loadDataSearchConditions(datatypeid) {
            UtilService.showLoadingScreen();

            $http({
                url: ServerRoot + 'danju/getdanjugeshi',
                data: {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, id: datatypeid},
                method: 'POST'
            }).success(function (response, status, headers, config) {

                console.debug(response);

                if (response.code) {

                    UtilService.closeLoadingScreen();

                    UtilService.showAlert(response.message);

                } else {
                    $rootScope.$emit('search-data-conditions-load-event', {conditions: response});

                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });
        }

        var currentDataType = '';

        function setCurrentDataType(type) {
            currentDataType = type;
        }

        function getCurrentDataType() {
            return currentDataType;
        }

        function loadDataAutocompleteOptions(id) {

            UtilService.showLoadingScreen();
            //var copiedUserData = userData;
            //copiedUserData.cankaodangan = cankaodangan;
            $http({
                url: ServerRoot + 'canzhaoshuju/getzhubiaoshuju',
                data: {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, id: id},
                method: 'POST'
            }).success(function (response, status, headers, config) {

                console.debug(response);

                if (response.code) {

                    UtilService.closeLoadingScreen();

                    UtilService.showAlert(response.message);

                } else {
                    $rootScope.$emit('search-data-options-load-event', {options: response});
                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });
        }

        function saveData(primaryTableData, secondaryTableData, successCallback) {
            UtilService.showLoadingScreen();

            var primaryParam = [];
            angular.forEach(primaryTableData, function(value, i) {

                if (value.morenzhi) {
                    var o = {id: value.id, morenzhi: value.morenzhi};
                    primaryParam.push(o);
                }

            });

            var secondaryParam = [];
            angular.forEach(secondaryTableData, function(value, i) {

                var singleSecondary = [];
                angular.forEach(value, function(single, j) {

                    if (single.morenzhi) {
                        var o = {id: single.id, morenzhi: single.morenzhi};
                        singleSecondary.push(o);
                    }
                });

                if (singleSecondary.length > 0) {
                    secondaryParam.push(singleSecondary);
                }
            });

            var postData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, zhubiao: JSON.stringify(primaryParam), zibiao: JSON.stringify(secondaryParam)};

            console.debug(postData);

            $http({
                url: ServerRoot + 'danju/adddanju',
                data: postData,
                method: 'POST'
            }).success(function (response, status, headers, config) {

                console.debug(response);

                if (response.code) {

                    UtilService.closeLoadingScreen();

                    UtilService.showAlert(response.message);

                } else {

                    if(successCallback) {
                        successCallback();
                    }
                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });
        }

    function loadFinalOptionResultWithCategory(conditionId, optionId, keyword, pageNumber, clientType) {
      UtilService.showLoadingScreen();

      var url = ServerRoot + 'canzhaoshuju/getshujulbfy';
      if (clientType && clientType == 'child') {
        url = ServerRoot + 'canzhaoshuju/getshujulbfy';
      }
      $http({
        url: url,
        data: {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, id: conditionId, leibieid: optionId, guanjianzi: keyword, yeshu: pageNumber},
        method: 'POST'
      }).success(function (response, status, headers, config) {

        if (response.code) {

          UtilService.closeLoadingScreen();

          UtilService.showAlert(response.message);

        } else {
          $rootScope.$emit('search-option-detail-load-event', {detailOptions: response});
        }

      }).error(function (response, status, headers, config) {
        UtilService.handleCommonServerError(response, status);
      });
    };
        return {
            getTypes: getTypes,
            loadDataSearchConditions: loadDataSearchConditions,
            setCurrentDataType: setCurrentDataType,
            getCurrentDataType: getCurrentDataType,
            loadDataAutocompleteOptions: loadDataAutocompleteOptions,
          loadFinalOptionResultWithCategory: loadFinalOptionResultWithCategory,
            saveData: saveData
        }
    })

    .factory('ReportService', function ($http,  $rootScope, UtilService) {

        var userData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token};

        function getTypes() {
            UtilService.showLoadingScreen();
            $http({
                url: ServerRoot + 'report/getreport',
                data: userData,
                method: 'POST'
            }).success(function (response, status, headers, config) {


                if (response.code) {
                    UtilService.showAlert(response.message);
                } else {
                    $rootScope.$emit('report-type-load-event', {types: response});
                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });

        }

        function loadReportSearchConditions(reportid) {
            UtilService.showLoadingScreen();

            $http({
                url: ServerRoot + 'report/getreporttj',
                data: {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, bbid: reportid},
                method: 'POST'
            }).success(function (response, status, headers, config) {

                console.debug(response);

                if (response.code) {

                    UtilService.closeLoadingScreen();

                    UtilService.showAlert(response.message);

                } else {
                    $rootScope.$emit('search-report-conditions-load-event', {conditions: response});

                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });
        }

        //canzhaoshuju/getshuju

        function loadReportAutocompleteOptions(id, type) {
            UtilService.showLoadingScreen();
            //var copiedUserData = userData;
            //copiedUserData.cankaodangan = cankaodangan;
            $http({
                url: ServerRoot + 'canzhaoshuju/getshuju',
                data: {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, id: id, shujuleixing: type},
                method: 'POST'
            }).success(function (response, status, headers, config) {

                console.debug(response);

                if (response.code) {

                    UtilService.closeLoadingScreen();

                    UtilService.showAlert(response.message);

                } else {
                    $rootScope.$emit('search-report-options-load-event', {options: response});
                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });
        }

        function loadFinalOptionResultWithCategory(conditionId, optionId, keyword, pageNumber, type, referenceParentValue) {
            UtilService.showLoadingScreen();

            var queryData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token,
              id: conditionId, leibieid: optionId, guanjianzi: keyword, yeshu: pageNumber, shujuleixing: type, zhubiaocanshu: referenceParentValue};
            console.debug(JSON.stringify(queryData));

            //getshujulbfy
            $http({
                url: ServerRoot + 'canzhaoshuju/getleibiecx',
                data: queryData,
                method: 'POST'
            }).success(function (response, status, headers, config) {

                if (response.code) {

                    UtilService.closeLoadingScreen();

                    UtilService.showAlert(response.message);

                } else {
                    $rootScope.$emit('search-option-detail-load-event', {detailOptions: response});
                  console.debug(response);
                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });
        };

        function searchOptionsWithKeyword(keyword, id, page, type) {
            UtilService.showLoadingScreen();

            var pageNumber = 1;
            if (page) {
                pageNumber = page;
            }
            var queryData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, id: id, guanjianzi: keyword, yeshu: pageNumber, shujuleixing: type};
            console.debug(JSON.stringify(queryData));

	        var url = 'canzhaoshuju/getmohucx';
	        //if ( type) {
		      //   url = 'canzhaoshuju/getzhubiaoshujulbfy';
	        //}

            $http({
                url: ServerRoot + url,
                data: queryData,
                method: 'POST'
            }).success(function (response, status, headers, config) {

                console.debug(response);

                if (response.code) {

                    UtilService.closeLoadingScreen();

                    UtilService.showAlert(response.message);

                } else {
                    $rootScope.$emit('search-report-options-load-event', {options: response});
                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });
        };

        function queryReport(conditions, pageNumber) {
            UtilService.showLoadingScreen();
            var conditionData = [];

            angular.forEach(conditions, function(value, key) {

                if(value.moren1 || value.moren2) {
                    var singleCondition = {id: value.id, moren1: value.moren1, moren2: value.moren2};
                    conditionData.push(singleCondition);
                }
            });

            var conditionDataJSONstring = JSON.stringify(conditionData).replace(/"/g, '\'');
            var queryData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, yeshu: pageNumber, tiaojian: conditionDataJSONstring};

            $http({
                url: ServerRoot + 'report/getreportdata',
                data: queryData,
                method: 'POST'
            }).success(function (response, status, headers, config) {

                console.debug(response);

                if (response.code) {

                    UtilService.closeLoadingScreen();

                    UtilService.showAlert(response.message);

                } else {
                    $rootScope.$emit('search-report-load-event', {reports: response});
                }

            }).error(function (response, status, headers, config) {

                UtilService.handleCommonServerError(response, status);

            });
        };

        var lastSearchCondition = {};
        function setLastSearchCondition(searchCondition) {

            lastSearchCondition = searchCondition;
        }

        function getLastSearchCondition() {

            return lastSearchCondition;
        }

        var lastSelectedCondition = {};
        function getCurrentSelectedCondition() {
            return lastSelectedCondition;
        }

        function setCurrentSelectedCondition(condition) {
            lastSelectedCondition = condition;
        }

        return {
            getTypes: getTypes,
            loadReportSearchConditions: loadReportSearchConditions,
            loadReportAutocompleteOptions: loadReportAutocompleteOptions,
            loadFinalOptionResultWithCategory: loadFinalOptionResultWithCategory,
            searchOptionsWithKeyword: searchOptionsWithKeyword,
            queryReport: queryReport,
            setLastSearchCondition: setLastSearchCondition,
            getLastSearchCondition: getLastSearchCondition,
            setCurrentSelectedCondition: setCurrentSelectedCondition,
            getCurrentSelectedCondition: getCurrentSelectedCondition
        }
    })

    .
    factory('UtilService', function ($ionicLoading, $ionicPopup, StorageService) {

        var currentUser = null;
        function getCurrentLoggedInUser() {
            if (currentUser) {
                return currentUser;
            } else {
                currentUser = StorageService.getObject("currentuser");

                return currentUser;
            }
        }

        function setCurrentLoggedInUser(user) {
          currentUser = user;
        }

        function showLoadingScreen(message) {

            var msg = '正在载入';
            if (message) {
                msg = message;
            }
            $ionicLoading.show({
                template: '<ion-spinner icon=\"lines\" class=\"spinner-balanced\"></ion-spinner> '
            });
        }

        function closeLoadingScreen() {
            $ionicLoading.hide();
        }

        function showAlert(message, callback) {

            $ionicPopup.alert({
                title: '提示信息',
                template: '<h5 style="text-align: center"> ' + message + '</h5>',
                okText: '确定',
                okType: 'button button-block button-positive'
            }).then(function () {
              if (callback) {
                callback();
              }

            });

        }

        function handleCommonServerError(response, statusCode) {

            closeLoadingScreen();

            if (response) {
                showAlert(response);
            } else {
                showAlert("没有网络连接，请检查网络");
            }
        }

        var icons = ['ion-ios-list-outline', 'ion-ios-book', 'ion-ios-compose-outline', 'ion-ios-paper-outline', 'ion-ios-calendar-outline', 'ion-ios-albums-outline',
        'ion-ios-briefcase-outline', 'ion-android-calendar', 'ion-android-cloud-outline', 'ion-bag'];
        function getIconByIndex(index) {

            if (index > icons.length) {
                return 'ion-ios-list-outline';
            }
            return icons[index];
        }

        var colors = ['positive', 'balanced', 'assertive', 'royal'];
        function getRandomColorName() {

            var index = Math.floor((Math.random() * 10) / 3) ;

            return colors[index];
        }

        function getRandomAvatar() {
            var index = Math.floor(Math.random() * 8);

            return 'img/' + index + '.jpg';
        }

        return {
            showLoadingScreen: showLoadingScreen,
            closeLoadingScreen: closeLoadingScreen,
            showAlert: showAlert,
            handleCommonServerError : handleCommonServerError,
            getIconByIndex: getIconByIndex,
            getRandomColorName: getRandomColorName,
            getCurrentLoggedInUser: getCurrentLoggedInUser,
            getRandomAvatar: getRandomAvatar,
            setCurrentLoggedInUser: setCurrentLoggedInUser
        }
    })

    .factory('StorageService', function ($window) {

        return {
            get: function (key) {

                var value = '';
                try {
                    value = $window.localStorage[key];
                } catch (e) {
                }

                return value;
            },
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            },
            getArray: function (key) {
                return JSON.parse($window.localStorage[key] || '[]');
            }
        };
    })

    .factory('Chats', function (UtilService,  $rootScope, $http) {

        function loadAllMyChats(page) {

            UtilService.showLoadingScreen();

            var queryData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, yeshu: page};
            console.debug(JSON.stringify(queryData));

            $http({
                url: ServerRoot + 'xiaoxi/getxiaoxizhubiao',
                data: {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token},
                method: 'POST'
            }).success(function (response, status, headers, config) {

                if (response.code) {

                    UtilService.closeLoadingScreen();

                    UtilService.showAlert(response.message);

                } else {
                    $rootScope.$emit('all-my-chats-load-event', {chats: response});
                    console.debug(response);
                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });
        }

        function loadMessagesFromChat(chatId, type, pageNumber) {

            UtilService.showLoadingScreen();

            var queryData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, fasongren: chatId, yeshu: pageNumber, leixing: type};
            console.debug(JSON.stringify(queryData));

            $http({
                url: ServerRoot + 'xiaoxi/getxiaoxi',
                data: queryData,
                method: 'POST'
            }).success(function (response, status, headers, config) {

                if (response.code) {

                    UtilService.closeLoadingScreen();

                    UtilService.showAlert(response.message);

                } else {
                    $rootScope.$emit('chat-list-load-event', {messages: response});
                    console.debug(response);
                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });
        }

        function loadApproveMessageDetails(message) {

            UtilService.showLoadingScreen();

            var queryData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, xiaoxiid: message.id};
            console.debug(JSON.stringify(queryData));

            $http({
                url: ServerRoot + 'xiaoxi/shenpixinxi',
                data: queryData,
                method: 'POST'
            }).success(function (response, status, headers, config) {

                if (response.code) {

                    UtilService.closeLoadingScreen();

                } else {
                    $rootScope.$emit('single-approve-message-load-event', {messages: response});

                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });
        }

        function approve(id, flag, content) {

            UtilService.showLoadingScreen();

            var queryData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, xiaoxiid: id, jiegou : flag, fujiaxinxi : content};
            console.debug(JSON.stringify(queryData));

            $http({
                url: ServerRoot + 'xiaoxi/shenpichuli',
                data: queryData,
                method: 'POST'
            }).success(function (response, status, headers, config) {

                if (response.code) {

                    UtilService.closeLoadingScreen();

                    UtilService.showAlert(response.message);

                } else {

                    UtilService.showAlert('操作成功');
                    $rootScope.$emit('approve-message-proccessed-event', {result: response});
                    console.debug(response);
                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });
        }

        function sendMessage(content, target) {

          var queryData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, lianxiren: target, neirong : content};
          console.debug(JSON.stringify(queryData));

          $http({
            url: ServerRoot + 'xiaoxi/addxiaoxi',
            data: queryData,
            method: 'POST'
          }).success(function (response, status, headers, config) {

            if (response.code) {

              UtilService.closeLoadingScreen();

              UtilService.showAlert(response.message);

            } else {
              $rootScope.$emit('message-sent-event', {result: response});

            }

          }).error(function (response, status, headers, config) {
            UtilService.handleCommonServerError(response, status);
          });
        }

        return {

            loadAllMyChats : loadAllMyChats,
            loadMessagesFromChat : loadMessagesFromChat,
            loadApproveMessageDetails : loadApproveMessageDetails,
            approve : approve,
            sendMessage : sendMessage

        };
    })

    .factory('CustomerService', function ($http, UtilService, $rootScope, $filter, StorageService) {

        var lastCustomer = {};
        return {

          submitFeedback: function(feedback) {

            var code = StorageService.getObject("customer_info").code;
            UtilService.showLoadingScreen();

            var queryData = {username: UtilService.getCurrentLoggedInUser().username, kehuma: code, neirong: feedback.comments};

            console.debug(JSON.stringify(queryData));

            $http({
              url: ServerRoot + 'jsyanzheng/yijianfankun',
              data: queryData,
              method: 'POST'
            }).success(function (response, status, headers, config) {

              if (response.code) {

                UtilService.closeLoadingScreen();

                UtilService.showAlert(response.message);

              } else {
                $rootScope.$emit('feedback-uploaded-event', {tasks: response});
                console.debug(response);
              }

            }).error(function (response, status, headers, config) {
              UtilService.handleCommonServerError(response, status);
            });

          },

          submitBroadcast: function(broadcast) {

            UtilService.showLoadingScreen();

            var queryData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, neirong: broadcast.comments};

            console.debug(JSON.stringify(queryData));

            $http({
              url: ServerRoot + 'xiaoxi/addgonggao',
              data: queryData,
              method: 'POST'
            }).success(function (response, status, headers, config) {

              if (response.code) {

                UtilService.closeLoadingScreen();

                UtilService.showAlert(response.message);

              } else {
                $rootScope.$emit('broadcast-uploaded-event', {message: response});
                console.debug(response);
              }

            }).error(function (response, status, headers, config) {
              UtilService.handleCommonServerError(response, status);
            });

          },

          uploadUserAvatar: function(imageData) {

            UtilService.showLoadingScreen('上传中');

            var queryData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, touxiang: imageData};

            console.debug(JSON.stringify(queryData));

            $http({
              url: ServerRoot + 'xiaoxi/settouxiang',
              data: queryData,
              method: 'POST'
            }).success(function (response, status, headers, config) {

              if (response.code) {

                UtilService.closeLoadingScreen();

                UtilService.showAlert(response.message);

              } else {
                $rootScope.$emit('user-avatar-uploaded-event', {avatar: response});
                console.debug(response);
              }

            }).error(function (response, status, headers, config) {
              UtilService.handleCommonServerError(response, status);
            });

          },

          loadTasks: function(page, customerNameKeyword) {

              UtilService.showLoadingScreen();
             // {"username":"admin","token":"0DPiKuNIrrVmD8IUCuw1hQxNqZc=","yeshu":1,"danwei":"沃"}
              var queryData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, danwei: customerNameKeyword, yeshu: page};
              console.debug(JSON.stringify(queryData));

              $http({
                url: ServerRoot + 'waiqin/getrenwu',
                data: queryData,
                method: 'POST'
              }).success(function (response, status, headers, config) {

                if (response.code) {

                  UtilService.closeLoadingScreen();

                  UtilService.showAlert(response.message);

                } else {
                  $rootScope.$emit('task-list-load-event', {tasks: response});
                  console.debug(response);
                }

              }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
              });

            },

          loadJobUsers: function() {

            UtilService.showLoadingScreen();

            var queryData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token};
            console.debug(JSON.stringify(queryData));

            $http({
              url: ServerRoot + 'waiqin/getjihuayonghu',
              data: queryData,
              method: 'POST'
            }).success(function (response, status, headers, config) {

              if (response.code) {

                UtilService.closeLoadingScreen();

                UtilService.showAlert(response.message);

              } else {
                $rootScope.$emit('job-users-load-event', {users: response});
                console.debug(response);
              }

            }).error(function (response, status, headers, config) {
              UtilService.handleCommonServerError(response, status);
            });

          },


          //waiqin/ addkehu(string username, string token,string jiancheng,string quancheng,string dizhi,string dianhua,string lianxiren,string jd,string wd)。采集客户gps信息。
          createNewCustomer: function(customer) {

            UtilService.showLoadingScreen();

            var queryData = {
              username: UtilService.getCurrentLoggedInUser().username,
              token: UtilService.getCurrentLoggedInUser().token,
              jd: "" + customer.lng,
              wd: "" + customer.lat,
              dizhi: customer.address,
              jiancheng: customer.shortName,
              quancheng: customer.fullName,
              dianhua: customer.phoneNumber,
              lianxiren: customer.contactor
            };

            $http({
              url: ServerRoot + 'waiqin/addkehu',
              data: queryData,
              method: 'POST'
            }).success(function (response, status, headers, config) {

              if (response.code) {

                UtilService.closeLoadingScreen();

                UtilService.showAlert(response.message);

              } else {

                $rootScope.$emit('new_customer_saved');

              }

            }).error(function (response, status, headers, config) {
              UtilService.handleCommonServerError(response, status);
            });
          },


          createNewTask: function(task) {
            UtilService.showLoadingScreen();

            var customerData = [];
            angular.forEach(task.customers, function(value, i) {
              customerData.push({kehu: value.kehu});
            });

            var vistDateFullString = $filter('date')(task.visitDate, 'yyyy-MM-dd');

            var queryData = {
              username: UtilService.getCurrentLoggedInUser().username,
              token: UtilService.getCurrentLoggedInUser().token,
              riqi: vistDateFullString,
              danweizhu: JSON.stringify(customerData),
              yonghu: task.user,
              leixing: task.type,
              neirong: task.content

            };

            console.debug(JSON.stringify(queryData));

            $http({
              url: ServerRoot + 'waiqin/renwuzhiding',
              data: queryData,
              method: 'POST'
            }).success(function (response, status, headers, config) {

              if (response.code) {

                UtilService.closeLoadingScreen();

                UtilService.showAlert(response.message);

              } else {

                $rootScope.$emit('new_task_created');

              }

            }).error(function (response, status, headers, config) {
              UtilService.handleCommonServerError(response, status);
            });
          },
          //qiandao(string username, string token, string jd, string wd,string dizhi ,string leixing)
          userWorkSign: function(position, type, address) {

            UtilService.showLoadingScreen();

            var queryData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, jd: "" + position.lng, wd: "" + position.lat, dizhi: address, leixing: type};
            console.debug(JSON.stringify(queryData));

            $http({
              url: ServerRoot + 'waiqin/qiandao',
              data: queryData,
              method: 'POST'
            }).success(function (response, status, headers, config) {

              if (response.code) {

                UtilService.closeLoadingScreen();

                UtilService.showAlert(response.message);

              } else {
                UtilService.closeLoadingScreen();

                UtilService.showAlert('操作成功！');
                console.debug(response);
              }

            }).error(function (response, status, headers, config) {
              UtilService.handleCommonServerError(response, status);
            });

          },

            setLastCustomer : function(customer) {
              lastCustomer = customer;
            },

            getLastCustomer : function () {
              return lastCustomer;
            },

          //waiqin/ waiqinzhixing(string username, string token, string fujian, string jd, string wd, string dizhi, string riqi, string danweimingcheng, string beizhu,string renwuid,string wc).
            executeTask: function(url, taskId, lng, lat, address, createDate, companyName, comments, finished) {

              if (!taskId) {
                taskId = -1;
              }
              UtilService.showLoadingScreen();

              var queryData = {
                username: UtilService.getCurrentLoggedInUser().username,
                token: UtilService.getCurrentLoggedInUser().token,
                fujian: url,
                jd: lng,
                wd: lat,
                dizhi: address,
                riqi: createDate,
                danweimingcheng: companyName,
                beizhu: comments,
                renwuid: taskId,
                wc: finished
              };
              console.debug(JSON.stringify(queryData));

              $http({
                url: ServerRoot + 'waiqin/waiqinzhixing',
                data: queryData,
                method: 'POST'
              }).success(function (response, status, headers, config) {

                if (response) {

                  UtilService.closeLoadingScreen();
                  UtilService.showAlert(response);

                } else {

                  UtilService.showAlert("操作成功");
                  $rootScope.$emit('task-finished-event', {result: response});

                }

              }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
              });
            }
        }
    });
