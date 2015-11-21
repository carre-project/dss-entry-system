(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('risk_factorsSingleController', risk_factorsSingleController);

  /** @ngInject */
  function risk_factorsSingleController(toastr,content ,Bioportal, Risk_factors, currentUser, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state, $log) {
    var vm = this;



    /* View Risk_factor */
    vm.id = $stateParams.id;
    vm.edit = $stateParams.edit;
    if (vm.id) getRisk_factor(vm.id);

    if ($state.is("main.risk_factors.create")) {
      
      $log.info('---Create---');
      $log.info('State: ', $state);
      $log.info('State params: ', $stateParams);

      /************** Edit/Create Template **************/
      
      
      
      
    }
    else if ($state.is("main.risk_factors.edit")) {
      
      $log.info('---Edit---');
      $log.info('State: ', $state);
      $log.info('State params: ', $stateParams);

      /************** Edit/Create Template **************/



    }
    else {

      $log.info('---View---');
      $log.info('State: ', $state);
      $log.info('State params: ', $stateParams);

      /************** View Template **************/
      
      
      
    }



    /* Helper functions */

    function getRisk_factor(id) {
      Risk_factors.get([id]).then(function(res) {
        $log.info('Risk_factor: ', res);
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
        
      });
    }


  }

})();
