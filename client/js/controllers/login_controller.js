'use strict';
(function() {
  angular
    .module('app.controllers')
    .controller('LoginController', [
      '$scope',
      'UserService',
      '$state',
      loginCtrl
    ]);

    function loginCtrl($scope, UserService, $state) {
      $scope.submitLoginForm = function(userInfo) {
        UserService.login(userInfo)
          .success(function(res) {
            if (res.status === 'success') {
              $state.go('home');
            } else {
              console.log(res);
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