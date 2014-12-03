'use strict';
(function() {
  angular
    .module('app.controllers')
    .controller('SetBannerController', [
      '$scope',
      '$upload',
      '$timeout',
      'SweetAlert',
      setbannerCtrl
    ]);
  function setbannerCtrl($scope, $upload, $timeout, SweetAlert) {
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
                          $scope.banner = e.target.result;
                      });
                  }
              }(fileReader, 0);
          }
        }
    };
    $scope.uploadBanner = function() {
      var file;
      if ($scope.selectedFiles && $scope.selectedFiles.length > 0) {
        file = $scope.selectedFiles[0];
      }
      $upload.upload({
        url: '/update/banner',
        file: file
      })
      .success(function(res) {
        if (res.status === 'success') {
          //here reset all
          $scope.selectedFiles = null;
          $scope.$emit('user:update', res.data);
          SweetAlert.swal("Cool!", "You changed your banner!", "success");
        }
      })
    }
  }
})();