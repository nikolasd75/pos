'use strict';

angular.module('posApp.services.orderService', [])

.factory('orderService', function($q) {
  return {
    getList: function (size, page) {
      return axios.get('/orders?size=' + size + '&page=' + page )
      .then(function (response) {
        return(response.data);
      })
      .catch(function (error) {
        return $q.reject(new Error(error.message));
      });
    },
    create: function (order) {
      return axios.post('/orders/', order)
      .then(function (response) {
        return(response.data);
      })
      .catch(function (error) {
        if(error.response){
          return $q.reject(new Error(error.response.data.message));
        }
        else {
          return $q.reject(new Error(error.message));
        }
      });
    },
    update: function (id, status) {
      return axios.put('/orders/' + id + '/' + status)
      .then(function (response) {
        return(response.data);
      })
      .catch(function (error) {
        if(error.response){
          return $q.reject(new Error(error.response.data.message));
        }
        else {
          return $q.reject(new Error(error.message));
        }
      });
    },
    delete: function (id) {
      return axios.delete('/orders/' + id)
      .then(function (response) {
        return(response.data);
      })
      .catch(function (error) {
        if(error.response){
          return $q.reject(new Error(error.response.data.message));
        }
        else {
          return $q.reject(new Error(error.message));
        }
      });
    }
  }
});
