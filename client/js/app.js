'use strict';

/**
 * @ngdoc overview
 * @name showfieApp
 * @description
 * # showfieApp
 *
 * Main module of the application.
 */
angular
  .module('showfieApp', [
    'ngAnimate',
    'angularFileUpload',
    'ui.router',
    'app.services',
    'app.controllers'
  ])
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
     $urlRouterProvider.otherwise('/');
     $stateProvider
        .state('welcome', {
          url: '/',
          templateUrl: 'views/child/welcome.html',
          controller: 'WelcomeController'
        })
        .state('login', {
          url: '/login',
          templateUrl: 'views/child/login.html',
          controller: 'LoginController'
        })
        .state('forgetpass', {
          url: '/forgetpass',
          templateUrl: 'views/child/forgetpass.html',
          controller: 'ForgetPassController'
        })
        .state('home', {
          url: '/home',
          templateUrl: 'views/child/home.html',
          controller: 'HomeController'
        })
        .state('feeddetail', {
          url: '/feed/:id',
          templateUrl: 'views/child/feed-detail.html'
        })
  }]);