'use strict';

angular.module('CarreEntrySystem')
  .directive('riskElement',function() {
    return {
      templateUrl:'app/components/forms/risk_element/form.html',
      restrict: 'E',
      replace: true,
      scope: {
        'model': '='
      },
      controller:function($scope){
        
      }
    };
  });
