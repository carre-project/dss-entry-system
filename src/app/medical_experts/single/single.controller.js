(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('medical_expertsSingleController', medical_expertsSingleController);

  /** @ngInject */
  function medical_expertsSingleController(toastr, content, Bioportal, Medical_experts, CARRE, SweetAlert,currentUser, $stateParams, $timeout, Pubmed, $state, $scope) {
    var vm = this;
    vm.user = currentUser;

    var visibleFields = [
      // "type",      
      // "id",
      "has_medical_expert_name",
      "has_medical_expert_identifier",
      "has_medical_expert_type",
      "has_medical_expert_modifiable_status",
      "has_medical_expert_observable",
      "has_medical_expert_observable_condition",
      "includes_medical_expert",
      "has_author",
      "has_reviewer"
    ];


    /* View Risk_element */
    vm.id = $stateParams.id;
    vm.current = {};
    vm.edit = $stateParams.edit;
    if (vm.id) getRisk_element(vm.id);


    //Handle events
    $scope.$on('medical_expert:save', function() {
      if (vm.current.id) {
        $state.go('main.medical_experts.view', {
          id: vm.id
        });
      }
      else $state.go('main.medical_experts.list');
    });
    $scope.$on('medical_expert:cancel', function() {
      if (vm.current.id) {
        $state.go('main.medical_experts.view', {
          id: vm.id
        });
      }
      else $state.go('main.medical_experts.list');
    });


    if ($state.is("main.medical_experts.create")) {
      vm.create = true;
      vm.current = {};
    }
    else if ($state.is("main.medical_experts.edit")) {}
    else {}



    /* Helper functions */

    function getRisk_element(id) {
      Medical_experts.get([id]).then(function(res) {
        if (res.data) {
          vm.current = res.data[0];
          vm.fields = visibleFields.map(function(field) {
            return {
              value: field,
              label: content.labelOf(field)
            };
          });
        }
        else $state.go('main.medical_experts.list');
      }, function(err) {
        console.error(err);
        $state.go('main.medical_experts.list');
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
          if (isConfirm) { CARRE.delete(vm.current.id).then(function() { $state.go('main.medical_experts.list'); }); }
        });
    };
  }

})();
