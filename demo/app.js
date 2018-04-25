(function () {
  var app = angular.module('app', ['angularFineUploader']);

  app.controller('home', ['$scope', home]);

  function home($scope) {
    $scope.appname = 'hi';
  }
}())
