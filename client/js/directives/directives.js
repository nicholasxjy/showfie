'use strict';
(function() {
  angular
    .module('app.directives', [
    ])
    .directive('scrollBlurEffect', function() {
      return {
        restrict: 'AE',
        link: function(scope, element, attrs) {
          attrs.$observe('imgurl', function() {
            $(element).find('.real-banner').css('background-image', 'url('+ attrs.imgurl +')');
          })
          attrs.$observe('blururl', function() {
            $(element).find('.blur-banner').css('background-image', 'url('+ attrs.blururl +')');
          })
          $(window).scroll(function() {
            var oVal;
            oVal = $(window).scrollTop()/170;
            $(element).find('.blur-banner').css('opacity', oVal);
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
    .directive('galleryBgimage', function() {
      return {
        restrict: 'AE',
        link: function(scope, element, attrs) {
          var imgurl = attrs.imgurl;
          $(element).css('background-image', 'url('+ imgurl +')');
        }
      }
    })
})();