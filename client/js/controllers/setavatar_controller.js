'use strict';
(function() {
  angular
    .module('app.controllers')
    .controller('SetAvatarController', [
      '$scope',
      '$upload',
      '$timeout',
      setavatarCtrl
    ]);

  function setavatarCtrl($scope, $upload, $timeout) {
    $scope.fileReaderSupported =window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.onImageSelect = function($files) {
        $scope.selectedFiles = $files;
        if ($files && $files.length > 0) {
          var $file = $files[0];
          if ($scope.fileReaderSupported
            &&
            $file.type.indexOf('image') > -1) {
              var fileReader = new FileReader();
              fileReader.readAsDataURL($file);
              var loadFile = function(fileReader, index) {
                  fileReader.onload = function(e) {
                      $timeout(function() {
                          $scope.avatar = e.target.result;
                      });
                  }
              }(fileReader, 0);
          }
        }
    };
    $scope.uploadAvatar = function() {
      $scope.spinnerShow = true;
      var file;
      if ($scope.selectedFiles && $scope.selectedFiles.length > 0) {
        file = $scope.selectedFiles[0];
      }
      $upload.upload({
        url: '/update/avatar',
        file: file
      })
      .success(function(res) {
        console.log(res);
        if (res.status === 'success') {
          $scope.spinnerShow = false;
          //here reset all
          $scope.selectedFiles = null;
          $scope.$emit('user:update', res.data);
        }
      })
    }
  }
})();