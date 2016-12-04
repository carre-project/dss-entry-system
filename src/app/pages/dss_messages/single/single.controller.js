(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('dss_messagesSingleController', dss_messagesSingleController);

  /** @ngInject */
  function dss_messagesSingleController(content, DSS_messages, uiGridGroupingConstants, $scope, uiGridConstants, $state) {

    var vm = $scope;
    
    vm.id=$state.params.id;
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
    
    $scope.$on('dss_message:save', returnBack);
    $scope.$on('dss_message:cancel', returnBack);
    
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
