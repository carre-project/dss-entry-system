(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('citationsEditController', citationsEditController);

  /** @ngInject */
  function citationsEditController(toastr, Citations, currentUser, citationsArray, $stateParams, $log) {

    var vm = this; 
    vm.id=$stateParams.id;
    // currentUser is our user model;
    vm.currentCitation=citationsArray.filter(function(cite){
      return cite.id===vm.id;
    })

    $log.info($stateParams.id);

  }
})();
