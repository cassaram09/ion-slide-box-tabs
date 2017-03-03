ionSlideBoxTabsModule = angular.module('ion-slide-box-tabs', [])

function ionSlideBoxTabs(){
  return {
    restrict: 'E',
    template: [
      '<div class="slide-tabs">',
        '<ul class="slide-tab-list">',
          '<li ng-click="selectTab($index)" class="label" ng-repeat="tab in tabs track by $index" ng-style="tabWidth">',
            '<div>',
              '<span ng-class="$index == activeSlide ? \'selected-tab\' : \'\'" ng-bind="tab"></span>',
            '</div>',
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

      $scope.tabs = []
      $scope.tabWidth = {"width": '0%'}
      $scope.indicator = angular.element('#slide-tab-indicator')
      $scope.transclude = angular.element('#slide-box-content')
      $scope.activeSlide = 0;

      //set slider content box height
      $scope.transclude.css("height", '90%')

      $scope.$on('slideChanged', function() {
        var index = $ionicSlideBoxDelegate.currentIndex()
        moveIndicator(index)
        $scope.activeSlide = index;
      })

      $scope.snapToPosition = function(){
        var index = $ionicSlideBoxDelegate.currentIndex()
        moveIndicator(index)
      }

      $scope.selectTab = function(index) {
        $ionicSlideBoxDelegate.slide(index)
        moveIndicator(index)
        $scope.activeSlide = index;
      }

      $scope.onGesture = function(gesture) {
        move(gesture)
      }

      function move(gesture) {
        var index = $ionicSlideBoxDelegate.currentIndex()
        if ( ( index == 0 && gesture == 'right' ) || ( index == ( $scope.tabs.length - 1 ) && gesture == 'left' ) ) {
          return
        }
        var slide = angular.element("[slide-tab-label='" + $scope.tabs[index] + "']")
        var leftOffset = slide.offset().left
        var width = angular.element(window).width()
        var position = (Math.abs(leftOffset) / width) * 100
        var percentage = index * 100

        gesture == 'right' ? position = percentage - position : position += percentage

        $scope.indicator.css("transform", "translate("+ position + "%" + ",0%)")
      }

      function moveIndicator(index) {
        var position = (index * 100) + "%"
        $scope.indicator.css("transform", "translate("+ position + ",0%)")
      }

      $scope.$on('TAB_ADDED', function(event, tab){
        $scope.tabs.push(tab)
        var width = 100 / $scope.tabs.length
        $scope.tabWidth.width = width + '%'
        $scope.indicator.css('width', width +  "%")
      })
    
    }
  }
}

ionSlideBoxTabsModule
  .directive('ionSlideBoxTabs', ionSlideBoxTabs)

function slideTabLabel(){
  return {
    link: function ($scope, $element, $attrs, $parent) {
      var tab = $attrs.slideTabLabel
      $scope.$emit('TAB_ADDED', tab) 
    }
  }
}

ionSlideBoxTabsModule
  .directive('slideTabLabel', slideTabLabel)
