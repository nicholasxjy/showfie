'use strict';
(function() {
  angular
    .module('app.controllers')
    .controller('ForgetPassController', [
      '$scope',
      'UserService',
      '$state',
      '$timeout',
      forgetCtrl
    ]);
    function forgetCtrl($scope, UserService, $state, $timeout) {
      $scope.submitforgetForm = function(userInfo) {
        $scope.hasError = false;
        $scope.isSucceed = false;
        UserService.requestPasswordReset(userInfo)
          .success(function(res) {
            if (res.status === 'success') {
              $scope.hasError = false;
              $scope.isSucceed = true;
              $scope.successMessage = res.data.message;
            } else {
              $scope.hasError = true;
              $scope.errorMessage = res.data.message;
            }
          })
          .error(function(error) {
            console.log(error);
          })
      }
    }
})();