(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('measurement_typesSingleController', measurement_typesSingleController);

  /** @ngInject */
  function measurement_typesSingleController(toastr,content, CARRE, SweetAlert, Measurement_types, $stateParams, uiGridGroupingConstants, $timeout, uiGridConstants, $state, $scope ) {
    
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
    
    $scope.$on('measurement_type:save', returnBack);
    $scope.$on('measurement_type:cancel', returnBack);
    
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
