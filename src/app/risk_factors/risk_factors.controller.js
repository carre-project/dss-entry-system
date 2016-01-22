(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('risk_factorsController', risk_factorsController);

  /** @ngInject */
  function risk_factorsController(toastr, Risk_factors,currentUser, CONFIG, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state, content) {
    var vm = this; //controller as vm
    
    
    var visibleGridColumns=[
      'has_risk_factor_source',
      'has_risk_factor_target',
      'has_risk_factor_association_type'
    ];
    
    /************** List Template **************/
    
    var risk_factors = [];
    vm.gridLoading=Risk_factors.get().then(function(res) {
      risk_factors = res.data;
      vm.mygrid.data = risk_factors;
      
      console.log('Model response: ', res);
      //make the response available in the view
      vm.res = res;

      /* Reset columns */
      vm.mygrid.columnDefs = [];
      
      
      vm.mygrid.columnDefs.push({
        field: 'View',
        enableFiltering: false,
        enableColumnMenu: false,
        cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ui-sref="main.risk_factors.view({id:row.entity.id_label})"><i class="fa fa-eye"></i></button></div>',
        width: 60
      });

      //show edit buttons
      if (currentUser.username) {
        vm.mygrid.columnDefs.push({
          field: 'Edit',
          enableFiltering: false,
          enableColumnMenu: false,
          cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ui-sref="main.risk_factors.edit({id:row.entity.id_label})"><i class="fa fa-edit"></i></button></div>',
          width: 60
        });
      }
      
      //dynamic creation of the grid columns
      content.fields(res.fields, visibleGridColumns).forEach((function(obj) {
        vm.mygrid.columnDefs.push(obj);
      }));

      vm.mygrid.columnDefs.push({
        field: 'id_label',
        displayName: 'ID',
        visible: false
      });


    });

    /* GRID Default options */
    vm.mygrid = content.default;


    /*Pubmed browser*/
    vm.setPubmed = function(grid, row, useApi) {

      vm.pubmedApi = useApi;
      var id = row ? row.entity.id : null;

      if (!id) {
        vm.selectedRisk_factor = '';
        vm.pubmedArticle = '';
      }
      else if (vm.selectedRisk_factor !== id) {
        vm.selectedRisk_factor = id;
        vm.loading = Pubmed.fetch(id).then(function(res) {

          vm.pubmedArticle = res.data;

        });
      }
      else {
        vm.selectedRisk_factor = '';
        vm.pubmedArticle = '';
      }
    };
    

  }
})();
