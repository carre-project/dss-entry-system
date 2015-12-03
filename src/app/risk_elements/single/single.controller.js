(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('risk_elementsSingleController', risk_elementsSingleController);

  /** @ngInject */
  function risk_elementsSingleController(toastr, content, Bioportal, Risk_elements, CARRE, SweetAlert,currentUser, $stateParams, $timeout, Pubmed, $state, $scope) {
    var vm = this;
    vm.user = currentUser;

    var visibleFields = [
      // "type",      
      // "id",
      "has_risk_element_name",
      "has_risk_element_identifier",
      "has_risk_element_type",
      "has_risk_element_modifiable_status",
      "has_risk_element_observable",
      "has_risk_element_observable_condition",
      "has_author",
      "has_reviewer"
    ];


    /* View Risk_element */
    vm.id = $stateParams.id;
    vm.current = {};
    vm.edit = $stateParams.edit;
    if (vm.id) getRisk_element(vm.id);


    //Handle events
    $scope.$on('risk_element:save', function() {
      if (vm.current.id) {
        $state.go('main.risk_elements.view', {
          id: vm.id
        });
      }
      else $state.go('main.risk_elements.list');
    });
    $scope.$on('risk_element:cancel', function() {
      if (vm.current.id) {
        $state.go('main.risk_elements.view', {
          id: vm.id
        });
      }
      else $state.go('main.risk_elements.list');
    });


    if ($state.is("main.risk_elements.create")) {
      vm.create = true;
      vm.current = {};
    }
    else if ($state.is("main.risk_elements.edit")) {}
    else {}



    /* Helper functions */

    function getRisk_element(id) {
      Risk_elements.get([id]).then(function(res) {
        if (res.data) {
          vm.current = res.data[0];
          vm.fields = visibleFields.map(function(field) {
            return {
              value: field,
              label: content.labelOf(field)
            };
          });
        }
        else $state.go('main.risk_elements.list');
      }, function(err) {
        console.error(err);
        $state.go('main.risk_elements.list');
      });
    }

    vm.deleteCurrent = function() {
      SweetAlert.swal({
          title: "Are you sure?",
          text: "Your will not be able to recover this element!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: true,
          closeOnCancel: true
        },
        function(isConfirm) {
          if (isConfirm) { CARRE.delete(vm.current.id).then(function() { $state.go('main.risk_elements.list'); }); }
        });
    };
  }

})();
