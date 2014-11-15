'use strict';
(function() {
  angular
    .module('app.controllers')
    .controller('UserController', [
      '$scope',
      'UserService',
      '$stateParams',
      userCtrl
    ]);

  function userCtrl($scope, UserService, $stateParams) {
    var username = $stateParams.name;
    $scope.page = 1;
    UserService.getUserPageData(username, $scope.page)
      .then(function(res) {
        if (res.status ===200 && res.data && res.data.status === 'success') {
          if (res.data.user) {
            $scope.user = res.data.user;
          }
          if (res.data.feeds) {
            $scope.feeds = res.data.feeds;
          }
        }
      }, function(error) {
        console.log(error);
      })
  }
})();