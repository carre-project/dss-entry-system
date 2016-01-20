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
    controller: function($scope, Citations, Observables, Bioportal, Risk_factors, toastr,$timeout) {
      $scope.copyModel={};
      angular.copy($scope.model,$scope.copyModel);
      
      $scope.model = $scope.model || {};
      $scope.bioportalAutocompleteResults = [];

      //get observables
      Observables.get().then(function(res) {
        console.log('Observables',res);
        $scope.observables = res.data.map(function(obj) {
            return {
              value: obj.id_label,
              id: obj.id,
              label: obj.has_observable_name_label,
              metype_label: obj.has_observable_measurement_type_label,
              metype_id: obj.has_observable_measurement_type[0]
            };
          });
        $scope.output=removeOuterParenthesis(computed($scope.risk_evidence.condition_json.group));
      });

      //get risk factors
      Risk_factors.get().then(function(res) {
        $scope.risk_factors = res.data.map(function(obj) {
            return {
              value: obj.id,
              label: obj.has_risk_factor_source_label+' ['+obj.has_risk_factor_association_type_label+'] '+obj.has_risk_factor_target_label
            };
          });
      });
      
      //get citations
      Citations.get().then(function(res) {
        $scope.citations = res.data.map(function(obj) {
          var label=[];
          if(obj.has_citation_summary_label) label=obj.has_citation_summary_label.split('.');
            return {
              value: obj.id,
              pubmed:obj.has_citation_pubmed_identifier[0],
              title: label[1],
              authors: label[0],
              date: label[2]
            };
          });
      });

      //ratio types
      $scope.ratiotypes = [{
        label: "Hazard ratio",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_evidence_ratio_type_hazard_ratio"
      }, {
        label: "Odds ratio",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_evidence_ratio_type_odds_ratio"
      }, {
        label: "Relative risk",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_evidence_ratio_type_relative_risk"
      }, {
        label: "Risk ratio",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_evidence_ratio_type_risk_ratio"
      }];
      
      
      //Save to RDF method
      $scope.saveModel = function() {
        Risk_factors.insert($scope.model, $scope.risk_evidence, $scope.user.graphName).then(function(res) {
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
          observables: $scope.model.has_risk_evidence_observable,
          ratio_type:$scope.model.has_risk_evidence_ratio_type[0],
          ratio_value:Number($scope.model.has_risk_evidence_ratio_value[0]),
          confidence_interval_min:Number($scope.model.has_confidence_interval_min[0]),
          confidence_interval_max:Number($scope.model.has_confidence_interval_max[0]),
          risk_factor:$scope.model.has_risk_factor,
          pubmedId:$scope.model.has_risk_evidence_source_label,
          evidence_source:$scope.model.has_risk_evidence_source[0],
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

        //init Pubmed Fetch
        loadPubmed();


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
          pubmedId:'',
          risk_factor:''
        };


      }
      
      
      
      /* LoadPubmed */
      $scope.loadPubmed=loadPubmed;
      function loadPubmed(){
        $scope.showPubmed=false;
        $timeout(function(){
          $scope.showPubmed=true;
        },200);
      }
      
      $scope.viewPubmed=function(item,model){
        //init Pubmed Fetch
        $scope.risk_evidence.pubmedId=item.pubmed;
        loadPubmed();
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
        if (!id) return '';
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
