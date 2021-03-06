'use strict';
(function() {
  angular
    .module('app.controllers')
    .controller('CreateFeedController', [
      '$scope',
      '$upload',
      '$timeout',
      '$state',
      'ngDialog',
      createCtrl
    ]);

    function createCtrl($scope, $upload, $timeout, $state, ngDialog) {
      $scope.hasAttachment = false;
      $scope.photoDisable = false;
      $scope.videoDisable = false;
      $scope.audioDisable = false;

      $scope.submitNewFeed = function(feedInfo) {
        if (feedInfo && feedInfo.content) {
          $scope.feed.content = feedInfo.content;
        } else {
          $scope.feed.content = '';
        }
        var file;
        if ($scope.selectedFiles && $scope.selectedFiles.length > 0) {
          file = $scope.selectedFiles[0];
        }
        $upload.upload({
          url: '/feed/create',
          data: {content: $scope.feed.content},
          file: file
        })
        .success(function(res) {
          if (res.status === 'success') {
            //here reset all
            $scope.hasAttachment = false;
            $scope.photoDisable = false;
            $scope.videoDisable = false;
            $scope.audioDisable = false;
            $scope.feed.content = '';
            $scope.selectedFiles = null;
            $scope.dataUrls = null;
            ngDialog.close('ngdialog1');
            $scope.$emit('feed:new');
            $state.go('home');
          }
        })
      };

      $scope.cancelAttach = function() {
        $scope.selectedFiles = null;
        $scope.dataUrls = [];
        $scope.hasAttachment = false;
        $scope.photoDisable = false;
        $scope.videoDisable = false;
        $scope.audioDisable = false;
      }

      $scope.fileReaderSupported =
      window.FileReader != null
      &&
      (window.FileAPI == null || FileAPI.html5 != false);

      $scope.onImageSelect = function($files) {
        $scope.videoDisable = true;
        $scope.audioDisable = true;
        $scope.hasAttachment = true;
          $scope.dataUrls = [];
          $scope.selectedFiles = $files;
          for (var i = 0; i < $files.length; i++) {
              var $file = $files[i];
              if ($scope.fileReaderSupported
                &&
                $file.type.indexOf('image') > -1) {
                  var fileReader = new FileReader();
                  fileReader.readAsDataURL($files[i]);
                  var loadFile = function(fileReader, index) {
                      fileReader.onload = function(e) {
                          $timeout(function() {
                              $scope.dataUrls[index] = e.target.result;
                          });
                      }
                  }(fileReader, i);
              }
          }
      }

      $scope.onVideoSelect = function($files) {
        $scope.photDisable = true;
        $scope.audioDisable = true;
        $scope.hasAttachment = true;
        $scope.selectedFiles = $files;
      };

      $scope.onAudioSelect = function($files) {
        $scope.videoDisable = true;
        $scope.photoDisable = true;
        $scope.hasAttachment = true;
        $scope.selectedFiles = $files;
      }
    }
})();