'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('CarreEntrySystem')
	.directive('carreHeader',function(){
		return {
            templateUrl:'app/components/header/header.html',
            restrict: 'E',
            replace: true,
            controllerAs:'header',
            controller:function($scope,$rootScope){
                $scope.toggleNavbar=function(){
                    if($('div.navbar-collapse').hasClass('collapse')) $('div.navbar-collapse').removeClass('collapse'); 
                    else $('div.navbar-collapse').addClass('collapse');
                }
                //when you change state close again the navbar
                $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
                    console.log(fromState,toState);
                    if(fromState!==toState) $('div.navbar-collapse').addClass('collapse');
                })
            }
    	}
	});


