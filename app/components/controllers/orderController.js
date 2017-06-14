'use strict';

angular.module('posApp.order', ['ngRoute', 'posApp.services.orderService'])

// Routing configuration for this module
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/order', {
    templateUrl: 'components/views/order.html',
    controller: 'OrderController'
  });
}])

.controller('OrderController',  function($scope, orderService, SweetAlert) {

  //initialise controller
  function init(){
    $scope.orders = [];
    $scope.statusOptions = ['PENDING','COMPLETED','CANCELED'];
    $scope.pager = {page:'0', pageSize:'10', total:'0' };
    $scope.selectedOrder = null;
    $scope.getOrders(1);
  };

  //set pager properties
  var setPager = (data) => {
    $scope.pager.page = data.number + 1;
    $scope.pager.pageSize = data.size;
    $scope.pager.total = data.totalElements;
  };

  //get orders from server
  $scope.getOrders = (page) => {
    orderService.getList($scope.pager.pageSize, page - 1)
      .then((response) => {
        $scope.$apply(() => {
          $scope.orders = response.content;
          setPager(response);
        })
      })
      .catch((error) => {
        SweetAlert.swal(error.message, "", "warning");
      });
  };

  //show remove order confirmation dialog
  $scope.removeOrderConfirm = (order) => {
    SweetAlert.swal({
      title: "Are you sure?",
      text: "Your will not be able to recover this order!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No,",
      closeOnConfirm: false,
      closeOnCancel: true },
      function(isConfirm){
        if (isConfirm) {
          removeOrder(order);
        }
      });
  };

  //remove order
  var removeOrder = (order) => {
    orderService.delete(order.id)
    .then((response) => {
      $scope.$apply(() => {
        var index = $scope.orders.indexOf(order);
        $scope.orders.splice(index, 1);
        if($scope.orders.length == 0 && $scope.pager.page > 1){
          $scope.getOrders($scope.pager.page - 1);
        }
        SweetAlert.swal(response.message, "", "success");
      })
    })
    .catch((error) => {
      SweetAlert.swal(error.message, "", "warning");
    });
  };

  //update order status
  $scope.updateOrder = (order, currentStatus) => {
    orderService.update(order.id, order.status)
      .then((response) => {
          SweetAlert.swal(response.message, "", "success");
      })
      .catch((error) => {
        $scope.$apply(() => {
          order.status = currentStatus;
          SweetAlert.swal(error.message, "", "warning");
        })
      });
  };

  //switch to order details view
  $scope.openOrderDetails = (order) => {
    $scope.selectedOrder = order;
  };

  //exit order details view
  $scope.closeOrderDetails = () => {
    $scope.selectedOrder = null;
  };

  init();

});
