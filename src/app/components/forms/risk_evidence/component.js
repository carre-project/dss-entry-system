'use strict';

angular.module('CarreEntrySystem')

.directive('riskEvidenceForm', function() {
  return {
    templateUrl: 'app/components/forms/risk_evidence/form.html',
    restrict: 'E',
    replace: true,
    scope: {
      'model': '='
    },
    controller: function($scope, Observables, Bioportal, Risk_elements, Auth, toastr) {

      Auth.getUser().then(function(res) {
        $scope.user = res;
      });
      $scope.model = $scope.model || {};
      $scope.bioportalAutocompleteResults = [];

      //get observables
      Observables.get().then(function(res) {
        $scope.observables = res.data.map(function(ob) {
            return {
              value: ob.id_label,
              label: ob.has_observable_name_label
            };
          });
        $scope.output=computed($scope.risk_evidence.condition_json.group);
      });

      // //risk evidence types
      // $scope.types = [{
      //   label: "behavioural",
      //   value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_evidence_type_behavioural"
      // }, {
      //   label: "biomedical",
      //   value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_evidence_type_biomedical"
      // }, {
      //   label: "demographic",
      //   value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_evidence_type_demographic"
      // }, {
      //   label: "intervention",
      //   value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_evidence_type_intervention"
      // }, {
      //   label: "genetic",
      //   value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_evidence_type_genetic"
      // }, {
      //   label: "environmental",
      //   value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_evidence_type_environmental"
      // }];

      // //Bioportal stuff
      // $scope.bioportalAutocomplete = function(term) {
      //   // var options = { };
      //   if (term.length < 2) return false;
      //   $scope.loadingElementIdentifier = true;
      //   Bioportal.fetch(term).then(function(res) {
      //     $scope.bioportalAutocompleteResults = res;
      //     $scope.loadingElementIdentifier = false;
      //   });
      // };

      //Save to RDF method
      $scope.saveModel = function() {
        Risk_elements.insert($scope.model, $scope.risk_evidence, $scope.user.graphName).then(function(res) {
          //success
          console.log('Risk Element saved', res);

          $scope.$emit('risk_evidence:save');
          toastr.success('<b>' + $scope.risk_evidence.name + '</b>' + ($scope.model.id ? ' has been updated' : ' has been created'), '<h4>Risk element saved</h4>');

        });
      };
      //Return back
      $scope.cancelForm = function() {
        $scope.$emit('risk_evidence:cancel');
      };


      if ($scope.model.id) {

        /************** Edit Mode **************/
        console.info('---Edit---');


        //Init Form object
        $scope.risk_evidence = {
          condition: $scope.model.has_observable_condition,
          condition_json: angular.fromJson($scope.model.has_observable_condition_json[0])
        };

        //init expression
        $scope.filter = $scope.risk_evidence.condition_json || {
          "group": {
            "operator": "AND",
            "rules": []
          }
        };

        //init Bioportal Fetch
        // $scope.bioportalAutocomplete($scope.risk_evidence.identifier);


      }
      else {

        /************** Create Mode **************/
        console.info('---Create---');

        //Init Form object
        $scope.risk_evidence = {};


      }


      /*Logical expression builder */

      function repeat(pattern, count) {
        if (count < 1) return '';
        var result = '';
        while (count > 1) {
          if (count & 1) result += pattern;
          count >>= 1, pattern += pattern;
        }
        return result + pattern;
      }

      function htmlEntities(str) {
        return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }

      function groupExist(rules) {
        for (var obj in rules) {
          if (obj === 'group') return true;
        }
        return false;
      }

      function computed(group) {
          if(!$scope.observables) return ""
          if (!group) return "";
          for (var str = "(", i = 0; i < group.rules.length; i++) {
              i > 0 && (str += " <strong>" + group.operator + "</strong> ");
              str += group.rules[i].group ?
                  computed(group.rules[i].group) :
                  getObservableName(group.rules[i].field) + " " + htmlEntities(group.rules[i].condition) + " " + group.rules[i].data;
          }
  
          return str + ")";
      }

      $scope.$watch('filter', function(newValue) {
        $scope.model.has_observable_condition_json = newValue;
        $scope.model.has_observable_condition = $scope.output = computed(newValue.group, 0, {});
      }, true);

      
      function getObservableName(id){
        if($scope.observables) {
          return $scope.observables.filter(function(ob){
            return ob.value===id;
          })[0].label;
        }
      }


      console.info('Model: ', $scope.model);
      console.info('Form params: ', $scope.risk_evidence);

    }
  };
});
