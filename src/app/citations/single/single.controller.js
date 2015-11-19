(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('citationsSingleController', citationsSingleController);

  /** @ngInject */
  function citationsSingleController(toastr, Citations, currentUser, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state,$log) {
    var vm = this; 
    
    
    $log.info('State: ',$state);
    $log.info('State params: ',$stateParams);
    
    /* View Citation */
    vm.id=$stateParams.id;
    vm.edit=$stateParams.edit;
    
    var citation = [];
    
    if($state.is("main.citations.create")){
      //create
      
    } else if($state.is("main.citations.edit")){
      //edit
      
    } else { 
      //view
      
    }
    
    function getCitation(){
      
      Citations.get('', true).then(function(res) {
  
      /************** View Template **************/
      
      
      $log.info('Citation: ',res);
      
      
      
      
      /************** Edit/Create Template **************/
      
      
      
      
      });

    }
    
    
    
    
  }
  
})();
