'use strict';
(function() {
  angular
    .module('app.controllers')
    .controller('UserController', [
      '$scope',
      'UserService',
      '$stateParams',
      '$sce',
      userCtrl
    ]);

  function userCtrl($scope, UserService, $stateParams, $sce) {
    var username = $stateParams.name;
    $scope.page = 1;
    UserService.getUserPageData(username, $scope.page)
      .then(function(res) {
        if (res.status ===200 && res.data && res.data.status === 'success') {
          if (res.data.user) {
            $scope.user = res.data.user;
          }
          if (res.data.feeds) {
            var userfeeds = res.data.feeds;
            angular.forEach(userfeeds, function(feed) {
              if (feed.attachment && feed.attachment.type === 'video') {
                feed.attachment.config = {
                  sources: [
                    {src: $sce.trustAsResourceUrl(feed.attachment.url), type: 'video/mp4'},
                    {src: $sce.trustAsResourceUrl(feed.attachment.url), type: 'video/webm'},
                    {src: $sce.trustAsResourceUrl(feed.attachment.url), type: 'video/ogg'}
                  ],
                  theme: 'lib/videogular-themes-default/videogular.css',
                  plugins: {

                  }
                }
              }
              if (feed.attachment && feed.attachment.type === 'audio') {
                feed.attachment.config = {
                  sources: [
                    {src: $sce.trustAsResourceUrl(feed.attachment.url), type: 'audio/mpeg'},
                    {src: $sce.trustAsResourceUrl(feed.attachment.url), type: 'audio/ogg'}
                  ],
                  theme: {
                    url: 'lib/videogular-themes-default/videogular.css'
                  }
                }
              }
            });
            $scope.feeds = userfeeds;
          }
        }
      }, function(error) {
        console.log(error);
      })
  }
})();