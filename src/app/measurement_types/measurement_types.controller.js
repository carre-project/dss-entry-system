(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('measurement_typesController', measurement_typesController);

  /** @ngInject */
  function measurement_typesController(toastr, Measurement_types, currentUser, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state, content) {
    var vm = this; //controller as vm
    // currentUser is our user model;
    
    var visibleGridColumns=[
      'has_measurement_type_name',
      'has_datatype',
      'has_label',
      'has_enumeration_values'
      ];
    
    /************** List Template **************/
    
    var measurement_types = [];
    vm.gridLoading=Measurement_types.get().then(function(res) {
      measurement_types = res.data;
      vm.mygrid.data = measurement_types;
      
      console.log('Model response: ', res);
      //make the response available in the view
      vm.res = res;

      /* Reset columns */
      vm.mygrid.columnDefs = [];
      
      vm.mygrid.columnDefs.push({
        field: 'View',
        enableFiltering: false,
        enableColumnMenu: false,
        cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ui-sref="main.measurement_types.view({id:row.entity.id_label})"><i class="fa fa-eye"></i></button></div>',
        width: 60
      });

      //show edit buttons
      // if (currentUser.username) {
      //   vm.mygrid.columnDefs.push({
      //     field: 'Edit',
      //     enableFiltering: false,
      //     enableColumnMenu: false,
      //     cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ng-click="grid.appScope.measurement_types.setPubmed(grid, row, true)"><i class="fa fa-edit"></i></button></div>',
      //     width: 60
      //   });
      // }
      
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
