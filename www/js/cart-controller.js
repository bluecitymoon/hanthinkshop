angular.module('starter.cart-controller', [])

    .controller('ShopCartCtrl', function ($scope, $state, $window, $stateParams, $ionicHistory) {

        $scope.products = [
            {count : 20, price: 288, name : '美莱香 2015秋冬新款韩版加棉毛呢大衣女外套修身中长款羊毛呢子大衣加厚女装MW888 枣红色加棉 M', image : 'http://m.360buyimg.com/n8/jfs/t2557/184/1007246708/390166/530a5510/56800659N30321307.jpg!q70.jpg'},
            {count : 1, price: 2288, name : '杭之吻毛呢外套女中长款加厚修身型呢子大衣女冬装显瘦韩范版毛领新款潮 1051皮粉色(带真毛领) M加棉加厚', image : 'http://m.360buyimg.com/n8/jfs/t2290/267/1197246933/268424/462ad641/5681f45eNfb43facc.jpg!q70.jpg'},
            {count : 1, price: 1288, name : '衣锦霓裳 2015秋冬装新款毛呢大衣女中长款韩版外套 酒红色 M', image : 'http://m.360buyimg.com/n8/jfs/t2476/70/1022892578/288502/2e31b6e5/563dd658N04dc0daa.jpg'},
        ];


        $scope.showProductDetail = function(product) {

            $state.go('product-detail', {productid : product.id});

        };

        $scope.productWidth = parseInt(($window.innerWidth - 30) / 2);

        $scope.GoBack = function() {
            $ionicHistory.goBack();
        };

    });
