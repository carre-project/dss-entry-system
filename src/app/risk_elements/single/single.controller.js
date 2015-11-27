(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('risk_elementsSingleController', risk_elementsSingleController);

  /** @ngInject */
  function risk_elementsSingleController(toastr, content, Bioportal, Risk_elements, currentUser, $stateParams, $timeout, Pubmed, $state,$scope) {
    var vm = this;
    vm.user=currentUser;
    
    
    /* View Risk_element */
    vm.id = $stateParams.id;
    vm.current = {};
    vm.edit = $stateParams.edit;
    if (vm.id) getRisk_element(vm.id);
    
    
    //Handle events
    $scope.$on('risk_element:save',function(){
      $state.go('main.risk_elements.view',{id:vm.id});
    });
    $scope.$on('risk_element:cancel',function(){
      if(vm.current.id) $state.go('main.risk_elements.view',{id:vm.id});
      else $state.go('main.risk_elements.list');
    });


    if ($state.is("main.risk_elements.create")) {
      vm.create = true;
      vm.current = {};
    } else if ($state.is("main.risk_elements.edit")) {} else {}



    /* Helper functions */

    function getRisk_element(id) {
      Risk_elements.get([id]).then(function(res) {
        if (res.data) {
          vm.current = res.data[0];
          vm.fields = res.fields.map(function(field) {
            return {
              value: field,
              label: content.labelOf(field)
            };
          });
        } else $state.go('404_error');
      }, function(err) {
        console.error(err);
        $state.go('main.risk_elements.list');
      });
    }


  }

})();
