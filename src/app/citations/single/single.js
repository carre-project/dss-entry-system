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

    /*View Citation SINLGE Profile*/

    // //this is the current citation loaded
    // function getCitation(id, citations) {
    //   if (!id) return {};
    //   citations.forEach(function(citation) {
    //     if (citation.id.indexOf(vm.id) > -1) return citation;
    //   });
    //   return {};
    // }
    // vm.currentCitation = $stateParams.id ? getCitation($stateParams.id, citations) : {};

    // //if it is edited
    // vm.editMode = !!$stateParams.edit;
  }
})();
