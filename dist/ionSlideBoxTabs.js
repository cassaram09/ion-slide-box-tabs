ionSlideBoxTabsModule = angular.module('ion-slide-box-tabs', []);

function ionSlideBoxTabs(){
  return {
    restrict: 'E',
    template: [
      '<div class="slide-tabs">',
        '<ul class="slide-tab-list">',
          '<li ng-click="selectTab($index)" class="label" ng-repeat="tab in tabs track by $index" ng-style="tabWidth">',
            '<div><span ng-bind="tab"></span></div>',
          '</li>',
        '</ul>',
        '<div class="indicator-wrapper">',
          '<div id="slide-tab-indicator"></div>',
        '</div>',
        '<div id="slide-box-content" ng-transclude on-drag-right="onGesture(\'right\')" on-drag-left="onGesture(\'left\')" on-release="snapToPosition()"></div>',
      '</div>'
    ].join(''),
    transclude: true,
    controller: function($scope, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicGesture) {

      $scope.tabs = [];
      $scope.tabWidth = {"width": '0%'}
      $scope.slideHeights = {}
      $scope.currentSlideIndex = 0;
      $scope.indicator = angular.element('#slide-tab-indicator')
      $scope.transclude = angular.element('#slide-box-content')

      $scope.transclude.css("height", '90%')
      $scope.minSlideHeight = getMinSlideHeight();

      $scope.$on('slideChanged', function() {
        var index = $ionicSlideBoxDelegate.currentIndex();
        scrollTopAndResize()
        moveIndicator(index)
      });

      $scope.snapToPosition = function(){
        var index = $ionicSlideBoxDelegate.currentIndex();
        moveIndicator(index)
      }

      $scope.selectTab = function(index) {
        $ionicSlideBoxDelegate.slide(index)
        moveIndicator(index)
        scrollTopAndResize(index)
      }

      $scope.onGesture = function(gesture) {
        move(gesture)
      }

      function getSlideHeight(index) {
        // get the current slide's height from our hash
        if ( $scope.slideHeights[index] ) {
          return $scope.slideHeights[index]
        } else {
          // runs on the first move of the slider - collects all slide heights
          var slides = angular.element('ion-slide').length
          $scope.slidesContainer = angular.element('.slider-slides')
          for ( var i = 0; i < slides; i++) {
            var slideHeight = angular.element("[slide-tab-label='" + $scope.tabs[i] + "']").height() 
            var height = Math.max(slideHeight, $scope.minSlidHeight);
            $scope.slideHeights[i] = height
          }
          return $scope.slideHeights[index]
        }  
      }

      function move(gesture) {
        var index = $ionicSlideBoxDelegate.currentIndex() + 1
        if ( ( index == 1 && gesture == 'right' ) || ( index == $scope.tabs.length && gesture == 'left' ) ) {
          return
        }
        var slide = angular.element(".slider-slide:nth-child(" + index + ")" )
        var leftOffset = slide.offset().left
        var width = angular.element(window).width()
        var position = (Math.abs(leftOffset) / width) * 100;
        
        if ( position > index * 100) {
          return
        }

        if ( gesture == 'right') {
          position = ( (index - 1) * 100 ) - position
          $scope.indicator.css("transform", "translate("+ position + "%" + ",0%)")
        } else {
          position = position + ( (index - 1) * 100)
          $scope.indicator.css("transform", "translate("+ position + "%" + ",0%)")
        }
        return true;
      }

      function moveIndicator(index) {
        var position = (index * 100) + "%"
        $scope.indicator.css("transform", "translate("+ position + ",0%)")
      }

      function scrollTopAndResize(index) {
        $ionicScrollDelegate.scrollTop(true);
        var height = getSlideHeight(index)
        $scope.slidesContainer.css('height', height)
      } 

      function getMinSlideHeight(){
        var tabHeight = angular.element("ion-tab").height()
        var windowHeight = angular.element(window).height()
        var topOffset = $scope.transclude.offset().top
        var height = ( windowHeight - topOffset - tabHeight )
        return height;
      }
    
    }
  }

}

ionSlideBoxTabsModule
  .directive('ionSlideBoxTabs', ionSlideBoxTabs)

function slideTabLabel(){
  return {
    link: function ($scope, $element, $attrs, $parent) { 
      var tabs = $scope.$parent.$parent.$parent.tabs;
      tabs.push($attrs.slideTabLabel);

      var tabWidth = $scope.$parent.$parent.$parent.tabWidth
      var width = 100 / tabs.length
      tabWidth.width = width + '%'

      $scope.indicator.css('width', width +  "%")
    }
  }
}

ionSlideBoxTabsModule
  .directive('slideTabLabel', slideTabLabel)