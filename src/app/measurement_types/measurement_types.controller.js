(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('measurement_typesController', measurement_typesController);

  /** @ngInject */
  function measurement_typesController(toastr, Measurement_types, currentUser, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state, $log, content) {
    var vm = this; //controller as vm
    // currentUser is our user model;
    
    
    /************** List Template **************/
    
    var measurement_types = [];
    Measurement_types.get(null, true).then(function(res) {
      measurement_types = res.data;
      vm.mygrid.data = measurement_types;
      
      $log.log('Model response: ',res);
      //make the response available in the view
      vm.res=res;
      //dynamic creation of the grid columns
      content.fields(res.fields).forEach((function(obj) {
        vm.mygrid.columnDefs.push(obj);
      }));
      

    });


    /* GRID STUFF */
    vm.mygrid=content.default;
    vm.mygrid.columnDefs = [
      {
        field: 'id_label',
        displayName: 'ID'
      },
      {
        field: 'View',
        enableFiltering: false,
        enableColumnMenu: false,
        cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ui-sref="main.measurement_types.view({id:row.entity.id_label})"><i class="fa fa-eye"></i></button></div>',
        width: 60
      }];
    
    //show edit buttons
    if (currentUser.username) {
      vm.mygrid.columnDefs.push({
        field: 'Edit',
        enableFiltering: false,
        enableColumnMenu: false,
        cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ng-click="grid.appScope.measurement_types.setPubmed(grid, row, true)"><i class="fa fa-edit"></i></button></div>',
        width: 60
      });
    }
    




    /*Pubmed browser*/
    vm.setPubmed = function(grid, row, useApi) {

      vm.pubmedApi = useApi;
      var id = row ? row.entity.id : null;

      if (!id) {
        vm.selectedMeasurement_type = '';
        vm.pubmedArticle = '';
      }
      else if (vm.selectedMeasurement_type !== id) {
        vm.selectedMeasurement_type = id;
        vm.loading = Pubmed.fetch(id).then(function(res) {

          vm.pubmedArticle = res.data;

        });
      }
      else {
        vm.selectedMeasurement_type = '';
        vm.pubmedArticle = '';
      }
    };
    

  }
})();
