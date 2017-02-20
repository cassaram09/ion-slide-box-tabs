ionSlideBoxTabs = angular.module('ion-slide-box-tabs', []);

function ionSlideBoxTabs(){
  return {
    restrict: 'E',
    templateUrl: [
      '<div class="slide-tabs">',
        '<ul class="slide-tab-list">',
          '<li ng-click="selectTab($index)" class="label" ng-repeat="tab in tabs track by $index">',
            '<div ng-bind="tab"></div>',
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

      var indicator = angular.element('#slide-tab-indicator')
      var transclude = angular.element('#slide-box-content')
      transclude.css("height", '90%')

      $scope.snapToPosition = function(){
        var index = $ionicSlideBoxDelegate.currentIndex();
        moveIndicator(index)
      }

      $scope.selectTab = function(index) {
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
        var leftOffset = slide.offset().left
        var width = slide.width()
        var positon = (Math.abs(leftOffset) / width) * 100;
        
        if ( positon > index * 100) {
          return
        }

        if ( gesture == 'right') {
          position = ( (index - 1) * 100 ) - pos
          indicator.css("transform", "translate("+ position + "%" + ",0%)")
        } else {
          position = position + ( (index - 1) * 100)
          indicator.css("transform", "translate("+ position + "%" + ",0%)")
        }
        return true;
      }

      $scope.onGesture = function(gesture) {
        move(gesture)
      }

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

      angular.element(document).ready(function () {
        var width = 100 / $scope.tabs.length
        angular.element('li.label').css('width', width +  "%")
        indicator.css('width', width +  "%")
      });
    
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
