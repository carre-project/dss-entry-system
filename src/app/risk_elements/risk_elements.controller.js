(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('risk_elementsController', risk_elementsController);

  /** @ngInject */
  function risk_elementsController(toastr, Risk_elements, currentUser, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state, $log, content) {
    var vm = this; //controller as vm
    // currentUser is our user model;
    
    
    /************** List Template **************/
    
    var risk_elements = [];
    Risk_elements.get().then(function(res) {
      risk_elements = res.data;
      vm.mygrid.data = risk_elements;
      
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
        cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ui-sref="main.risk_elements.view({id:row.entity.id_label})"><i class="fa fa-eye"></i></button></div>',
        width: 60
      }];
    
    //show edit buttons
    if (currentUser.username) {
      vm.mygrid.columnDefs.push({
        field: 'Edit',
        enableFiltering: false,
        enableColumnMenu: false,
        cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ng-click="grid.appScope.risk_elements.setPubmed(grid, row, true)"><i class="fa fa-edit"></i></button></div>',
        width: 60
      });
    }
    




    /*Pubmed browser*/
    vm.setPubmed = function(grid, row, useApi) {

      vm.pubmedApi = useApi;
      var id = row ? row.entity.id : null;

      if (!id) {
        vm.selectedRisk_element = '';
        vm.pubmedArticle = '';
      }
      else if (vm.selectedRisk_element !== id) {
        vm.selectedRisk_element = id;
        vm.loading = Pubmed.fetch(id).then(function(res) {

          vm.pubmedArticle = res.data;

        });
      }
      else {
        vm.selectedRisk_element = '';
        vm.pubmedArticle = '';
      }
    };
    

  }
})();
