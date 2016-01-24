angular.module('starter.product-controller', [])

    .controller('ProductListCtrl', function ($scope, $state, $window, $stateParams, $ionicHistory, $timeout) {

        console.debug('category id = ' + $stateParams.categoryid);

        console.debug('keyword = ' + $stateParams.keyword);


        $scope.products = [
            {
                count: 1,
                price: 288,
                name: '美莱香 2015秋冬新款韩版加棉毛呢大衣女外套修身中长款羊毛呢子大衣加厚女装MW888 枣红色加棉 M',
                image: 'http://m.360buyimg.com/n8/jfs/t2557/184/1007246708/390166/530a5510/56800659N30321307.jpg!q70.jpg'
            },
            {
                count: 1,
                price: 2288,
                name: '杭之吻毛呢外套女中长款加厚修身型呢子大衣女冬装显瘦韩款潮 1051皮粉色(带真毛领) M加棉加厚',
                image: 'http://m.360buyimg.com/n8/jfs/t2290/267/1197246933/268424/462ad641/5681f45eNfb43facc.jpg!q70.jpg'
            },
            {
                count: 1,
                price: 1288,
                name: '衣锦霓裳 2015秋冬装新款毛呢大衣女中长款韩版外套 酒红色 M',
                image: 'http://m.360buyimg.com/n8/jfs/t2476/70/1022892578/288502/2e31b6e5/563dd658N04dc0daa.jpg'
            }
        ];

        $scope.addToShopCart = function (product) {

            $scope.addingToCart = true;
            console.debug(product);

            $timeout(function() {
                $scope.addingToCart = false;
            }, 1000);
        };

        $scope.showProductDetail = function (product) {

            $state.go('product-detail', {productid: product.id});

        };


        $scope.productWidth = parseInt(($window.innerWidth - 30) / 2);

        $scope.GoBack = function () {
            $ionicHistory.goBack();
        };

        $scope.gotoCatelogTab = function () {
            $state.go('tab.cart');
        };

        $scope.openSearchHistoryModal = function () {
            $state.go('search-product');
        };

    })
    .controller('ProductDetailCtrl', function ($scope, $state, $window, $stateParams, $ionicHistory, $timeout) {

        $scope.showParameters = false;

        $scope.showProductDetailByTitle = function (index) {

            $scope.showParameters = (index == 1);

        };

        $scope.product = {
            count: 1,
            name: '澳贝琳 2015秋冬新款韩版修身显瘦中长款毛呢大衣女外套  8615  灰色 L', price: 129.00,
            images: ['http://m.360buyimg.com/n12/jfs/t1954/338/703590005/426226/6ab99248/5621c2e6N08479ba5.jpg!q70.jpg', 'http://m.360buyimg.com/n12/jfs/t2353/29/683076903/303431/25d9b788/5621c2ecN37798741.jpg!q70.jpg', 'http://m.360buyimg.com/n12/jfs/t1963/350/653155165/320351/401f7109/5621c2edNe25f9a79.jpg!q70.jpg',
                'http://m.360buyimg.com/n12/jfs/t1888/359/691025492/437244/7f9e7bc/5621c2eeN9e909e7d.jpg!q70.jpg', 'http://m.360buyimg.com/n12/jfs/t2224/365/700253363/482764/f61a977f/5621c2efN601d8b10.jpg!q70.jpg'],
            detailImages: ['http://m.360buyimg.com/n12/jfs/t1954/338/703590005/426226/6ab99248/5621c2e6N08479ba5.jpg!q70.jpg', 'http://m.360buyimg.com/n12/jfs/t2353/29/683076903/303431/25d9b788/5621c2ecN37798741.jpg!q70.jpg', 'http://m.360buyimg.com/n12/jfs/t1963/350/653155165/320351/401f7109/5621c2edNe25f9a79.jpg!q70.jpg',
                'http://m.360buyimg.com/n12/jfs/t1888/359/691025492/437244/7f9e7bc/5621c2eeN9e909e7d.jpg!q70.jpg', 'http://m.360buyimg.com/n12/jfs/t2224/365/700253363/482764/f61a977f/5621c2efN601d8b10.jpg!q70.jpg']
        };

        $scope.GoBack = function () {
            $ionicHistory.goBack();
        };

        //flags
        $scope.loading = false;

        $scope.screenWidth = $window.innerWidth;

        $scope.gotoCatelogTab = function () {
            $state.go('tab.cart');
        };

        $scope.buyNow = function () {
            $state.go('new-order');
        };

        $scope.addToShopCart = function (product) {

            $scope.addingToCart = true;
            console.debug(product);

            $timeout(function() {
                $scope.addingToCart = false;
            }, 3000);
        };

    }).controller('PayResultCtrl', function ($scope, $state) {


        $scope.goHome = function () {
            $state.go('tab.home');
        }

    });
