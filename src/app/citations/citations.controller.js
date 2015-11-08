(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('citationsController', citationsController);

  /** @ngInject */
  function citationsController(toastr,Citations,currentUser,citationsList,uiGridGroupingConstants) {
    var c = this; //controller as c
    
    
    
    
    // c.types=citationsList.reduce(function(arr,obj){
    //   if(arr.indexOf(obj.type)===-1) arr.push(obj.type);
    //   return arr;
    // },[]);
    
    // console.log(citationsList.map(function(obj){
    //   return obj.has_citation_pubmed_identifier;
    // }).join(','));
    
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
        c.mygrid.data = citationsList;
        c.mygrid.paginationPageSizes= [10, 20, 50];
        c.mygrid.paginationPageSize= 10;
        c.mygrid.enableColumnResizing = true;
        c.mygrid.enableFiltering = true;
        c.mygrid.enableGridMenu = true;
        c.mygrid.showGridFooter = true;
        c.mygrid.showColumnFooter = true;
        c.mygrid.fastWatch = true;
        c.mygrid.columnDefs = [{
            name: 'has_citation_pubmed_identifier_label',
            displayName: 'Pubmed ID',
            enableCellEdit: true,
            cellTooltip: function(row, col) {
                return row.entity.has_citation_pubmed_identifier;
            }
        }, {
            name: 'has_citation_source_type_label',
            displayName: 'Source Type',
            enableCellEdit: true,
            cellTooltip: function(row, col) {
                return row.entity.has_citation_source_type;
            }
        }, {
            name: 'has_author_label',
            displayName: 'CARRE Author',
            enableCellEdit: true,
            cellTooltip: function(row, col) {
                return row.entity.has_author;
            }
        }, {
            name: 'has_reviewer_label',
            displayName: 'CARRE Reviewer',
            enableCellEdit: true,
            cellTooltip: function(row, col) {
                return row.entity.has_reviewer;
            }
        }];

        /*End of Grid stuff*/
      
  }
})();
