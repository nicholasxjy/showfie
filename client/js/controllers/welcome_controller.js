'use strict';
(function() {
  angular
    .module('app.controllers')
    .controller('WelcomeController', [
      '$scope',
      'UserService',
      '$state',
      '$timeout',
      welcomeCtrl
    ]);

    function welcomeCtrl($scope, UserService, $state, $timeout) {
      $scope.submitSignUpForm = function(userinfo) {
        $scope.spinnerShow = true;
        UserService.signUp(userinfo)
          .success(function(resInfo) {
            $timeout(function() {
              $scope.spinnerShow = false;
              console.log(resInfo);
              if (resInfo.status === 'success') {
                $state.go('home');
              } else {
                $scope.hasError = true;
                $scope.errorMessage = resInfo.data.message;
              }
            }, 1500);
          })
          .error(function(error) {
            console.log(error);
          })
      }
    }
})();