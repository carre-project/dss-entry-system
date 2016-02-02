'use strict';

angular.module('CarreEntrySystem')

.directive('citationForm', function() {
  return {
    templateUrl: 'app/components/forms/citation/form.html',
    restrict: 'E',
    replace: true,
    scope: {
      'model': '='
    },
    controller: function($scope, Citations, Pubmed, toastr) {
      
      
      $scope.model = $scope.model || {};
      $scope.pubmedAutocompleteResults = [];

      //risk element types
      $scope.types = [{
        label: "observational",
        value: "observational"
      },{
        label: "meta-analysis",
        value: "meta-analysis"
      },{
        label: "longitudinal population study",
        value: "longitudinal population study"
      },{
        label: "cohort study",
        value: "cohort study"
      },{
        label: "cross-sectional analyses of a community-based multicenter study",
        value: "cross-sectional analyses of a community-based multicenter study"
      },{
        label: "longitudinal population study",
        value: "longitudinal population study"
      },{
        label: "prospective cohort study",
        value: "prospective cohort study"
      },{
        label: "multi-national RCT",
        value: "multi-national RCT"
      },{
        label: "systematic review",
        value: "systematic review"
      },{
        label: "follow-up",
        value: "follow-up"
      },{
        label: "RCT",
        value: "RCT"
      }];

      //Bioportal stuff
      $scope.pubmedAutocomplete = function(term) {
        // var options = { };
        if (term.length < 2) return false;
        $scope.loadingElementIdentifier = true;
        Pubmed.search(term).then(function(res) {
          $scope.pubmedAutocompleteResults = res;
          $scope.loadingElementIdentifier = false;
        });
      };
      
      //Save to RDF method
      $scope.saveModel=function(){
        Citations.insert($scope.model,$scope.citation,$scope.user.graphName).then(function(res){
          //success
          console.log('Citation saved',res);
          
          $scope.$emit('citation:save');
          toastr.success('<b>'+$scope.citation.name+'</b>'+($scope.model.id?' has been updated':' has been created'),'<h4>Citations saved</h4>');

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
          type: $scope.model.has_citation_source_type_label,
          level: Number($scope.model.has_citation_source_level_label),
          summary: $scope.model.has_citation_summary_label,
          pubmedId: $scope.model.has_citation_pubmed_identifier_label
        };


      }
      else {

        /************** Create Mode **************/
        console.info('---Create---');

        //Init Form object
        $scope.citation = {
          type: "",
          level: 1,
          summary: "",
          pubmedId: ""
        };


      }

      

      console.info('Model: ', $scope.model);
      console.info('Form params: ', $scope.citation);

    }
  };
});
