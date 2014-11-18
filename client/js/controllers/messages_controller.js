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
    UserService.getCurrentUser()
      .then(function(resUser) {
        if (resUser.status === 200 && resUser.data) {
          $scope.user = resUser.data.data;
        }
        UserService.getUserMessages()
          .then(function(resNoti) {
            console.log(resNoti);
            if (resNoti.status === 200 && resNoti.data) {
              $scope.likeNotis = resNoti.data.likes;
              $scope.followNotis = resNoti.data.follows;
              $scope.commentNotis = resNoti.data.comments;
              $scope.user.notification = resNoti.data.user.notification;
            }
          }, function(err) {
            console.log(err);
          })
      }, function(err) {
        console.log(err);
      })
  }
})();