'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('CarreEntrySystem')
	.directive('carreNotifications',function(){
		return {
        templateUrl:'app/components/notifications/notifications.html',
        restrict: 'E',
        replace: true
    	};
	});


