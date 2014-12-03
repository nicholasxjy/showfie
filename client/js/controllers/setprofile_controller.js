'use strict';
(function() {
  angular
    .module('app.controllers')
    .controller('SetProfileController', [
      '$scope',
      'UserService',
      '$state',
      '$timeout',
      'SweetAlert',
      setprofileCtrl
    ]);

  function setprofileCtrl($scope, UserService, $state, $timeout, SweetAlert) {
    $scope.submitUpdate = function(updateInfo) {
      if (!updateInfo) {
        return;
      }
      UserService.updateInfo(updateInfo)
        .then(function(res) {
          if (res.status === 200 && res.data) {
            $scope.$emit('user:update', res.data.data);
            SweetAlert.swal("Cool!", "You changed your profile!", "success");
          }
          if (res.status === 403) {
            $state.go('login');
          }
        }, function(error) {
          console.log(error);
        })
    }
  }
})();