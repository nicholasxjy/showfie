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
          getUserPageData: getUserPageData
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
      }
    ]);
})();