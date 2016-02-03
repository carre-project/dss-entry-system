(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('citationsSingleController', citationsSingleController);

  /** @ngInject */
  function citationsSingleController(toastr,content ,Citations, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, SweetAlert, $state, CARRE, $scope){
    var vm = this;


    var visibleFields=[
      // "type",      
      // "id",
      "has_citation_pubmed_identifier",
      "has_citation_summary",
      "has_citation_source_type",
      "has_citation_source_level",
      "has_author",
      "has_reviewer"
    ];


    /* View Risk_evidence */
    vm.id = $stateParams.id;
    vm.current = {};
    vm.edit = $stateParams.edit;
    if (vm.id) getCitation(vm.id);


    //Handle events
    $scope.$on('citation:save', function() {
      if (vm.current.id) {
        $state.go('main.citations.view', {
          id: vm.id
        });
      }
      else $state.go('main.citations.list');
    });
    $scope.$on('citation:cancel', function() {
      if (vm.current.id) {
        $state.go('main.citations.view', {
          id: vm.id
        });
      }
      else $state.go('main.citations.list');
    });


    if ($state.is("main.citations.create")) {
      vm.create = true;
      vm.current = {};
    }

    if ($state.is("main.citations.createWithId")) {
      vm.create = true;
      if($stateParams.pubmedId) {
        //check if already exists a citation with this PubmedID;
        CARRE.search('citation',$stateParams.pubmedId).then(function(res){
          console.log('Citation Records for this pubmedid'+ $stateParams.pubmedId, res);
          if(res.data){
            $state.go('main.citations.edit',{id:res.data[0].id_label});
          } else {
              console.log('Article with id: ',$stateParams.pubmedId);
              vm.current = {pubmedId:$stateParams.pubmedId};
          }
        })
      } else vm.current = {};
      
    }
    else if ($state.is("main.citations.edit")) {}
    else {}



    /* Helper functions */

    function getCitation(id) {
      
      Citations.get([id]).then(function(res) {
        console.info('Citation: ', res);
        vm.current = res.data[0];
        vm.fields=visibleFields.map(function(field){
          return {
            value:field,
            label:content.labelOf(field)
          };
        });
        vm.pubmedId=vm.current.has_citation_pubmed_identifier[0];
        // vm.loading = Pubmed.fetch(vm.current.has_citation_pubmed_identifier).then(function(res) {
        //   vm.pubmedArticle = res.data;
        //   console.info('Pubmed Article: '+id, res);
        // });
        
      });
    }
    
    vm.deleteCurrent = function() {
      SweetAlert.swal({
          title: "Are you sure?",
          text: "Your will not be able to recover this element!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: true,
          closeOnCancel: true
        },
        function(isConfirm) {
          if (isConfirm) {
            CARRE.delete(vm.current.id).then(function() {
              $state.go('main.citations.list');
            });
          }
        });
    };
    

  }

})();
