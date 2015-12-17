'use strict';

angular.module('CarreEntrySystem')

.directive('measurementTypeForm', function() {
  return {
    templateUrl: 'app/components/forms/measurement_type/form.html',
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

      //get risk elements
      Risk_elements.get().then(function(res) {
        $scope.measurement_types = res.data.map(function(rl) {
            return {
              value: rl.id,
              label: rl.has_measurement_type_name_label
            };
          });
      });

      //risk element types
      $scope.types = [{
        label: "behavioural",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#measurement_type_type_behavioural"
      }, {
        label: "biomedical",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#measurement_type_type_biomedical"
      }, {
        label: "demographic",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#measurement_type_type_demographic"
      }, {
        label: "intervention",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#measurement_type_type_intervention"
      }, {
        label: "genetic",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#measurement_type_type_genetic"
      }, {
        label: "environmental",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#measurement_type_type_environmental"
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
        Risk_elements.insert($scope.model,$scope.measurement_type,$scope.user.graphName).then(function(res){
          //success
          console.log('Risk Element saved',res);
          
          $scope.$emit('measurement_type:save');
          toastr.success('<b>'+$scope.measurement_type.name+'</b>'+($scope.model.id?' has been updated':' has been created'),'<h4>Risk element saved</h4>');

        });
      };
      //Return back
      $scope.cancelForm=function(){
        $scope.$emit('measurement_type:cancel');
      };


      if ($scope.model.id) {

        /************** Edit Mode **************/
        console.info('---Edit---');


        //Init Form object
        $scope.measurement_type = {
          observables: $scope.model.has_measurement_type_observable,
          measurement_types: $scope.model.includes_measurement_type||[],
          type: $scope.model.has_measurement_type_type[0],
          name: $scope.model.has_measurement_type_name_label,
          identifier: $scope.model.has_measurement_type_identifier_label,
          modifiable_status: $scope.model.has_measurement_type_modifiable_status_label
        };


        //init Bioportal Fetch
        $scope.bioportalAutocomplete($scope.measurement_type.identifier);


      }
      else {

        /************** Create Mode **************/
        console.info('---Create---');

        //Init Form object
        $scope.measurement_type = {
          observables: [],
          measurement_types: [],
          type: "",
          name: "",
          identifier: "",
          modifiable_status: ""
        };


      }

      

      console.info('Model: ', $scope.model);
      console.info('Form params: ', $scope.measurement_type);

    }
  };
});
