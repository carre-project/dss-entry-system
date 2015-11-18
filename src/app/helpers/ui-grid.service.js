angular.module('CarreEntrySystem').service('contentGrid', function() {

  //pass the Bioportal supported options to override the default 
  function getModelFields(schema){
    

    var columnDefs = [{
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
      
    return columnDefs;
    
  }
  
  function getDefaultGridProperties(){
    
      /* GRID STUFF */
      var grid = {};
      grid.paginationPageSizes = [10, 50, 100];
      grid.paginationPageSize = 10;
      grid.enableColumnResizing = true;
      grid.enableFiltering = true;
      grid.allowCellFocus = true;
      grid.enableGridMenu = true;
      grid.multiSelect = true;
      grid.enableRowSelection = true;
      // grid.enableFullRowSelection  = true;
      grid.enableColumnMenus = true;
      grid.showGridFooter = true;
      grid.showColumnFooter = true;
      grid.fastWatch = true;
      
      return grid;
    
  }
  
  
  return {
    'default':  getDefaultGridProperties(),
    'fields': getModelFields
  };

});