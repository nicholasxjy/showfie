'use strict';
(function() {
  angular
    .module('app.controllers')
    .controller('WelcomeController', [
      '$scope',
      'UserService',
      '$state',
      welcomeCtrl
    ]);

    function welcomeCtrl($scope, UserService, $state) {
      $scope.submitSignUpForm = function(userinfo) {
        UserService.signUp(userinfo)
          .success(function(resInfo) {
            console.log(resInfo);
            if (resInfo.status === 'success') {
              $state.go('home');
            } else {
              $scope.hasError = true;
              $scope.errorMessage = resInfo.data.message;
            }
          })
          .error(function(error) {
            console.log(error);
          })
      }
    }
})();