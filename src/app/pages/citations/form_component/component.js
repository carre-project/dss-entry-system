'use strict';

angular.module('CarreEntrySystem')

.directive('citationForm', function() {
  return {
    templateUrl: 'app/pages/citations/form_component/form.html',
    restrict: 'E',
    replace: true,
    scope: {
      'model': '=',
    },
    controller: function($scope, Citations, Pubmed, toastr,$timeout, CONFIG) {
      
      // $scope.pubmedId = $scope.pubmedId || null;
      $scope.model = $scope.model || {};
      $scope.pubmedAutocompleteResults = [];
      
      $scope.noPubmed = $scope.model.noPubmed;

      //citation study types
      $scope.types=[];
      // $scope.addStudyType=function(item,model){
      //   console.log("Add study type");
      //   console.log(item,model);
      //   return item;
      //   // if($scope.types.indexOf(item)===-1 && item) {
      //   //   $scope.types.push(item);
      //   //   $scope.showNewType=false;
      //   // }
      // };

      Citations.types().then(function(res){
        console.log('Citation types',res);
          $scope.types=res;
      });
      
      
      $scope.selectPubmed=function(item,model){
        //build the summary
        var summary = null;
        if(item.title) summary=item.authorString+"; "+item.title+" "+
                item.journalTitle+" "+item.pubYear+";"+
                item.journalVolume+"("+item.issue+"):"+item.pageInfo+"."+
                " doi:"+item.doi||"0000";
                
        $scope.citation.pubmedId=item.pmid || $scope.citation.pubmedId;
        $scope.citation.summary=JSON.stringify(summary || $scope.citation.summary).slice(1, -1);
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
        
        $scope.citation.type = $scope.citation.studyType[0];
        delete $scope.citation.studyType;
        
        Citations.save($scope.model,$scope.citation).then(function(res){
          if(!res) return;
          $scope.$emit('citation:save');
          toastr.success('<b>Citation with PMID:'+$scope.citation.pubmedId+'</b>'+($scope.model.id?' has been updated':' has been created'),'<h4>Citations saved</h4>');

        },function(err){
          console.error("Error saving citation",$scope.citation)
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
          type: $scope.model.has_citation_source_type_label || "",
          level: parseInt($scope.model.has_citation_source_level_label) || 1,
          summary: $scope.model.has_citation_summary_label || "",
          pubmedId: $scope.model.has_citation_pubmed_identifier_label || ""
        };
        
        //run pubmed search
        $scope.searchPubmed($scope.citation.pubmedId);
        
        $scope.citation.studyType=[$scope.citation.type]

      }
      else {

        /************** Create Mode **************/
        console.info('---Create---');

        //Init Form object
        $scope.citation = {
          type: "",
          level: 1,
          summary: "",
          pubmedId: $scope.model.pubmedId||""
        };
        
        if($scope.citation.pubmedId){
          //run pubmed search
          $scope.searchPubmed($scope.citation.pubmedId);
        }

      }

      

      console.info('Model: ', $scope.model);
      console.info('Form params: ', $scope.citation);

    }
  };
});
