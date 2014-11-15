'use strict';
(function() {
  angular
    .module('app.controllers')
    .controller('SetProfileController', [
      '$scope',
      'UserService',
      '$state',
      '$timeout',
      setprofileCtrl
    ]);

  function setprofileCtrl($scope, UserService, $state, $timeout) {
    $scope.submitUpdate = function(updateInfo) {
      if (!updateInfo) {
        return;
      }
      UserService.updateInfo(updateInfo)
        .then(function(res) {
          console.log(res);
          if (res.status === 200 && res.data) {
            $scope.$emit('user:update', res.data.data);
            $scope.successMessage = '更新信息成功!';
            $timeout(function() {
              $scope.successMessage = '';
            }, 2000)
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