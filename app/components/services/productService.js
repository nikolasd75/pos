'use strict';

angular.module('posApp.services.productService', [])

.factory('productService', function($q) {
  return {
    getList:
    function () {
      return axios.get('/products')
      .then(function (response) {
        return(response.data);
      })
      .catch(function (error) {
        return $q.reject(new Error(error.message));
      });
    }
  }
});
