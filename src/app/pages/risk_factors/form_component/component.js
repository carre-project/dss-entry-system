'use strict';

angular.module('CarreEntrySystem')

.directive('riskFactorForm', function() {
  return {
    templateUrl: 'app/pages/risk_factors/form_component/form.html',
    restrict: 'E',
    replace: true,
    scope: {
      'model': '='
    },
    controller: function($scope, Observables, Bioportal, Risk_elements, Risk_factors, Auth, toastr) {
      
      
      $scope.model = $scope.model || {};

      //get risk elements
      Risk_elements.get().then(function(res) {
        $scope.risk_elements = res.data.map(function(rl) {
            return {
              value: rl.id,
              label: rl.has_risk_element_name_label
            };
          });
      });
      
      //risk factor association types
      $scope.types = [{
        label: "is an issue in",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_factor_association_type_is_an_issue_in"
      }, {
        label: "causes",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_factor_association_type_causes"
      }, {
        label: "reduces",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_factor_association_type_reduces"
      }, {
        label: "elevates",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_factor_association_type_elevates"
      }];

      
      //Save to RDF method
      $scope.saveModel=function(){
        Risk_factors.save($scope.model,$scope.risk_factor).then(function(res){
          //success
          console.log('Risk factor saved',res);
          $scope.$emit('risk_factor:save');
          toastr.success('<b> Risk factor</b>'+($scope.model.id?' has been updated':' has been created'),'<h4>Risk factor saved</h4>');
        });
      };
      
      //Return back
      $scope.cancelForm=function(){
        $scope.$emit('risk_factor:cancel');
      };


      if ($scope.model.id) {

        /************** Edit Mode **************/
        console.info('---Edit---');


        //Init Form object
        $scope.risk_factor = {
          source: $scope.model.has_risk_factor_source[0],
          target: $scope.model.has_risk_factor_target[0],
          type: $scope.model.has_risk_factor_association_type[0],
        };


      }
      else {

        /************** Create Mode **************/
        console.info('---Create---');
        //Init Form object
        $scope.risk_factor = {
          source: "",
          target: "",
          type: ""
        };

      }

      console.info('Model: ', $scope.model);
      console.info('Form params: ', $scope.risk_factor);

    }
  };
});
