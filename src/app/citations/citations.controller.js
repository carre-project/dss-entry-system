(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('citationsController', citationsController);

  /** @ngInject */
  function citationsController(toastr, Citations, currentUser, citationsArray, uiGridGroupingConstants, $timeout) {
    var c = this; //controller as c
    c.user = currentUser;

    c.sidebyside = 'col-xs-12';
    c.setPubmed = function(grid, row) {
      var id = row.entity.id;
      console.log(id);
      if (id) {
        c.pubmedArticle = 'http://www.ncbi.nlm.nih.gov/pubmed/' + id;
        c.sidebyside = 'col-xs-6';
      }
      else {
        c.pubmedArticle = '';
        c.sidebyside = 'col-xs-12';
      }
    }

    var citations = citationsArray.data.map(function(obj) {

      //console.info('Citations:',citationsArray);
      /* Citations template
      has_author: Array[2]
      has_citation_pubmed_identifier: Array[1]
      has_citation_source_level: Array[2]
      has_citation_source_type: Array[2]
      has_reviewer: Array[2]
      id: "http://carre.kmi.open.ac.uk/citations/23271790"
      type: Array[1]
      */

      //make label like this
      // val.substring(val.lastIndexOf('/')+1));
      return {
        has_author: obj.has_author ? obj.has_author[0] : '',
        has_author_label: obj.has_author ? obj.has_author[0].substring(obj.has_author[0].lastIndexOf('/') + 1) : '',
        has_reviewer: obj.has_reviewer ? obj.has_reviewer.join(',') : '',
        id: obj.has_citation_pubmed_identifier[0],
        has_citation_source_type: obj.has_citation_source_type ? obj.has_citation_source_type[0] : '',
        has_citation_source_level: obj.has_citation_source_level ? obj.has_citation_source_level[0] : '',
      };
    });


    /*Pubmed browser*/



    // c.panelClass='col-sm-6';
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
    c.mygrid.data = citations;
    c.mygrid.onRegisterApi = function(api) {
      c.gridApi = api
    };
    c.mygrid.paginationPageSizes = [10, 50, 100];
    c.mygrid.paginationPageSize = 10;
    c.mygrid.enableColumnResizing = true;
    c.mygrid.enableFiltering = true;
    c.mygrid.enableGridMenu = true;
    c.mygrid.showGridFooter = true;
    c.mygrid.showColumnFooter = true;
    c.mygrid.fastWatch = true;
    c.mygrid.columnDefs = [{
      field: 'nothing',
      name: '',
      cellTemplate: 'app/citations/showPubmedButton.html',
      width: 34
    }, {
      name: 'id',
      displayName: 'Pubmed',
      width: 100
    }, {
      name: 'has_citation_source_type',
      displayName: 'Source Type',
      enableCellEdit: true
    }, {
      name: 'has_citation_source_level',
      displayName: 'Source Level',
      enableCellEdit: true
    }, {
      name: 'has_author_label',
      displayName: 'CARRE Author',
      // enableCellEdit: true,
      width: 150,
      cellTooltip: function(row, col) {
        return row.entity.has_author;
      }
    }, {
      name: 'has_reviewer',
      displayName: 'CARRE Reviewers',
      // enableCellEdit: true,
      width: 190,
      cellTooltip: function(row, col) {
        return row.entity.has_reviewer;
      }
    }];

  }
})();
