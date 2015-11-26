'use strict';

angular.module('CarreEntrySystem')

.directive('riskElementForm', function() {
  return {
    templateUrl: 'app/components/forms/risk_element/form.html',
    restrict: 'E',
    replace: true,
    scope: {
      'model': '='
    },
    controller: function($scope, Observables, Bioportal, Risk_elements,Auth,toastr) {
      
      Auth.getUser().then(function(res){ $scope.user=res; });
      $scope.model = $scope.model || {};
      $scope.bioportalAutocompleteResults = [];

      //get observables
      Observables.get().then(function(res) {
        $scope.observables = res.data.map(function(ob) {
            return {
              value: ob.id,
              label: ob.has_observable_name_label
            };
          });
      });

      //risk element types
      $scope.types = [{
        label: "behavioural",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_element_type_behavioural"
      }, {
        label: "biomedical",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_element_type_biomedical"
      }, {
        label: "demographic",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_element_type_demographic"
      }, {
        label: "intervention",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_element_type_intervention"
      }, {
        label: "genetic",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_element_type_genetic"
      }, {
        label: "environmental",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_element_type_environmental"
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
        Risk_elements.insert($scope.model,$scope.risk_element,$scope.user.graphName).then(function(res){
          //success
          console.log(res);
          toastr.success('<h3>Risk element saved</h3><p>'+$scope.risk_element.name+' is now in RDF!</p>');

        },function(res){
          //error
          console.error(res);
          toastr.error('<h3>Oh Error</h3><p>'+res.data+'</p>');

          
        });
      };


      if ($scope.model.id) {

        /************** Edit Mode **************/
        console.info('---Edit---');


        //Init Form object
        $scope.risk_element = {
          observables: $scope.model.has_risk_element_observable.map(function(ob, index) {
            return ob;
          }),
          type: $scope.model.has_risk_element_type[0],
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
