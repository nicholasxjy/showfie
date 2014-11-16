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
                $scope.feed = resFeed.data.data;
              }
            }, function(err) {
              console.log(err);
            })
        } else {
          $state.go('login');
        }
      }, function(err) {
        console.log(err);
      })
  }
})();