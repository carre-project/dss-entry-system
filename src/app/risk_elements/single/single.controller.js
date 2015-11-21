(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('risk_elementsSingleController', risk_elementsSingleController);

  /** @ngInject */
  function risk_elementsSingleController(toastr,content ,Bioportal, Risk_elements, currentUser, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state, $log) {
    var vm = this;



    /* View Risk_element */
    vm.id = $stateParams.id;
    vm.edit = $stateParams.edit;
    if (vm.id) getRisk_element(vm.id);

    if ($state.is("main.risk_elements.create")) {
      
      $log.info('---Create---');
      $log.info('State: ', $state);
      $log.info('State params: ', $stateParams);

      /************** Edit/Create Template **************/
      
      
      
      
    }
    else if ($state.is("main.risk_elements.edit")) {
      
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

    function getRisk_element(id) {
      Risk_elements.get([id]).then(function(res) {
        $log.info('Risk_element: ', res);
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
        var id=vm.current.has_risk_element_identifier_label.toUpperCase();
        vm.loading = Bioportal.search(id,options).then(function(res) {
          // console.log(res);
          //filter data that have cui, and the title match incase
          vm.bioportalData = res.data.collection.filter(function(obj){
            if(!obj.cui) return false;
            if(!obj.prefLabel.toLowerCase().indexOf(id)) return false;
            return true;
          });
        });
        
      });
    }


  }

})();
