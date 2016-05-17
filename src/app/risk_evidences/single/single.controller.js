/*global jsep*/
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('risk_evidencesSingleController', risk_evidencesSingleController);

  /** @ngInject */
  function risk_evidencesSingleController( $state, $scope) {
    
    var vm = $scope;
    
    vm.id=$state.params.id;
    
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
    
    $scope.$on('citation:save', returnBack);
    $scope.$on('citation:cancel', returnBack);
    
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
