(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('observablesSingleController', observablesSingleController);

  /** @ngInject */
  function observablesSingleController(toastr,content ,Bioportal, Observables, currentUser, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state, $log) {
    var vm = this;



    /* View Observable */
    vm.id = $stateParams.id;
    vm.edit = $stateParams.edit;
    if (vm.id) getObservable(vm.id);

    if ($state.is("main.observables.create")) {
      
      $log.info('---Create---');
      $log.info('State: ', $state);
      $log.info('State params: ', $stateParams);

      /************** Edit/Create Template **************/
      
      
      
      
    }
    else if ($state.is("main.observables.edit")) {
      
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

    function getObservable(id) {
      Observables.get([id]).then(function(res) {
        $log.info('Observable: ', res);
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
