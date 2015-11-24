(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('citationsSingleController', citationsSingleController);

  /** @ngInject */
  function citationsSingleController(toastr,content ,Citations, currentUser, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state){
    var vm = this;



    /* View Citation */
    vm.id = $stateParams.id;
    vm.edit = $stateParams.edit;
    if (vm.id) getCitation(vm.id);

    if ($state.is("main.citations.create")) {
      
      console.info('---Create---');
      console.info('State: ', $state);
      console.info('State params: ', $stateParams);

      /************** Edit/Create Template **************/
      
      
      
      
    }
    else if ($state.is("main.citations.edit")) {
      
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

    function getCitation(id) {
      
      Citations.get([id]).then(function(res) {
        console.info('Citation: ', res);
        vm.current = res.data[0];
        vm.fields=res.fields.map(function(field){
          return {
            value:field,
            label:content.labelOf(field)
          }
        });
        vm.pubmedId=vm.current.has_citation_pubmed_identifier[0];
        // vm.loading = Pubmed.fetch(vm.current.has_citation_pubmed_identifier).then(function(res) {
        //   vm.pubmedArticle = res.data;
        //   console.info('Pubmed Article: '+id, res);
        // });
        
      });
    }


  }

})();
