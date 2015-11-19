(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('citationsController', citationsController);

  /** @ngInject */
  function citationsController(toastr, Citations, currentUser, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state, $log, contentGrid) {
    var vm = this; //controller as vm
    // currentUser is our user model;
    
    
    /************** List Template **************/
    
    var citations = [];
    Citations.get(null, true).then(function(res) {
      citations = res.data;
      vm.mygrid.data = citations;
      
      $log.info('Model response: ',res);
      
      //dynamic creation of the grid columns
      contentGrid.fields(res.fields).forEach((function(obj) {
        vm.mygrid.columnDefs.push(obj);
      }));
      

      //show edit buttons
      if (currentUser.username) {
        vm.mygrid.columnDefs.push({
          field: 'Edit',
          enableFiltering: false,
          enableColumnMenu: false,
          cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ng-click="grid.appScope.citations.setPubmed(grid, row, true)"><i class="fa fa-edit"></i></button></div>',
          width: 60
        });
      }

    });


    /* GRID STUFF */
    vm.mygrid=contentGrid.default;
    vm.mygrid.columnDefs = [{
      field: 'id',
      displayName: 'Id'
    }];
    // vm.mygrid.onRegisterApi = function(api) {
    //   //grid callbacks

    //   // api.selection.on.rowSelectionChanged(null, function(row) {
    //   //   vm.setPubmed(null,row);
    //   // });
    // };






    /*Pubmed browser*/
    vm.setPubmed = function(grid, row, useApi) {

      vm.pubmedApi = useApi;
      var id = row ? row.entity.id : null;

      if (!id) {
        vm.selectedCitation = '';
        vm.pubmedArticle = '';
      }
      else if (vm.selectedCitation !== id) {
        vm.selectedCitation = id;
        vm.loading = Pubmed.fetch(id).then(function(res) {

          vm.pubmedArticle = res.data;

        });
      }
      else {
        vm.selectedCitation = '';
        vm.pubmedArticle = '';
      }
    };
    

  }
})();
