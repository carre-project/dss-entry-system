(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('citationsSingleController', citationsSingleController);

  /** @ngInject */
  function citationsSingleController(toastr, Citations, currentUser, citationsArray, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state,$log) {
    var vm = this; 
    vm.id=$stateParams.id;
    // currentUser is our user model;
    vm.currentCitation=citationsArray.filter(function(cite){
      return cite.id===vm.id;
    })

    $log.info($stateParams.id);
  }
})();
