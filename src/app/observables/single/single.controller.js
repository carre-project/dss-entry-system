(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('observablesSingleController', observablesSingleController);

  /** @ngInject */
  function observablesSingleController(toastr,content ,$scope, CARRE, Observables, SweetAlert, $stateParams, uiGridGroupingConstants, $timeout, uiGridConstants, $state ) {
    
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
    
    $scope.$on('observable:save', returnBack);
    $scope.$on('observable:cancel', returnBack);
    
    function returnBack() {
      console.log('called',vm.id)
      if (vm.id) {
        $state.go('^.view', {
          id: vm.id
        });
      }
      else $state.go('^.list');
    }
    

  }

})();
