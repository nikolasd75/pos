'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'bw.paging',
  'oitozero.ngSweetAlert',
  'posApp.order',
  'posApp.home'
])

// Routing configuration for this module
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  //$locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/'});
}]);
