'use strict';
(function() {
  angular
    .module('app.controllers')
    .controller('HomeController', [
      '$scope',
      'UserService',
      'FeedService',
      '$state',
      homeCtrl
    ]);
    function homeCtrl($scope, UserService, FeedService, $state) {
      UserService.getCurrentUser()
        .then(function(resUser) {
          if (resUser.status === 200 && resUser.data) {
            $scope.user = resUser.data.data;
            loadFeeds(1);
          };
        })
      $scope.$on('feed:new', function(evt) {
        loadFeeds(1);
      });

      $scope.goToFeedDetail = function(index) {
        var feed = $scope.feeds[index];
        $state.go('feeddetail', {id: feed.feed.objectId});
      }

      function loadFeeds(currentPage) {
        FeedService.getAllFeeds(currentPage)
          .success(function(res) {
            var feeds = res.data;
            $scope.feeds = feeds;
            console.log(feeds);
          })
          .error(function(error) {
            console.log(error);
          })
      }
    }
})();