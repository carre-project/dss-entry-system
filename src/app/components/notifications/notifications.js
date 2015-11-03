'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('CarreEntrySystem')
	.directive('notifications',function(){
		return {
        templateUrl:'app/components/notifications/notifications.html',
        restrict: 'E',
        replace: true,
    	}
	});


