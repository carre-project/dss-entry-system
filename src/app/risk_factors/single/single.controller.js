(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('risk_factorsSingleController', risk_factorsSingleController);

  /** @ngInject */
  function risk_factorsSingleController(toastr,content ,Bioportal, Risk_factors, currentUser, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state ) {
    var vm = this;


    var visibleFields=[
      // "type",      
      "id",
      "has_risk_factor_source",
      "has_risk_factor_target",
      "has_risk_factor_association_type",
      "has_author",
      "has_reviewer"
    ];


    /* View Risk_factor */
    vm.id = $stateParams.id;
    vm.edit = $stateParams.edit;
    if (vm.id) getRisk_factor(vm.id);

    if ($state.is("main.risk_factors.create")) {
      
      console.info('---Create---');
      console.info('State: ', $state);
      console.info('State params: ', $stateParams);

      /************** Edit/Create Template **************/
      
      
      
      
    }
    else if ($state.is("main.risk_factors.edit")) {
      
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

    function getRisk_factor(id) {
      Risk_factors.get([id]).then(function(res) {
        console.info('Risk_factor: ', res);
        vm.current = res.data[0];
        vm.fields=visibleFields.map(function(field){
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
