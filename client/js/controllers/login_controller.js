'use strict';
(function() {
  angular
    .module('app.controllers')
    .controller('LoginController', [
      '$scope',
      'UserService',
      '$state',
      '$timeout',
      loginCtrl
    ]);

  function loginCtrl($scope, UserService, $state, $timeout) {
    $scope.submitLoginForm = function(userInfo) {
      $scope.spinnerShow = true;
      UserService.login(userInfo)
        .success(function(res) {
          $timeout(function() {
            $scope.spinnerShow = false;
            if (res.status === 'success') {
              console.log(res);
              $state.go('home');
            } else {
              console.log(res);
              $scope.hasError = true;
              $scope.errorMessage = res.error;
            }
          }, 1500);
        })
        .error(function(error) {
          console.log(error);
        })
    }
  }
})();