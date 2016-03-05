(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('ExploreController', ExploreController);

  /** @ngInject */
  function ExploreController($rootScope, $timeout, toastr, CARRE, $location, CONFIG, $scope, Risk_elements,$state,SweetAlert) {
    var vm = this;
    vm.minConnections=0;
    vm.setNewId=function(){
      vm.ready=false;
      $timeout(function(){
        vm.id=vm.id_input;
        vm.ready=true;
      },100)
    }
    
    //init
    vm.setNewId();
    
  }
})();
