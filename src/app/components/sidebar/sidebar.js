'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('CarreEntrySystem')
  .directive('sidebar',sidebarDirective);
  
  function sidebarDirective() {
    return {
      templateUrl:'app/components/sidebar/sidebar.html',
      restrict: 'E',
      replace: true,
      scope: {},
      controller:function($scope){
             
        $scope.slideWidth=(window.innerWidth>730)?window.innerWidth*0.4:window.innerWidth*0.9;
        
        $(window).resize(function(){
            if($scope.showAbout) { 
              // console.log('Width changed', window.innerWidth);
              $scope.slideWidth=(window.innerWidth>730)?window.innerWidth*0.4:window.innerWidth*0.9;
              $scope.slideWidth=(window.innerWidth>730)?window.innerWidth*0.4:window.innerWidth*0.9;
              $scope.$apply(function(){ $scope.showAbout=false;  });
              $scope.$apply(function(){ $scope.showAbout=true;  });
            }
        });

      }
    };
  };
