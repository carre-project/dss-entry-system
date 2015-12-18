/*global jsep*/
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('risk_evidencesSingleController', risk_evidencesSingleController);

  /** @ngInject */
  function risk_evidencesSingleController(toastr, content, Bioportal, Auth, Risk_evidences, CARRE,SweetAlert, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state, $scope) {
    var vm = this;
    var currentUser = Auth.getUser();
    vm.user = currentUser;

    var visibleFields = [
      // "type",
      // "id",
      "has_risk_factor",
      "has_risk_evidence_observable",
      "has_observable_condition",
      "has_risk_evidence_ratio_type",
      "has_risk_evidence_ratio_value",
      "has_confidence_interval_min",
      "has_confidence_interval_max",
      "is_adjusted_for",
      "has_risk_evidence_source",
      "has_author",
      "has_reviewer"
    ];



    /* View Risk_evidence */
    vm.id = $stateParams.id;
    vm.current = {};
    vm.edit = $stateParams.edit;
    if (vm.id) getRisk_evidence(vm.id);


    //Handle events
    $scope.$on('risk_evidence:save', function() {
      if (vm.current.id) {
        $state.go('main.risk_evidences.view', {
          id: vm.id
        });
      }
      else $state.go('main.risk_evidences.list');
    });
    $scope.$on('risk_evidence:cancel', function() {
      if (vm.current.id) {
        $state.go('main.risk_evidences.view', {
          id: vm.id
        });
      }
      else $state.go('main.risk_evidences.list');
    });


    if ($state.is("main.risk_evidences.create")) {
      vm.create = true;
      vm.current = {};
    }
    else if ($state.is("main.risk_evidences.edit")) {}
    else {}



    /* Helper functions */

    function getRisk_evidence(id) {
      Risk_evidences.get([id]).then(function(res) {
        if (res.data) {
          vm.current = res.data[0];
          vm.fields = visibleFields.map(function(field) {
            return {
              value: field,
              label: content.labelOf(field)
            };
          });

          vm.pubmedId = vm.current.has_risk_evidence_source_label;
        }
        else $state.go('404_error');
      }, function(err) {
        console.error(err);
        $state.go('main.risk_evidences.list');
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
          if (isConfirm) {
            CARRE.delete(vm.current.id).then(function() {
              $state.go('main.risk_evidences.list');
            });
          }
        });
    };

  }

})();
