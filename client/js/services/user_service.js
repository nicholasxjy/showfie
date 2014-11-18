'use strict';
(function() {
  angular
    .module('app.services')
    .factory('UserService', [
      '$http',
      function($http) {
        var userService = {
          signUp: signUp,
          login: login,
          logout: logout,
          requestPasswordReset: requestPasswordReset,
          updateInfo: updateUserInfo,
          getCurrentUser: getCurrentUser,
          getUserPageData: getUserPageData,
          getUserMessages: getUserMessages,
          getUserFollowers: getUserFollowers,
          getUserFollowings: getUserFollowings,
          addFollow: addFollow,
          removeFollow: removeFollow,
          addLike: addLike,
          removeLike: removeLike,
          addComment: addComment
        };
        return userService;

        //here
        function signUp(info) {
          return $http.post('/signup', info);
        }

        function login(info) {
          return $http.post('/login', info);
        }
        function logout() {
          return $http.get('/logout');
        }
        function requestPasswordReset(info) {
          return $http.post('/forgetpass', info);
        }

        function updateUserInfo(info) {
          return $http.post('/update', info);
        }

        function getCurrentUser() {
          return $http.get('/currentuser');
        }

        function getUserPageData(name, page) {
          return $http.get('/user/data', {
            params: {
              username: name,
              page: page
            }
          });
        }
        function getUserMessages() {
          return $http.get('/user/messages');
        }
        function getUserFollowers(name, page) {
          return $http.get('/user/followers', {
            params: {
              username: name,
              page: page
            }
          })
        }
        function getUserFollowings(name, page) {
          return $http.get('/user/followings', {
            params: {
              username: name,
              page: page
            }
          })
        }
        function addFollow(followid) {
          return $http.post('/follow', {followid: followid});
        }

        function removeFollow(unfollowid) {
          return $http.post('/unfollow', {unfollowid: unfollowid});
        }

        function addLike(feedid) {
          return $http.post('/like', {feedid: feedid});
        }
        function removeLike(feedid) {
          return $http.post('/unlike', {feedid: feedid});
        }

        function addComment(info) {
          return $http.post('/addcomment', info);
        }
      }
    ]);
})();