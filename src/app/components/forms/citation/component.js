'use strict';

angular.module('CarreEntrySystem')

.directive('riskElementForm', function() {
  return {
    templateUrl: 'app/components/forms/citation/form.html',
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
        $scope.citations = res.data.map(function(rl) {
            return {
              value: rl.id,
              label: rl.has_citation_name_label
            };
          });
      });

      //risk element types
      $scope.types = [{
        label: "behavioural",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#citation_type_behavioural"
      }, {
        label: "biomedical",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#citation_type_biomedical"
      }, {
        label: "demographic",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#citation_type_demographic"
      }, {
        label: "intervention",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#citation_type_intervention"
      }, {
        label: "genetic",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#citation_type_genetic"
      }, {
        label: "environmental",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#citation_type_environmental"
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
        Risk_elements.insert($scope.model,$scope.citation,$scope.user.graphName).then(function(res){
          //success
          console.log('Risk Element saved',res);
          
          $scope.$emit('citation:save');
          toastr.success('<b>'+$scope.citation.name+'</b>'+($scope.model.id?' has been updated':' has been created'),'<h4>Risk element saved</h4>');

        });
      };
      //Return back
      $scope.cancelForm=function(){
        $scope.$emit('citation:cancel');
      };


      if ($scope.model.id) {

        /************** Edit Mode **************/
        console.info('---Edit---');


        //Init Form object
        $scope.citation = {
          observables: $scope.model.has_citation_observable,
          citations: $scope.model.includes_citation||[],
          type: $scope.model.has_citation_type[0],
          name: $scope.model.has_citation_name_label,
          identifier: $scope.model.has_citation_identifier_label,
          modifiable_status: $scope.model.has_citation_modifiable_status_label
        };


        //init Bioportal Fetch
        $scope.bioportalAutocomplete($scope.citation.identifier);


      }
      else {

        /************** Create Mode **************/
        console.info('---Create---');

        //Init Form object
        $scope.citation = {
          observables: [],
          citations: [],
          type: "",
          name: "",
          identifier: "",
          modifiable_status: ""
        };


      }

      

      console.info('Model: ', $scope.model);
      console.info('Form params: ', $scope.citation);

    }
  };
});
