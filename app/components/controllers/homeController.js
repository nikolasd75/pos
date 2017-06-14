'use strict';

angular.module('posApp.home', ['ngRoute', 'posApp.services.productService', 'posApp.services.orderService'])

// Routing configuration for this module
.config(['$routeProvider',function($routeprovider){
	$routeprovider.when('/', {
		controller: 'HomeController',
		templateUrl: 'components/views/home.html'
	});
}])

.controller('HomeController',  function($scope, $filter, $anchorScroll, productService, orderService, SweetAlert) {

	init();

	//initialise controller
	function init(){
		$scope.layout = 'grid';
		$scope.order = {"products": [], "customer": "", "date": new Date()};
		getProducts();
	};

	//get products from server
	function getProducts() {
 		productService.getList()
	    .then((response) => {
				$scope.$apply(() => {
					$scope.products = response
				})
			})
	    .catch((error) => {
				SweetAlert.swal(error.message, "", "warning");
			});
	};

	//get product by id
	function getProduct(id) {
		for(var i = 0; i < $scope.products.length; i++){
			if($scope.products[i].id === id){
				return $scope.products[i]
			}
		}
	};

	$scope.scrollTo = function(id) {
	  // Pass the 'id' as the parameter here, the page will scroll
	  // to the correct place and the URL will remain intact.
	  $anchorScroll(id);
	}

	//add product in order
	$scope.addItem = (product) => {
		if(product.quantity === 0 ){
			return;
		}

		//check if product already exists in order
		var exists = false;
		for (var i = 0; i < $scope.order.products.length; i++) {
				if ($scope.order.products[i].id === product.id) {

						//if oreder quantity for product equals product stock quantity exit
						if($scope.order.products[i].quantity === product.quantity){
							SweetAlert.swal("No more items in stock", "", "warning");
							return;
						}

						//increase product quantity in order
						$scope.order.products[i].quantity +=1;
						exists = true;
						break;
				}
		}

		//add product in order
		if (!exists){
			$scope.order.products.push({id:product.id, name:product.name, quantity:1, price:product.price});
		}
	};

	//remove product from order
	$scope.removeItem = (product) => {
		var index = $scope.order.products.indexOf(product);
		$scope.order.products.splice(index, 1);
	};

	//increase product quantity in order
	$scope.increaseItemQuantity = (product) => {
		var index = $scope.order.products.indexOf(product);
		var productStockQuantity = getProduct(product.id).quantity;

		//if oreder quantity for product equals product stock quantity exit
		if($scope.order.products[index].quantity === productStockQuantity){
			SweetAlert.swal("No more items in stock", "", "warning");
			return;
		}
		$scope.order.products[index].quantity += 1;
	};

	//decrease product quantity in order
	$scope.decreaseItemQuantity = (product) => {
		var index = $scope.order.products.indexOf(product);

		//if quantity of product equals 1 remove item from basket
		if($scope.order.products[index].quantity > 1)
			$scope.order.products[index].quantity -= 1;
		else
			$scope.order.products.splice(index, 1);
	};

	//calculate order Sum
	$scope.getOrderTotal = () => {
			var total = 0;
			for (var i = 0; i < $scope.order.products.length; i++) {
					total += ($scope.order.products[i].price * $scope.order.products[i].quantity)
			}
			return total;
	};

	//clear current order
	$scope.clearOrder = () => {
		$scope.order = {"products": [], "customer": "", "date": new Date()};
	};

	//submit order
	$scope.submitOrder = () => {
		var dateString = $filter('date')(new Date(), "dd/MM/yyyy");
		var order = {"products": [], "customer": $scope.order.customer, "dateCreated": dateString};

		//fill order products
		for (var i = 0; i < $scope.order.products.length; i++) {
			for (var j = 0; j < $scope.order.products[i].quantity; j++) {
				order.products.push({"id":$scope.order.products[i].id});
			}
		}

		//submit order
		orderService.create(order)
			.then((response) => {
				SweetAlert.swal(response.message, "", "success");
			})
			.catch((error) => {
				SweetAlert.swal(error.message, "", "warning");
			});

	};

})

//Product search filter
.filter('searchProducts', function(){
    return function(arr, searchString){

        if(!searchString){
            return arr;
        }

        var result = [];
        angular.forEach(arr, (item) => {
        	if(item.name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1){
          	result.push(item);
          	}
        });
        return result;
    };
});
