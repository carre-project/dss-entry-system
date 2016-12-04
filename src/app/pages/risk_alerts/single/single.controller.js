/*global jsep*/
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('risk_alertsSingleController', risk_alertsSingleController);

  /** @ngInject */
  function risk_alertsSingleController( $state, $scope, CARRE) {
    
    var vm = $scope;
    
    vm.id=$state.params.id;
    vm.pubmedId=$state.params.pubmedId;
    
    // init process 
    if ($state.includes("**.create")) {
      vm.mode = 'create';
    } else if (vm.id) {
      if($state.includes("**.view")){
        vm.mode='view';
      } else if($state.includes("**.edit")){
        vm.mode='edit';
      } else {
        $state.go('404_error');
        return;
      }
    }
    
    $scope.$on('risk_alert:save', returnBack);
    $scope.$on('risk_alert:cancel', returnBack);
    
    function returnBack() {
      console.log('called',vm.id);
      if (vm.id) {
        $state.go('^.view', {
          id: vm.id
        });
      }
      else $state.go('^.list');
    }
    

  }

})();
