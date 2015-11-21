(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('risk_evidencesSingleController', risk_evidencesSingleController);

  /** @ngInject */
  function risk_evidencesSingleController(toastr,content ,Bioportal, Risk_evidences, currentUser, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state ) {
    var vm = this;



    /* View Risk_evidence */
    vm.id = $stateParams.id;
    vm.edit = $stateParams.edit;
    if (vm.id) getRisk_evidence(vm.id);

    if ($state.is("main.risk_evidences.create")) {
      
      console.info('---Create---');
      console.info('State: ', $state);
      console.info('State params: ', $stateParams);

      /************** Edit/Create Template **************/
      
      
      
      
    }
    else if ($state.is("main.risk_evidences.edit")) {
      
      console.info('---Edit---');
      console.info('State: ', $state);
      console.info('State params: ', $stateParams);

      /************** Edit/Create Template **************/



    }
    else {

      console.info('---View---');
      console.info('State: ', $state);
      console.info('State params: ', $stateParams);

      /************** View Template **************/
      
      
      
    }



    /* Helper functions */

    function getRisk_evidence(id) {
      Risk_evidences.get([id]).then(function(res) {
        // console.info('Risk_evidence: ', res);
        vm.current = res.data[0];
        vm.fields=res.fields.map(function(field){
          return {
            value:field,
            label:content.labelOf(field)
          }
        });
        
        var options={
          display_context:'false',
          require_exact_match:'false',
          include:'prefLabel,definition,cui',
          display_links:'true',
          require_definitions:'false'
        };
        vm.pubmedId=vm.current.has_risk_evidence_source_label.split(' ')[1];
        vm.loading = Pubmed.fetch(vm.pubmedId).then(function(res) {
          vm.pubmedArticle = res.data;
        });
        
      });
    }


  }

})();
