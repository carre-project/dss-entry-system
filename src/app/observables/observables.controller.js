(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('observablesController', observablesController);

  /** @ngInject */
  function observablesController(toastr, Observables, currentUser, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state, $log, content) {
    var vm = this; //controller as vm
    // currentUser is our user model;
    
    
    /************** List Template **************/
    
    var observables = [];
    Observables.get(null, true).then(function(res) {
      observables = res.data;
      vm.mygrid.data = observables;
      
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
        cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ui-sref="main.observables.view({id:row.entity.id_label})"><i class="fa fa-eye"></i></button></div>',
        width: 60
      }];
    
    //show edit buttons
    if (currentUser.username) {
      vm.mygrid.columnDefs.push({
        field: 'Edit',
        enableFiltering: false,
        enableColumnMenu: false,
        cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ng-click="grid.appScope.observables.setPubmed(grid, row, true)"><i class="fa fa-edit"></i></button></div>',
        width: 60
      });
    }
    



    /*Pubmed browser*/
    vm.setPubmed = function(grid, row, useApi) {

      vm.pubmedApi = useApi;
      var id = row ? row.entity.id : null;

      if (!id) {
        vm.selectedObservable = '';
        vm.pubmedArticle = '';
      }
      else if (vm.selectedObservable !== id) {
        vm.selectedObservable = id;
        vm.loading = Pubmed.fetch(id).then(function(res) {

          vm.pubmedArticle = res.data;

        });
      }
      else {
        vm.selectedObservable = '';
        vm.pubmedArticle = '';
      }
    };
    

  }
})();
