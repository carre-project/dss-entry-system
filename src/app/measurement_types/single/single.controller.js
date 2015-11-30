(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('measurement_typesSingleController', measurement_typesSingleController);

  /** @ngInject */
  function measurement_typesSingleController(toastr,content ,Bioportal, Measurement_types, currentUser, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state ) {
    var vm = this;


    var visibleFields=[
      // "type",      
      "id",
      "has_measurement_type_name",
      "has_datatype",
      "has_label",
      "has_enumeration_values",
      "has_author",
      "has_reviewer"
    ];


    /* View Measurement_type */
    vm.id = $stateParams.id;
    vm.edit = $stateParams.edit;
    if (vm.id) getMeasurement_type(vm.id);

    if ($state.is("main.measurement_types.create")) {
      
      console.info('---Create---');
      console.info('State: ', $state);
      console.info('State params: ', $stateParams);

      /************** Edit/Create Template **************/
      
      
      
      
    }
    else if ($state.is("main.measurement_types.edit")) {
      
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

    function getMeasurement_type(id) {
      Measurement_types.get([id]).then(function(res) {
        console.info('Measurement_type: ', res);
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
