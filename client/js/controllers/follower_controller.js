(function () {
  'use strict';
  angular
    .module('app.controllers')
    .controller('FollowersController', [
      '$scope',
      'UserService',
      '$stateParams',
      followerCtrl
    ]);
    function followerCtrl($scope, UserService, $stateParams) {
      UserService.getCurrentUser()
        .then(function(resCurrent) {
          if (resCurrent.status === 200 && resCurrent.data) {
            $scope.cuser = resCurrent.data.data;
          }
          var name = $stateParams.name;
          $scope.page = $scope.page || 1;
          UserService.getUserFollowers(name, $scope.page)
            .then(function(resFollowers) {
              console.log(resFollowers);
              if (resFollowers.status === 200 && resFollowers.data) {
                $scope.user = resFollowers.data.data;
              }
            }, function(err) {
              console.log(err);
            })
        }, function(err) {
          console.log(err);
        })
    }

})();