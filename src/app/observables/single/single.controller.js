(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('observablesSingleController', observablesSingleController);

  /** @ngInject */
  function observablesSingleController(toastr,content ,Bioportal, Observables, currentUser, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state ) {
    var vm = this;


    var visibleFields=[
      // "type",      
      "id",
      "has_observable_name",
      "has_observable_acronym",
      "has_observable_type",
      "has_observable_measurement_type",
      "has_author",
      "has_reviewer"
    ];

    /* View Observable */
    vm.id = $stateParams.id;
    vm.edit = $stateParams.edit;
    if (vm.id) getObservable(vm.id);

    if ($state.is("main.observables.create")) {
      
      console.info('---Create---');
      console.info('State: ', $state);
      console.info('State params: ', $stateParams);

      /************** Edit/Create Template **************/
      
      
      
      
    }
    else if ($state.is("main.observables.edit")) {
      
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

    function getObservable(id) {
      Observables.get([id]).then(function(res) {
        console.info('Observable: ', res);
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
