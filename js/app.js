angular.module('MyApp', ['ngRoute'])
  .controller('HomeController', ['$scope', '$http', '$location', '$rootScope', function ($scope, $http, $location, $rootScope) {
    $scope.memories = [];
    $scope.memory1 = '';
    $scope.memory2 = '';
    $scope.year = '';
    var original1 = $scope.memory1;
    var original2 = $scope.memory2;
    var original3 = $scope.year;
    getURL();
    function getURL() {
      $http.get('http://galvanize-service-registry.cfapps.io/api/v1/cohorts/g12/kids-these-days?guarantee=http://g12-lisa-carlson-memories.cfapps.io').then(function(response) {
        $rootScope.url = response.data.data[0].attributes.url;
        console.log($rootScope.url)
        $http.get($rootScope.url + '/api/v1/memories').then(function(response) {
          if (response.status !== 200) {
            getURL();
          }
          else if (!response.data.data) {
            getURL();
          }
          else if (response.data.data.length > 20) {
            getURL();
          }
          else {
            for (var x in response.data.data) {
              $scope.memories.push(response.data.data[x]);
            }
          }
        });
      })
    }
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
       $scope.memory1 = angular.copy(original1);
       $scope.memory2 = angular.copy(original2);
       $scope.year = angular.copy(original3);
       $scope.memoryForm.$setPristine();
    }
    $rootScope.$watch('url', function(){
      $http.get($rootScope.url + '/api/v1/memories/years').then(function (response) {
        $scope.years = response.data.data;
      });
    });   
  }])
  .controller('YearController', ['$scope', '$http', '$routeParams', '$rootScope', function ($scope, $http, $routeParams, $rootScope) {
    $scope.year = $routeParams.year;
    $rootScope.$watch('url', function(){
      $http.get($rootScope.url + '/api/v1/memories/'+$scope.year).then(function (response) {
        $scope.yearMemories = response.data.data;
      });
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