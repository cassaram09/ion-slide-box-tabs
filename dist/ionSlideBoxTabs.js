ionSlideBoxTabs = angular.module('ion-slide-box-tabs', []);

function ionSlideBoxTabs($ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicGesture){
  return {
    restrict: 'E',
    templateUrl: 'app/slideTabs/slideTabs.html',
    transclude: true,
    controller: function($scope, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicGesture) {

      var _this = $scope;

      _this.slideIndex = 0;  
      _this.tabs = [];

      var indicator = angular.element('#slide-tab-indicator')

      function moveIndicator(index) {
        var position = (index * 100) + "%"
        indicator.css("transform", "translate("+ position + ",0%)")
      }

      function scrollTopAndResize() {
        $ionicScrollDelegate.scrollTop(true);
         $timeout( function() {
          $ionicScrollDelegate.resize();
        }, 50);
      }

      _this.snapToPosition = function(){
        var index = $ionicSlideBoxDelegate.currentIndex();
        slideToPosition(index)
      }

      _this.selectTab = function(index) {
        scrollTopAndResize()
        $ionicSlideBoxDelegate.slide(index)
        moveIndicator(index)
      }

      $scope.$on('slideChanged', function() {
        var index = $ionicSlideBoxDelegate.currentIndex();
        scrollTopAndResize()
        moveIndicator(index)
      });

      function move(gesture) {
        var index = $ionicSlideBoxDelegate.currentIndex() + 1
        if ( ( index == 1 && gesture == 'right' ) || ( index == 3 && gesture == 'left' ) ) {
          return
        }

        var slide = angular.element(".slider-slide:nth-child(" + index + ")" )
        var left = slide.offset().left
        var width = slide.width()
        var pos = (Math.abs(left) / width) * 100;
        
        if ( pos > index * 100) {
          return
        }

        if ( gesture == 'right') {
          pos = ((index - 1) * 100) - pos
          indicator.css("transform", "translate("+ pos + "%" + ",0%)")
        } else {
          pos = pos + ( (index - 1) * 100)
          indicator.css("transform", "translate("+ pos + "%" + ",0%)")
        }
        return true;
      }

      _this.onGesture = function(gesture) {
        move(gesture)
      }
    
    },
    compile: function(element, attributes){ 
      return {
         post: function(scope, element, attributes, controller, transcludeFn){
          $( document ).ready(function() {
            var height = $(window).height() - 130 - 65;
            var width = 100 / scope.tabs.length
            $('li.label').css('width', width +  "%")
            $('#slide-tab-indicator').css('width', width +  "%")
            $('#slide-box-content').css("height", '90%')
          });   
        }
      }
    }
  }
}

angular
  .module("ionic")
  .directive('ionSlideBoxTabs', ionSlideBoxTabs)


function slideTabLabel(){
  return {
    link: function ($scope, $element, $attrs, $parent) { 
      $scope.$parent.$parent.$parent.tabs.push($attrs.slideTabLabel);
    }
  }
}

angular
  .module("ionic")
  .directive('slideTabLabel', slideTabLabel)
