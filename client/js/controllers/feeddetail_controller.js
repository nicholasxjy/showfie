'use strict';
(function() {
  angular
    .module('app.controllers')
    .controller('FeedDetailController', [
      '$scope',
      'UserService',
      'FeedService',
      '$stateParams',
      'ngDialog',
      '$sce',
      detailCtrl
    ]);

  function detailCtrl($scope, UserService, FeedService, $stateParams, ngDialog, $sce) {
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
                var thefeed = resFeed.data.feed;
                if (thefeed.attachment && thefeed.attachment.type === 'video') {
                  thefeed.attachment.config = {
                    sources: [
                      {src: $sce.trustAsResourceUrl(thefeed.attachment.url), type: 'video/mp4'},
                      {src: $sce.trustAsResourceUrl(thefeed.attachment.url), type: 'video/webm'},
                      {src: $sce.trustAsResourceUrl(thefeed.attachment.url), type: 'video/ogg'}
                    ],
                    theme: 'lib/videogular-themes-default/videogular.css',
                    plugins: {

                    }
                  }
                }
                if (thefeed.attachment && thefeed.attachment.type === 'audio') {
                  thefeed.attachment.config = {
                    sources: [
                      {src: $sce.trustAsResourceUrl(thefeed.attachment.url), type: 'audio/mpeg'},
                      {src: $sce.trustAsResourceUrl(thefeed.attachment.url), type: 'audio/ogg'}
                    ],
                    theme: {
                      url: 'lib/videogular-themes-default/videogular.css'
                    }
                  }
                }
                $scope.feed = thefeed;
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
            $scope.likeusers = res.data.data;
          }
        }, function(err) {
          console.log(err);
        })
    }
    $scope.submitUnlike = function(feed) {
      UserService.removeLike(feed._id)
        .then(function(res) {
          if (res.status === 200 && res.data) {
            $scope.likeusers = res.data.data;
          }
        }, function(err) {
          console.log(err);
        })
    }

    $scope.addComment = function(comment) {
      var commentObj = {};
      if (!comment) {
        commentObj.author = $scope.feed.author;
        commentObj.createdAt = $scope.feed.createdAt;
      } else {
        commentObj = comment;
      }
      $scope.commentTo = commentObj;
      ngDialog.open({
        template: 'views/partials/comment.html',
        scope: $scope
      });
    };

    $scope.submitComment =function(info) {
      info.feedid = $scope.feed._id;
      info.touserid = $scope.commentTo.author._id;
      UserService.addComment(info)
        .then(function(res) {
          console.log(res);
          if (res.status === 200 && res.data) {
            $scope.feed.comments = res.data.data.comments;
            ngDialog.close('ngdialog1');
          }
        }, function(err) {
          console.log(err);
        })
    }
  }
})();