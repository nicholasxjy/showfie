'use strict';
(function() {
  angular
    .module('app.services')
    .factory('FeedService', [
      '$http',
      function($http) {
        var feedService = {
          getAllFeeds: getAllFeeds
        };
        return feedService;

        //here
        function getAllFeeds(cpage) {
          return $http({
            url:'/feed/all',
            method: 'GET',
            params: {page: cpage}
          });
        }
      }
    ]);
})();