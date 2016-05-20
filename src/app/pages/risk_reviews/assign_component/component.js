'use strict';

angular.module('CarreEntrySystem')

.directive('assignReviewForm', function() {
  return {
    templateUrl: 'app/pages/risk_reviews/assign_component/form.html',
    restrict: 'E',
    replace: true,
    scope: {
      'model': '='
    },
    controller: function($scope, Medical_experts, Risk_reviews,Auth,toastr) {
      
      $scope.model = $scope.model || {};
      $scope.bioportalAutocompleteResults = [];

      //get observables
      Medical_experts.get().then(function(res) {
        //auto select initial
        var selected=[];
        $scope.observables = res.data.map(function(ob) {
            var obj={
              value: ob.id,
              label: ob.has_observable_name_label
            };
            if($scope.model.id && $scope.model.has_risk_element_observable) {
              if($scope.model.has_risk_element_observable.indexOf(ob.id)>=0) selected.push(obj.value);
            }
            return obj;
          });
        $scope.risk_element.observables=selected;
      });

      //get risk elements
      Risk_reviews.get().then(function(res) {
        //auto select initial
        var selected=[];
        $scope.risk_elements = res.data.map(function(rl) {
            var obj={
              value: rl.id,
              label: rl.has_risk_element_name_label
            };
            if($scope.model.id && $scope.model.includes_risk_element) {
              if($scope.model.includes_risk_element.indexOf(rl.id)>=0) selected.push(obj.value);
            }
            return obj;
          });
          $scope.risk_element.risk_elements=selected;
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
        Risk_reviews.save($scope.model,$scope.risk_element).then(function(res){
          //success
          console.log('Risk Element saved',res);
          
          $scope.$emit('risk_element:save');
          toastr.success('<b>'+$scope.risk_element.name+'</b>'+($scope.model.id?' has been updated':' has been created'),'<h4>Risk element saved</h4>');

        });
      };
      //Return back
      $scope.cancelForm=function(){
        $scope.$emit('risk_element:cancel');
      };


      if ($scope.model.id) {

        /************** Edit Mode **************/
        console.info('---Edit---');


        //Init Form object
        $scope.risk_element = {
          observables: [],
          risk_elements: [],
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
          risk_elements: [],
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
