'use strict';
(function() {
  angular
    .module('app.controllers')
    .controller('HomeController', [
      '$rootScope',
      '$scope',
      'UserService',
      'FeedService',
      '$state',
      '$sce',
      'ngDialog',
      homeCtrl
    ]);
    function homeCtrl($rootScope, $scope, UserService, FeedService, $state, $sce, ngDialog) {
      $scope.userInfoState = false;
      UserService.getCurrentUser()
        .then(function(resUser) {
          if (resUser.status === 200 && resUser.data) {
            $scope.user = resUser.data.data;
            console.log($scope.user);
            $scope.postcount = resUser.data.userpostcount;
            $scope.currentPage = 1;
            $scope.feeds = [];
            loadFeeds($scope.currentPage);
          } else {
            $state.go('login');
          }
        })
      $rootScope.$on('feed:new', function(evt) {
        loadFeeds($scope.currentPage);
        $scope.user.postcount = $scope.user.postcount + 1;
      });
      $scope.showUserInfo = function() {
        $scope.userInfoState = !$scope.userInfoState;
      }
      $scope.hideUserInfo = function() {
        $scope.userInfoState = false;
      }
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
      $scope.createNewFeed = function() {
        ngDialog.open({
          template:'views/partials/create-feed.html',
          controller: 'CreateFeedController'
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
            $scope.feeds = $scope.feeds.concat(feeds);
            console.log(feeds);
          }, function(err) {
            console.log(err);
          });
      }
    }
})();