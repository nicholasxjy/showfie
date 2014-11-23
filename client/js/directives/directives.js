'use strict';
(function() {
  angular
    .module('app.directives', [
    ])
    .directive('scrollBlurEffect', function() {
      return {
        restrict: 'AE',
        link: function(scope, element, attrs) {
          $('.shrinkwrap').scroll(function() {
            var oVal;
            oVal = $('.shrinkwrap').scrollTop()/170;
            $(element).css('opacity', oVal);
          })
        }
      }
    })
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