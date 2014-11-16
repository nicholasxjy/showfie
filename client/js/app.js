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
    'app.directives',
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
        .state('logout', {
          url: '/logout',
          controller: 'LogoutController'
        })
        .state('forgetpass', {
          url: '/forgetpass',
          templateUrl: 'views/child/forgetpass.html',
          controller: 'ForgetPassController'
        })
        .state('settings', {
          templateUrl: 'views/child/settings.html',
          controller: 'SettingController'
        })
        .state('settings.profile', {
          url:'/setting/profile',
          templateUrl: 'views/partials/settings.profile.html',
          controller: 'SetProfileController'
        })
        .state('settings.avatar', {
          url: '/setting/avatar',
          templateUrl: 'views/partials/settings.avatar.html',
          controller: 'SetAvatarController'
        })
        .state('settings.banner', {
          url: '/setting/banner',
          templateUrl: 'views/partials/settings.banner.html',
          controller:'SetBannerController'
        })
        .state('home', {
          url: '/home',
          templateUrl: 'views/child/home.html',
          controller: 'HomeController'
        })
        .state('user', {
          url: '/:name',
          templateUrl: 'views/child/user.html',
          controller: 'UserController'
        })
        .state('user.gallery', {
          url: '/gallery',
          templateUrl: 'views/child/gallery.html',
          controller: 'GalleryController'
        })
        .state('user.messages', {
          url: '/messages',
          templateUrl: 'views/child/messages.html',
          controller: 'MessageController'
        })
        .state('feeddetail', {
          url: '/feed/:id',
          templateUrl: 'views/child/feed-detail.html',
          controller: 'FeedDetailController'
        })

  }]);