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
      controllerAs:'sidebar',
      controller:function($rootScope, $scope,$state){
        
        var carreElementsMenu=[];
        angular.forEach(angular.element('#carreElements > ul.nav.nav-second-level > li > a'), function( el ){
          carreElementsMenu.push(angular.element(el).attr('ui-sref-active-if'))
        })
        function show_carreElementsMenu(state){ return carreElementsMenu.indexOf(state.substring(0,state.lastIndexOf('.')))>=0; }
        
        //handle ui-router errors
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, error) {
            $scope.carreElements =  show_carreElementsMenu(toState.name);
        });
        //collapse sidebar submenus
        $scope.carreElements = show_carreElementsMenu($state.current.name);
        
        
        
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
