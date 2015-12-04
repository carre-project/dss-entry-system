(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('risk_factorsSingleController', risk_factorsSingleController);

  /** @ngInject */
  function risk_factorsSingleController(toastr, content, Bioportal, Risk_factors, currentUser, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state) {
    var vm = this;


    var visibleFields = [
      // "type",      
      // "id",
      "has_risk_factor_source",
      "has_risk_factor_target",
      "has_risk_factor_association_type",
      "has_author",
      "has_reviewer"
    ];


    /* View Risk_factor */
    vm.id = $stateParams.id;
    vm.edit = $stateParams.edit;
    if (vm.id) {
      getRisk_factor(vm.id);
      loadRiskEvidences(vm.id);
    }


    /* Helper functions */

    function getRisk_factor(id) {
      Risk_factors.get([id]).then(function(res) {
        console.info('Risk_factor: ', res);
        vm.current = res.data[0];
        vm.fields = visibleFields.map(function(field) {
          return {
            value: field,
            label: content.labelOf(field)
          }
        });

        var options = {
          display_context: 'false',
          require_exact_match: 'false',
          include: 'prefLabel,definition,cui',
          display_links: 'true',
          require_definitions: 'false'
        };

      });
    }




    var visibleGridColumns = [
      'has_risk_factor',
      'has_observable_condition_text',
      // 'has_risk_evidence_source',
      // 'has_risk_evidence_ratio_type',
      'has_risk_evidence_ratio_value',
      // 'has_confidence_interval_min',
      // 'has_confidence_interval_max'
    ];



    /************** List Template **************/

    var risk_evidences = [];

    function loadRiskEvidences(id) {
      
      vm.gridLoading = Risk_factors.risk_evidences(id).then(function(res) {

        vm.mygrid.data = res.data;

        //make the response available in the view
        vm.res = res;

        /* Reset columns */
        vm.mygrid.columnDefs = [];
        //dynamic creation of the grid columns
        content.fields(res.fields, visibleGridColumns).forEach((function(obj) {
          vm.mygrid.columnDefs.push(obj);
        }));

        vm.mygrid.columnDefs.push({
          field: 'id_label',
          displayName: 'ID',
          visible: false
        });

        vm.mygrid.columnDefs.push({
          field: 'View',
          enableFiltering: false,
          enableColumnMenu: false,
          cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ui-sref="main.risk_evidences.view({id:row.entity.id_label})"><i class="fa fa-eye"></i></button></div>',
          width: 60
        });

        //show edit buttons
        // if (currentUser.username) {
        //   vm.mygrid.columnDefs.push({
        //     field: 'Edit',
        //     enableFiltering: false,
        //     enableColumnMenu: false,
        //     cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ng-click="grid.appScope.risk_evidences.setPubmed(grid, row, true)"><i class="fa fa-edit"></i></button></div>',
        //     width: 60
        //   });
        // }

      });
    }

    /* GRID Default options */
    vm.mygrid = content.default;



  }

})();
