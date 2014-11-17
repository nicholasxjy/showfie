(function () {
  'use strict';
  angular
    .module('app.controllers')
    .controller('FollowingsController', [
      '$scope',
      'UserService',
      '$stateParams',
      followingCtrl
    ]);
    function followingCtrl($scope, UserService, $stateParams) {
      UserService.getCurrentUser()
        .then(function(resCurrent) {
          if (resCurrent.status === 200 && resCurrent.data) {
            $scope.cuser = resCurrent.data.data;
          }
          var name = $stateParams.name;
          $scope.page = $scope.page || 1;
          UserService.getUserFollowings(name, $scope.page)
            .then(function(resFollowings) {
              console.log(resFollowings);
              if (resFollowings.status === 200 && resFollowings.data) {
                $scope.user = resFollowings.data.data;
              }
            }, function(err) {
              console.log(err);
            })
        }, function(err) {
          console.log(err);
        })
    }

})();