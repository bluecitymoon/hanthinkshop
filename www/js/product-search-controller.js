angular.module('starter.searchcontrollers', [])

    .controller('SearchProductCtrl', function ($scope, $state, $ionicHistory) {

        $scope.keywordHistoryList = [];

        $scope.gotoProductsPage = function (keyword) {

            $state.go('product-list', {keyword: keyword});

        };

        $scope.search = {keyword: ''};

        $scope.searchProducts = function () {

            if ($scope.search.keyword) {
                $state.go('product-list', {keyword: $scope.search.keyword});
            }

        };

        $scope.GoBack = function () {
            $ionicHistory.goBack();
        };

        $scope.gotoCatelogTab = function () {
            $state.go('tab.cart');
        };
    });
