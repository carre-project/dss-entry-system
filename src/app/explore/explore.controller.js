(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('ExploreController', ExploreController);

  /** @ngInject */
  function ExploreController($rootScope, $timeout, toastr, CARRE, $location, CONFIG, $scope, Risk_elements,$state,SweetAlert) {
    var vm = this;
    vm.minConnections=0;
    vm.ready=true;
    vm.risk_elements_selected=[];
    vm.setNewId=function(){
      vm.ready=false;
      $timeout(function(){
        vm.id=vm.risk_elements_selected;
        vm.ready=true;
      },100)
    }
    
    //init
    // vm.setNewId();
    
    //get risk elements
    Risk_elements.get().then(function(res) {
      vm.risk_elements = res.data.map(function(rl) {
          var obj={
            value: rl.id,
            label: rl.has_risk_element_name_label
          };
          return obj;
      });
    });
    
    
    
  }
})();
