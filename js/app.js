angular.module('MyApp', ['ngRoute'])
  .controller('HomeController', ['$scope', '$http', function ($scope, $http) {
    $http.get('http://g12-lisa-carlson-memories.cfapps.io/api/v1/memories').then(function(response){
      $scope.memories = response.data;
      console.log($scope.memories)
    });
  }])
  .controller('YearController', ['$scope', '$http', function ($scope, $http) {
    
  }])
  .config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/partials/home.html',
        controller: 'HomeController'
      })
      .when('/years', {
        templateUrl: '/partials/year.html',
        controller: 'YearController'
      })
      .when('/page-not-found', {
        templateUrl: '/partials/error.html'
      })
      .otherwise({
        redirectTo: '/page-not-found'
      });
    $locationProvider.html5Mode(true);
  }])