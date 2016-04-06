(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('measurement_typesSingleController', measurement_typesSingleController);

  /** @ngInject */
  function measurement_typesSingleController(toastr,content, CARRE, SweetAlert, Measurement_types, $stateParams, uiGridGroupingConstants, $timeout, uiGridConstants, $state, $scope ) {
    var vm = this;
    
    var visibleFields = [
      // "type",      
      // "id",
      "has_measurement_type_name",
      "has_enumeration_values",
      "has_label",
      "has_datatype",
      "has_author",
      "has_reviewer",
      "has_external_unit"
    ];
    

    /* View Risk_element */
    vm.id = $stateParams.id;
    vm.current = {};
    vm.edit = $stateParams.edit;
    if (vm.id) getMeasurement_type(vm.id);


    //Handle events
    $scope.$on('measurement_type:save', function() {
      if (vm.current.id) {
        $state.go('main.measurement_types.view', {
          id: vm.id
        });
      }
      else $state.go('main.measurement_types.list');
    });
    $scope.$on('measurement_type:cancel', function() {
      if (vm.current.id) {
        $state.go('main.measurement_types.view', {
          id: vm.id
        });
      }
      else $state.go('main.measurement_types.list');
    });


    if ($state.is("main.measurement_types.create")) {
      vm.create = true;
      vm.current = {};
    }
    else if ($state.is("main.measurement_types.edit")) {}
    else {}



    /* Helper functions */

    function getMeasurement_type(id) {
      Measurement_types.get([id]).then(function(res) {
        if (res.data) {
          vm.current = res.data[0];
          vm.fields = visibleFields.map(function(field) {
            return {
              value: field,
              label: content.labelOf(field)
            };
          });
        }
        else $state.go('main.measurement_types.list');
      }, function(err) {
        console.error(err);
        $state.go('main.measurement_types.list');
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
          if (isConfirm) { CARRE.delete(vm.current.id).then(function() { $state.go('main.measurement_types.list'); }); }
        });
    };
    
  }

})();
