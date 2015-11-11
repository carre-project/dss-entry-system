(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('citationsController', citationsController);

  /** @ngInject */
  function citationsController(toastr, Citations,citations , currentUser, citationsArray, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state) {
    var c = this; //controller as c
    // currentUser is our user model;

    // var citations = [];



    /*Pubmed browser*/
    c.setPubmed = function(grid, row, useApi) {
      c.pubmedApi = useApi;
      var id = row ? row.entity.id : null;
      // console.log(id);
      if (!id) {
        c.selectedCitation = '';
        c.pubmedArticle = '';
      }
      else if (c.selectedCitation !== id) {
        c.selectedCitation = id;
        c.loading = Pubmed.fetch(id).then(function(res) {
          // console.log(res);
          c.pubmedArticle = res.data;
        })
      }
      else {
        c.selectedCitation = '';
        c.pubmedArticle = '';
      }
    }


    // var citation='<http://carre.kmi.open.ac.uk/citations/15385656>';
    // if(currentUser){
    //   Citations.get().success(function(data) {


    //       console.log('Raw Data: ',data); 

    //       // vm.queryResult={
    //       //   'error': !(data instanceof Array),
    //       //   'data': data
    //       // }
    //   });
    // }

    /* GRID STUFF */
    c.mygrid = {};
    c.mygrid.data = citations;
    c.mygrid.onRegisterApi = function(api) {
      //grid callbacks

      // api.selection.on.rowSelectionChanged(null, function(row) {
      //   c.setPubmed(null,row);
      // });
    };
    c.mygrid.paginationPageSizes = [10, 50, 100];
    c.mygrid.paginationPageSize = 10;
    c.mygrid.enableColumnResizing = true;
    c.mygrid.enableFiltering = true;
    c.mygrid.allowCellFocus = true;
    c.mygrid.enableGridMenu = true;
    c.mygrid.multiSelect = true;
    c.mygrid.enableRowSelection = true;
    // c.mygrid.enableFullRowSelection  = true;
    c.mygrid.enableColumnMenus = true;
    c.mygrid.showGridFooter = true;
    c.mygrid.showColumnFooter = true;
    c.mygrid.fastWatch = true;
    c.mygrid.columnDefs = [{
        name: 'id',
        displayName: 'Pubmed',
        width: 100
      }, {
        name: 'has_citation_source_type',
        displayName: 'Source Type',
        enableCellEdit: true,
        filter: {
          type: uiGridConstants.filter.SELECT,
          selectOptions: citations.reduce(function(arr, obj) {
            if (arr.indexOf(obj.has_citation_source_type) === -1) arr.push({
              label: obj.has_citation_source_type,
              value: obj.has_citation_source_type
            });
            return arr;
          }, [])
        }
      }, {
        name: 'has_citation_source_level',
        displayName: 'Source Level',
        enableCellEdit: true,
        filter: {
          type: uiGridConstants.filter.SELECT,
          selectOptions: [{
            value: 0,
            label: '0'
          }, {
            value: 1,
            label: '1'
          }, {
            value: 2,
            label: '2'
          }, {
            value: 3,
            label: '3'
          }]
        }
      }, {
        field: 'Iframe',
        enableFiltering: false,
        enableColumnMenu: false,
        cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ng-click="grid.appScope.citations.setPubmed(grid, row)"><i class="fa fa-eye"></i></button></div>',
        width: 60
      }, {
        field: 'API',
        enableFiltering: false,
        enableColumnMenu: false,
        cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ng-click="grid.appScope.citations.setPubmed(grid, row, true)"><i class="fa fa-eye"></i></button></div>',
        width: 60
      }
      // ,{
      //   name: 'has_author_label',
      //   displayName: 'CARRE Author',
      //   // enableCellEdit: true,
      //   width: 150,
      //   cellTooltip: function(row, col) {
      //     return row.entity.has_author;
      //   }
      // }, {
      //   name: 'has_reviewer',
      //   displayName: 'CARRE Reviewers',
      //   // enableCellEdit: true,
      //   width: 190,
      //   cellTooltip: function(row, col) {
      //     return row.entity.has_reviewer;
      //   }
      // }
    ];
    
    //show edit buttons
    if(currentUser.username){
      c.mygrid.columnDefs.push({
        field: 'Edit',
        enableFiltering: false,
        enableColumnMenu: false,
        cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ng-click="grid.appScope.citations.setPubmed(grid, row, true)"><i class="fa fa-edit"></i></button></div>',
        width: 60
      });
    }
    
    
    
    
    
    /*View Citation Profile*/
    
    
    

  }
})();
