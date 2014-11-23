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
    'angular-loading-bar',
    'angularFileUpload',
    'ui.router',
    'ngDialog',
    "ngSanitize",
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
    'com.2fdevs.videogular.plugins.poster',
    'wu.masonry',
    'infinite-scroll',
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
        .state('messages', {
          url: '/messages',
          templateUrl: 'views/child/messages.html',
          controller: 'MessageController'
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
        .state('user.followers', {
          url: '/followers',
          templateUrl: 'views/child/followers.html',
          controller: 'FollowersController'
        })
        .state('user.followings', {
          url: '/followings',
          templateUrl: 'views/child/followings.html',
          controller: 'FollowingsController'
        })
        .state('feeddetail', {
          url: '/feed/:id',
          templateUrl: 'views/child/feed-detail.html',
          controller: 'FeedDetailController'
        })

  }]);