'use strict';
(function() {
  angular
    .module('app.controllers')
    .controller('LogoutController', [
      '$scope',
      '$state',
      'UserService',
      logoutCtrl
    ]);
    function logoutCtrl($scope, $state, UserService) {
      UserService.logout()
        .then(function() {
          $state.go('welcome');
        });
    }
})();