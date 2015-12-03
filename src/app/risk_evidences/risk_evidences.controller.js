(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('risk_evidencesController', risk_evidencesController);

  /** @ngInject */
  function risk_evidencesController(toastr, Risk_evidences, currentUser, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state, content) {
    var vm = this; //controller as vm
    // currentUser is our user model;


    var visibleGridColumns = [
      'has_risk_factor',
      'has_observable_condition',
      // 'has_risk_evidence_source',
      // 'has_risk_evidence_ratio_type',
      'has_risk_evidence_ratio_value',
      // 'has_confidence_interval_min',
      // 'has_confidence_interval_max'
    ];

    /************** List Template **************/

    var risk_evidences = [];
    vm.gridLoading = Risk_evidences.get().then(function(res) {

      risk_evidences = res.data;
      vm.mygrid.data = risk_evidences;

      console.log('Model response: ', res);
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

    /* GRID Default options */
    vm.mygrid = content.default;


    /*Pubmed browser*/
    vm.setPubmed = function(grid, row, useApi) {
      vm.pubmedApi = useApi;
      var id = row ? row.entity.id : null;
      if (!id) {
        vm.selectedRisk_evidence = '';
        vm.pubmedArticle = '';
      }
      else if (vm.selectedRisk_evidence !== id) {
        vm.selectedRisk_evidence = id;
        vm.loading = Pubmed.fetch(id).then(function(res) {
          vm.pubmedArticle = res.data;
        });
      }
      else {
        vm.selectedRisk_evidence = '';
        vm.pubmedArticle = '';
      }
    };


  }
})();
