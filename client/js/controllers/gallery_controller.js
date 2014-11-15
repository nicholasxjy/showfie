'use strict';
(function() {
  angular
    .module('app.controllers')
    .controller('GalleryController', [
      '$scope',
      'UserService',
      galleryCtrl
    ]);

  function galleryCtrl($scope, UserService) {

  }
})();