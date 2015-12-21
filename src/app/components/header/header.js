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
            controller:function($scope){
                $scope.toggleNavbar=function(){
                    if($('div.navbar-collapse').hasClass('collapse')) $('div.navbar-collapse').removeClass('collapse'); 
                    else $('div.navbar-collapse').addClass('collapse');
                }
            }
    	}
	});


