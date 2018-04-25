(function () {
  var app = angular.module('app', []);

  app.controller('home', ['$scope', home]);

  function home($scope) {
    $scope.appname = 'hi';
  }
}())
