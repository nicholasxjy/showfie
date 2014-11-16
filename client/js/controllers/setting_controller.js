'use strict';
(function() {
  angular
    .module('app.controllers')
    .controller('SettingController', [
      '$scope',
      'UserService',
      settingCtrl
    ]);

  function settingCtrl($scope, UserService) {
    UserService.getCurrentUser()
      .then(function(resUser) {
        if (resUser.status === 200 && resUser.data) {
          $scope.user = resUser.data.data;
          $scope.postcount = resUser.data.userpostcount;
        } else {
          $state.go('login');
        }
      });
    $scope.$on('user:update', function(evt, newUser) {
      $scope.user = newUser;
    });
  }
})();