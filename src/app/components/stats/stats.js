'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('CarreEntrySystem')
    .directive('stats',function() {
    	return {
  		templateUrl:'app/components/stats/stats.html',
  		restrict:'E',
  		replace:true,
  		scope: {
        'model': '=',
        'comments': '@',
        'number': '@',
        'name': '@',
        'title': '@',
        'colour': '@',
        'details':'@',
        'type':'@',
        'goto':'@'
  		}
  		
  	}
  });
