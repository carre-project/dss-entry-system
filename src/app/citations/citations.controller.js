(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('citationsController', citationsController);

  /** @ngInject */
  function citationsController(toastr, Citations,currentUser, $stateParams, CONFIG, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state, content) {
    var vm = this; //controller as vm
    
    
    var visibleGridColumns=[
      'has_citation_pubmed_identifier',
      'has_citation_summary',
      'has_citation_source_type',
      'has_citation_source_level'
    ];
    
    /************** List Template **************/
    
    var citations = [];
    vm.gridLoading=Citations.get().then(function(res) {
      citations = res.data;
      vm.mygrid.data = citations;
      
      console.log('Model response: ', res);
      //make the response available in the view
      vm.res = res;

      /* Reset columns */
      vm.mygrid.columnDefs = [];
      
      vm.mygrid.columnDefs.push({
        field: 'View',
        enableFiltering: false,
        enableColumnMenu: false,
        cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ui-sref="main.citations.view({id:row.entity.id_label})"><i class="fa fa-eye"></i></button></div>',
        width: 60
      });

      //show edit buttons
      if (currentUser.username) {
        vm.mygrid.columnDefs.push({
          field: 'Edit',
          enableFiltering: false,
          enableColumnMenu: false,
          cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ui-sref="main.citations.edit({id:row.entity.id_label})"><i class="fa fa-edit"></i></button></div>',
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
