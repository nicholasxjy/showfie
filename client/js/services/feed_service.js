'use strict';
(function() {
  angular
    .module('app.services')
    .factory('FeedService', [
      '$http',
      function($http) {
        var feedService = {
          getAllFeeds: getAllFeeds,
          getFeedDetail: getFeedDetail
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

        function getFeedDetail(id) {
          return $http({
            url: '/feed/detail',
            method: 'GET',
            params: {
              id: id
            }
          });
        }
      }
    ]);
})();