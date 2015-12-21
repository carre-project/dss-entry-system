'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('CarreEntrySystem')
	.directive('headerNotification',function($rootScope,$timeout,$state,$location){
		return {
            templateUrl:'app/components/header/header-notification/header-notification.html',
            restrict: 'E',
            replace: true,
            link:function(scope,elem,attr){
                scope.pathname=setPath();
                $rootScope.$on('$stateChangeSuccess', function(){ scope.pathname=setPath(); })
                function setPath(){ return $location.absUrl().replace('/edit','');}
            }
		}
	});


