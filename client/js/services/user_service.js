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
          requestPasswordReset: requestPasswordReset,
          getCurrentUser: getCurrentUser
        };
        return userService;

        //here
        function signUp(info) {
          return $http.post('/signup', info);
        }

        function login(info) {
          return $http.post('/login', info);
        }

        function requestPasswordReset(info) {
          return $http.post('/forgetpass', info);
        }

        function getCurrentUser() {
          return $http.get('/currentuser');
        }
      }
    ]);
})();