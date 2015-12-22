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
        'color': '@',
        'details':'@',
        'type':'@',
        'goto':'@'
  		},
  		// controller:function($scope){
  		    
  		//     $scope.setStyle=function(hexColor){
  		//         if(!hexColor) return "";
  		//         if(hexColor.indexOf("#")===-1) return "";
  		//         var rgb=hexToRgb(hexColor);
  		//         var bgcolor='rgba('+rgb.r+', '+rgb.g+', '+rgb.b+', 1)';
  		//         console.log(bgcolor);
  		//         return {'background-color':bgcolor};
  		//     }
  		    
  		//     function hexToRgb(hex) {
    //             // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    //             var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    //             hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    //                 return r + r + g + g + b + b;
    //             });
            
    //             var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    //             return result ? {
    //                 r: parseInt(result[1], 16),
    //                 g: parseInt(result[2], 16),
    //                 b: parseInt(result[3], 16)
    //             } : null;
    //         }

  		// }
  		
  	}
  });
