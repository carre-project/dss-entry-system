'use strict';

angular.module('CarreEntrySystem')

.directive('riskElement', function() {
  return {
    templateUrl: 'app/components/forms/risk_element/form.html',
    restrict: 'E',
    replace: true,
    scope: {
      'model': '='
    },
    controller: function($scope, Observables, Bioportal) {

      $scope.model = $scope.model || {};
      $scope.bioportalAutocompleteResults = [];

      //get observables
      Observables.get().then(function(res) {
        $scope.observables = res.data;
      });

      //risk element types
      $scope.types = [{
        label: "behavioural",
        value: "risk:risk_element_type_behavioural"
      }, {
        label: "biomedical",
        value: "risk:risk_element_type_biomedical"
      }, {
        label: "demographic",
        value: "risk:risk_element_type_demographic"
      }, {
        label: "intervention",
        value: "risk:risk_element_type_intervention"
      }, {
        label: "genetic",
        value: "risk:risk_element_type_genetic"
      }, {
        label: "environmental",
        value: "risk:risk_element_type_environmental"
      }];

      //Bioportal stuff
      $scope.bioportalAutocomplete = function(term) {
        // var options = { };
        if (term.length < 2) return false;
        $scope.loadingElementIdentifier = true;
        Bioportal.fetch(term).then(function(res) {
          $scope.bioportalAutocompleteResults = res;
          $scope.loadingElementIdentifier = false;
        });
      };
      
      //Save to RDF method
      $scope.saveModel=function(){
        window.alert('Not yet!');
      };


      if ($scope.model.id) {

        /************** Edit Mode **************/
        console.info('---Edit---');


        //Init Form object
        $scope.risk_element = {
          observables: $scope.model.has_risk_element_observable.map(function(ob, index) {
            return {
              id: ob,
              label: $scope.model.has_risk_element_observable_label_arr[index]
            };
          }),
          type: $scope.model.type_label,
          name: $scope.model.has_risk_element_name_label,
          identifier: $scope.model.has_risk_element_identifier_label,
          modifiable_status: $scope.model.has_risk_element_modifiable_status_label
        };


        //init Bioportal Fetch
        $scope.bioportalAutocomplete($scope.risk_element.identifier);


      }
      else {

        /************** Create Mode **************/
        console.info('---Create---');

        //Init Form object
        $scope.risk_element = {
          observables: [],
          type: "",
          name: "",
          identifier: "",
          modifiable_status: ""
        };


      }

      

      console.info('Model: ', $scope.model);
      console.info('Form params: ', $scope.risk_element);

    }
  };
});
