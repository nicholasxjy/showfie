'use strict';
(function() {
  angular
    .module('app.controllers')
    .controller('MessageController', [
      '$scope',
      'UserService',
      messageCtrl
    ]);

  function messageCtrl($scope, UserService) {

  }
})();