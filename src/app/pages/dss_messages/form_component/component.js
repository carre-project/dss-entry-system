'use strict';

angular.module('CarreEntrySystem')

.directive('riskFactorForm', function() {
  return {
    templateUrl: 'app/pages/dss_messages/form_component/form.html',
    restrict: 'E',
    replace: true,
    scope: {
      'model': '='
    },
    controller: function($scope, Calculated_observables, Bioportal, Risk_elements, dss_messages, Auth, toastr) {
      
      
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
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#dss_message_association_type_is_an_issue_in"
      }, {
        label: "causes",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#dss_message_association_type_causes"
      }, {
        label: "reduces",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#dss_message_association_type_reduces"
      }, {
        label: "elevates",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#dss_message_association_type_elevates"
      }];

      
      //Save to RDF method
      $scope.saveModel=function(){
        dss_messages.save($scope.model,$scope.dss_message).then(function(res){
          //success
          console.log('Risk factor saved',res);
          $scope.$emit('dss_message:save');
          toastr.success('<b> Risk factor</b>'+($scope.model.id?' has been updated':' has been created'),'<h4>Risk factor saved</h4>');
        });
      };
      
      //Return back
      $scope.cancelForm=function(){
        $scope.$emit('dss_message:cancel');
      };


      if ($scope.model.id) {

        /************** Edit Mode **************/
        console.info('---Edit---');


        //Init Form object
        $scope.dss_message = {
          source: $scope.model.has_dss_message_source[0],
          target: $scope.model.has_dss_message_target[0],
          type: $scope.model.has_dss_message_association_type[0],
        };


      }
      else {

        /************** Create Mode **************/
        console.info('---Create---');
        //Init Form object
        $scope.dss_message = {
          source: "",
          target: "",
          type: ""
        };

      }

      console.info('Model: ', $scope.model);
      console.info('Form params: ', $scope.dss_message);

    }
  };
});
