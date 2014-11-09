'use strict';
(function() {
  angular
    .module('app.controllers')
    .controller('HomeController', [
      '$scope',
      'FeedService',
      '$state',
      homeCtrl
    ]);
    function homeCtrl($scope, FeedService, $state) {
      loadFeeds(1);

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