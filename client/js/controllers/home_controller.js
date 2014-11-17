'use strict';
(function() {
  angular
    .module('app.controllers')
    .controller('HomeController', [
      '$scope',
      'UserService',
      'FeedService',
      '$state',
      '$sce',
      homeCtrl
    ]);
    function homeCtrl($scope, UserService, FeedService, $state, $sce) {
      UserService.getCurrentUser()
        .then(function(resUser) {
          if (resUser.status === 200 && resUser.data) {
            $scope.user = resUser.data.data;
            $scope.postcount = resUser.data.userpostcount;
            loadFeeds(1);
          } else {
            $state.go('login');
          }
        })
      $scope.$on('feed:new', function(evt) {
        loadFeeds(1);
        $scope.user.postcount = $scope.user.postcount + 1;
      });

      $scope.submitFollow = function(feed) {
        UserService.addFollow(feed.author._id)
          .then(function(res) {
            if (res.status === 200 && res.data) {
              $scope.user = res.data.user;
              feed.author = res.data.follower;
            }
          }, function(err) {
            console.log(err);
          })
      }
      $scope.submitUnfollow = function(feed) {
        console.log(feed);
        UserService.removeFollow(feed.author._id)
          .then(function(res) {
            if (res.status === 200 && res.data) {
              $scope.user = res.data.user;
              feed.author = res.data.follower;
            }
          }, function(err) {
            console.log(err);
          })
      }

      $scope.submitLike = function(feed) {
        UserService.addLike(feed._id)
          .then(function(res) {
            if (res.status === 200 && res.data) {
              feed.likes = res.data.data;
            }
          }, function(err) {
            console.log(err);
          })
      }
      $scope.submitUnlike = function(feed) {
        UserService.removeLike(feed._id)
          .then(function(res) {
            if (res.status === 200 && res.data) {
              feed.likes = res.data.data;
            }
          }, function(err) {
            console.log(err);
          })
      }
      function loadFeeds(currentPage) {
        FeedService.getAllFeeds(currentPage)
          .then(function(res) {
            if (res.status === 200 && res.data.data)
            var feeds = res.data.data;
            angular.forEach(feeds, function(feed) {
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
            $scope.feeds = feeds;
            console.log(feeds);
          }, function(err) {
            console.log(err);
          });
      }
    }
})();