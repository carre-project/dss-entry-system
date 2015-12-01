'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('CarreEntrySystem')
	.directive('carreFooter',function(){
		return {
        templateUrl:'app/components/footer/footer.html',
        restrict: 'E',
        replace: true
    	}
	});


