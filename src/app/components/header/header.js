'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('CarreEntrySystem')
	.directive('header',function(){
		return {
        templateUrl:'app/components/header/header.html',
        restrict: 'E',
        replace: true,
    	}
	});


