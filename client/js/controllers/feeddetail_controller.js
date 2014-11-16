'use strict';
(function() {
  angular
    .module('app.controllers')
    .controller('FeedDetailController', [
      '$scope',
      'UserService',
      'FeedService',
      '$stateParams',
      detailCtrl
    ]);

  function detailCtrl($scope, UserService, FeedService, $stateParams) {
    var id = $stateParams.id;
    UserService.getCurrentUser()
      .then(function(resUser) {
        if (resUser.status === 200 && resUser.data) {
          $scope.user = resUser.data.data;
          $scope.postcount = resUser.data.userpostcount;
          FeedService.getFeedDetail(id)
            .then(function(resFeed) {
              console.log(resFeed);
              if (resUser.status === 200 && resFeed.data) {
                $scope.feed = resFeed.data.feed;
                $scope.likeusers = resFeed.data.likeusers;
              }
            }, function(err) {
              console.log(err);
            })
        } else {
          $state.go('login');
        }
      }, function(err) {
        console.log(err);
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
  }
})();