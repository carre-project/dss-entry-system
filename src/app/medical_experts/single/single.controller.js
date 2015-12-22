(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('medical_expertsSingleController', medical_expertsSingleController);

  /** @ngInject */
  function medical_expertsSingleController(toastr, content, Bioportal, Medical_experts, CARRE, SweetAlert, $stateParams, $timeout, Pubmed, $state, $scope) {
    var vm = this;
    
    var visibleFields = [
      "has_firstname",
      "has_lastname",
      "has_medical_specialty_identifier",
      "has_medical_position",
      "has_short_cv",
      "has_personal_page_url",
      "has_user_graph"
    ];


    /* View Risk_element */
    vm.id = $stateParams.id;
    vm.current = {};
    if (vm.id) getMedical_expert(vm.id);




    /* Helper functions */

    function getMedical_expert(id) {
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

  }

})();
