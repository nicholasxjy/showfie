(function() {
  'use strict';
  angular
    .module('app.directives', [
    ])
    .directive('scrollBlurEffect', function() {
      return {
        restrict: 'AE',
        link: function(scope, element, attrs) {
          $(window).scroll(function() {
            var oVal;
            oVal = $(window).scrollTop()/170;
            element.css('opacity', oVal);
          })
        }
      }
    })
})();