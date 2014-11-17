(function () {
  'use strict';
  angular
    .module('app.controllers')
    .controller('FollowingsController', [
      '$scope',
      'UserService',
      followingCtrl
    ]);
    function followingCtrl($scope, UserService) {

    }

})();