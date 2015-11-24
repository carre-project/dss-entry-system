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
      controller:function($scope,Observables){
        
        Observables.get().then(function(res) {
          console.log(res.data);
          $scope.observables = res.data;
        });
        
        $scope.types = [{
          label: "behavioural",
          value: "risk:risk_element_type_behavioural"
        },{
          label: "biomedical",
          value: "risk:risk_element_type_biomedical"
        },{
          label: "demographic",
          value: "risk:risk_element_type_demographic"
        },{
          label: "intervention",
          value: "risk:risk_element_type_intervention"
        }];

        //Form
        $scope.risk_element = {
          observables: {},
          type: {},
          name: "",
          cui: "",
          modifiable_status: false
        };
      }
    };
  });
