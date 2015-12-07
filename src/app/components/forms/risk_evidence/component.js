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
    controller: function($scope, Observables, Bioportal, Risk_elements, Auth, toastr,$timeout) {
      $scope.copyModel={};
      angular.copy($scope.model,$scope.copyModel);
      
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
        $scope.output=removeOuterParenthesis(computed($scope.risk_evidence.condition_json.group));
      });


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

        //init expression
        $scope.filter = {
          "group": {
            "operator": "AND",
            "rules": []
          }
        };
        
        
        //Init Form object
        $scope.risk_evidence = {
          pubmedId:''
        };


      }
      /* LoadPubmed */
      $scope.loadPubmed=function(){
        $scope.showPubmed=false;
        $timeout(function(){
          $scope.showPubmed=true;
        },200);
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
          
          var str="(";
          for (var i = 0; i < group.rules.length; i++) {
              i > 0 && (str += " <b>" + group.operator + "</b> ");
              str += group.rules[i].group ?
                  computed(group.rules[i].group) :
                  getObservableName(group.rules[i].field) + " " + htmlEntities(group.rules[i].condition) + " " + group.rules[i].data;
          }
  
          return str +")";
      }

      $scope.$watch('filter', function(newValue) {
        $scope.model.has_observable_condition_json = newValue;
        $scope.output = removeOuterParenthesis(computed(newValue.group, 0, {}));
        
        // $scope.reset=false;
        // $timeout(function(){
        //   $scope.output
        //   $scope.reset=true;
          
        //   $scope.copyModel.has_observable_condition[0] = $scope.output;
        //   $scope.copyModel.has_observable_condition_label = $scope.output;
        // },100);
        // console.log($scope.output);
        // console.log($scope.copyModel);
      }, true);

      
      function getObservableName(id){
        if($scope.observables) {
          return "<a href='/observables/"+id+"'>"+$scope.observables.filter(function(ob){
            return ob.value===id;
          })[0].label+"</a>";
        }
        // return <carre-linker model="risk_evidence.current" property="{{field.value}}"></carre-linker>""
      }
      
      function removeOuterParenthesis(str){
        return str.substr(1,str.length-2);
      }

      console.info('Model: ', $scope.model);
      console.info('Form params: ', $scope.risk_evidence);

    }
  };
});
