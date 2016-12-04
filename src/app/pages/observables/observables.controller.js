(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('observablesController', observablesController);

  /** @ngInject */
  function observablesController(toastr,currentUser, Observables,CONFIG, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state, content,VisibleFields) {
    var vm = this; //controller as vm
    
    
    /************** List Template **************/
    var visibleGridColumns=VisibleFields('observable','list');
    
    var observables = [];
    vm.gridLoading=Observables.get().then(function(res) {
      observables = res.data;
      vm.mygrid.data = observables;
      
      console.log('Model response: ', res);
      //make the response available in the view
      vm.res = res;

      /* Reset columns */
      vm.mygrid.columnDefs = [];
      
      
      vm.mygrid.columnDefs.push({
        field: 'View',
        enableFiltering: false,
        enableColumnMenu: false,
        cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ui-sref="main.observables.view({id:row.entity.id_label})"><i class="fa fa-eye"></i></button></div>',
        width: 60
      });

      //show edit buttons
      if (currentUser.username) {
        vm.mygrid.columnDefs.push({
          field: 'Edit',
          enableFiltering: false,
          enableColumnMenu: false,
          cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ui-sref="main.observables.edit({id:row.entity.id_label})"><i class="fa fa-edit"></i></button></div>',
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

  }
})();
