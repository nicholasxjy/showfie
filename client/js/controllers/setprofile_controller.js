'use strict';
(function() {
  angular
    .module('app.controllers')
    .controller('SetProfileController', [
      '$scope',
      setprofileCtrl
    ]);

  function setprofileCtrl($scope) {
    $scope.submitUpdate = function(updateInfo) {
      console.log(updateInfo);
    }
  }
})();