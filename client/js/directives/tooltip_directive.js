(function() {
  'use strict';
  angular
    .module('app.directives', [
    ])
    .directive('sfTooltip', function() {
      return {
        restrict: 'AE',
        link: function(scope, element, attrs) {
          var title = attrs.sftitle;
          $(element).tooltip({
            title: title
          });
        }
      }
    })
})();