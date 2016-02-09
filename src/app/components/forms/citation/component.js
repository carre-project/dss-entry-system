'use strict';

angular.module('CarreEntrySystem')

.directive('citationForm', function() {
  return {
    templateUrl: 'app/components/forms/citation/form.html',
    restrict: 'E',
    replace: true,
    scope: {
      'model': '=',
      'hideviewer': '='
    },
    controller: function($scope, Citations, Pubmed, toastr,$timeout, CONFIG) {
      
      $scope.hideviewer = $scope.hideviewer || false;
      $scope.model = $scope.model || {};
      $scope.pubmedAutocompleteResults = [];

      //citation study types
      $scope.types=[];
      $scope.addStudyType=function(item,model){
        console.log(item,model);
        if($scope.types.indexOf(item)===-1 && item) {
          $scope.types.push(item);
          $scope.showNewType=false;
        }
      };
      if(CONFIG.CitationTypes) {
        $scope.types = CONFIG.CitationTypes;
      } else {
        Citations.get().then(function(res){
          $timeout(function(){
            $scope.types = CONFIG.CitationTypes;
          },100);
        });
      }
      
      
      $scope.selectPubmed=function(item,model){
        //build the summary
        var summary = null;
        if(item.title) summary=item.authorString+"; "+item.title+" "+
                item.journalTitle+" "+item.pubYear+";"+
                item.journalVolume+"("+item.issue+"):"+item.pageInfo+"."+
                " doi:"+item.doi;
                
        $scope.citation.has_citation_pubmed_identifier.val=item.pmid||$scope.citation.has_citation_pubmed_identifier.val;
        $scope.citation.has_citation_summary.val=summary || $scope.citation.has_citation_summary.val;
        $scope.loadPubmed();
      };
      
      //refresh pubmed article
      $scope.loadPubmed=function(){
        $scope.showPubmed=false;
        $timeout(function(){
          $scope.showPubmed=true;
        },200);
      };
      
      //Autocomplete stuff
      $scope.searchPubmed = function(term) {
        // var options = { };
        if (term.length < 2) return false;
        $scope.loadingElementIdentifier = true;
        Pubmed.search(term).then(function(res) {
          /*
          
          authorString: "Levy M, Smith T, Alvarez-Perez A, Back A, Baker JN, Beck AC, Block S, Dalal S, Dans M, Fitch TR, Kapo J, Kutner JS, Kvale E, Misra S, Mitchell W, Portman DG, Sauer TM, Spiegel D, Sutton L, Szmuilowicz E, Taylor RM, Temel J, Tickoo R, Urba SG, Weinstein E, Zachariah F, Bergman MA, Scavone JL."
          citedByCount: 0
          epmcAuthMan: "N"
          hasBook: "N"
          hasDbCrossReferences: "N"
          hasLabsLinks: "N"
          hasPDF: "N"
          hasReferences: "N"
          hasSuppl: "N"
          hasTMAccessionNumbers: "N"
          hasTextMinedTerms: "N"
          id: "26733557"
          inEPMC: "N"
          inPMC: "N"
          issue: "1"
          journalIssn: "1540-1405"
          journalTitle: "J Natl Compr Canc Netw"
          journalVolume: "14"
          luceneScore: "NaN"
          pageInfo: "82-113"
          pmid: "26733557"
          pubType: "journal article"
          pubYear: "2016"
          source: "MED"
          title: "Palliative Care Version 1.2016."
          
          */
          $scope.pubmedAutocompleteResultsCount = res.count;
          $scope.pubmedAutocompleteResults = res.result
          .map(function(obj){
              obj.title = obj.title || "";
              obj.authorString = obj.authorString || "";
              obj.source =obj.source || "";
              obj.pubYear = obj.pubYear || "";
              obj.pmid = obj.pmid || obj.id;
              return obj;
          });
          $scope.loadingElementIdentifier = false;
          $scope.selectPubmed($scope.pubmedAutocompleteResults[0]||{}); //pass an empty object for no errors
        });
      };
      
      //Save to RDF method
      $scope.saveModel=function(){
        Citations.insert($scope.model,$scope.citation).then(function(res){
          //success
          console.log('Citation saved',res);
          
          $scope.$emit('citation:save');
          toastr.success('<b>'+$scope.citation.has_citation_summary.val+'</b>'+($scope.model.id?' has been updated':' has been created'),'<h4>Citations saved</h4>');

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
          has_citation_source_type: {val:$scope.model.has_citation_source_type_label || "",type:'string'},
          has_citation_source_level: {val:Number($scope.model.has_citation_source_level_label) || 1,type:'integer'},
          has_citation_summary: {val:$scope.model.has_citation_summary_label || "",type:'string'},
          has_citation_pubmed_identifier: {val:$scope.model.has_citation_pubmed_identifier_label || "",type:'string'}
        };
        $scope.searchPubmed($scope.citation.has_citation_pubmed_identifier.val);
      }
      else {
        /************** Create Mode **************/
        console.info('---Create---');
        //Init Form object
        $scope.citation = {
          has_citation_source_type: {val:"",type:'string'},
          has_citation_source_level: {val:1,type:'integer'},
          has_citation_summary: {val:"",type:'string'},
          has_citation_pubmed_identifier: {val:$scope.model.pubmedId||"",type:'string'}
        };
        if($scope.model.pubmedId){
          //run pubmed search
          $scope.searchPubmed($scope.citation.has_citation_pubmed_identifier.val);
        }
    
      }


      console.info('Model: ', $scope.model);
      console.info('Form params: ', $scope.citation);

    }
  };
});
