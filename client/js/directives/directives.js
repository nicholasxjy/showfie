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
    .directive('fancyBox', function() {
      return {
        restrict: 'AE',
        link: function(scope, element, attrs) {
          $(element).on('click', function() {
            var imgurl = attrs.imgurl;
            var title = attrs.title;
            $.fancybox({
              href: imgurl,
              title: title,
              openEffect: 'fade'
            });
          });
        }
      }
    })
    .directive('scrollReveal', function() {
      return {
        restrict: 'AE',
        link: function(scope, element, attrs) {
          window.sr = new scrollReveal();
        }
      }
    })
})();