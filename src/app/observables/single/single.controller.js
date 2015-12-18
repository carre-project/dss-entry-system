(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('observablesSingleController', observablesSingleController);

  /** @ngInject */
  function observablesSingleController(toastr,content ,$scope, CARRE, Observables, SweetAlert, currentUser, $stateParams, uiGridGroupingConstants, $timeout, uiGridConstants, $state ) {
    var vm = this;


    var visibleFields=[
      // "type",      
      // "id",
      "has_observable_name",
      "has_observable_acronym",
      "has_observable_type",
      "has_observable_measurement_type",
      "has_author",
      "has_reviewer"
    ];

    /* View Observable */
    vm.id = $stateParams.id;
    vm.current = {};
    vm.edit = $stateParams.edit;
    if (vm.id) getObservable(vm.id);


    //Handle events
    $scope.$on('observable:save', function() {
      if (vm.current.id) {
        $state.go('main.observables.view', {
          id: vm.id
        });
      }
      else $state.go('main.observables.list');
    });
    $scope.$on('observable:cancel', function() {
      if (vm.current.id) {
        $state.go('main.observables.view', {
          id: vm.id
        });
      }
      else $state.go('main.observables.list');
    });


    if ($state.is("main.observables.create")) {
      vm.create = true;
      vm.current = {};
    }
    else if ($state.is("main.observables.edit")) {}
    else {}



    /* Helper functions */

    function getObservable(id) {
      Observables.get([id]).then(function(res) {
        if (res.data) {
          vm.current = res.data[0];
          vm.fields = visibleFields.map(function(field) {
            return {
              value: field,
              label: content.labelOf(field)
            };
          });
        }
        else $state.go('main.observables.list');
      }, function(err) {
        console.error(err);
        $state.go('main.observables.list');
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
          if (isConfirm) { CARRE.delete(vm.current.id).then(function() { $state.go('main.observables.list'); }); }
        });
    };


  }

})();
