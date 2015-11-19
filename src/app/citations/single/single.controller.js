(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('citationsSingleController', citationsSingleController);

  /** @ngInject */
  function citationsSingleController(toastr,content ,Citations, currentUser, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state, $log) {
    var vm = this;



    /* View Citation */
    vm.id = $stateParams.id;
    vm.edit = $stateParams.edit;
    if (vm.id) getCitation(vm.id);

    if ($state.is("main.citations.create")) {
      
      $log.info('---Create---');
      $log.info('State: ', $state);
      $log.info('State params: ', $stateParams);

      /************** Edit/Create Template **************/
      
      
      
      
    }
    else if ($state.is("main.citations.edit")) {
      
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

    function getCitation(id) {
      Citations.get(id, true).then(function(res) {
        $log.info('Citation: ', res);
        vm.current = res.data[0];
        vm.fields=res.fields.map(function(field){
          return {
            value:field,
            label:content.labelOf(field)
          }
        });
        
        vm.loading = Pubmed.fetch(id).then(function(res) {
          vm.pubmedArticle = res.data;
          $log.info('Pubmed Article: '+id, res);
        });
        
      });
    }


  }

})();
