angular.module('MyApp', ['ngRoute'])
  .controller('HomeController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.memories = [];
    //get request to service registry which returns cors issue
    $http.get('http://galvanize-service-registry.cfapps.io/api/v1/cohorts/g12').then(function(response){
      var url = response.data.data[0].attributes.url;
      $http.get(url).then(function(response) {
        for (var x in response.data.data) {
          $scope.memories.push(response.data.data[x]);
        }
      })
    });
    //working get request when url is my api uri
    // $http.get('http://g12-lisa-carlson-memories.cfapps.io/api/v1/memories').then(function(response){
    //     for (var x in response.data.data) {
    //       $scope.memories.push(response.data.data[x]);
    //     }
    // });

    $scope.submit = function() {
      var memoryObj = {
      "data": {
        "type": "memory",
        "attributes": {
          "old_days": "string",
          "these_days": "string",
          "year": 0
          }
        }
      }
      memoryObj.data.attributes.old_days = $scope.memory1;
      memoryObj.data.attributes.these_days = $scope.memory2;
      memoryObj.data.attributes.year = $scope.year;
      $scope.memories.push(memoryObj);
      $http.post('http://g12-lisa-carlson-memories.cfapps.io/api/v1/memories', memoryObj).then(function(response){
      }, function(){
          console.log('error');
      });
      $scope.memory1 = '';
      $scope.memory2 = '';
      $scope.year = '';
    }
    $http.get('http://g12-lisa-carlson-memories.cfapps.io/api/v1/memories/years').then(function (response) {
      $scope.years = response.data;
    })
    
  }])
  .controller('YearController', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.year = $routeParams.year;
    $http.get('http://g12-lisa-carlson-memories.cfapps.io/api/v1/memories/'+$scope.year).then(function (response) {
      $scope.yearMemories = response.data.data;
    });
  }])
  .config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/partials/home.html',
        controller: 'HomeController'
      })
      .when('/years/:year', {
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