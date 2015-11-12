(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('citationsEditController', citationsEditController);

  /** @ngInject */
  function citationsEditController(toastr, Citations, currentUser, citationsArray, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state) {
    var c = this; //controller as c
    // currentUser is our user model;


    var citations = [];
    //check and reload state if the data is not the correct type ----- dont know why is happening -- api fault
    if (citationsArray.data.some(function(obj) {
        return obj.type.indexOf('http://carre.kmi.open.ac.uk/ontology/risk.owl#citation') === -1;
      })) {
      console.log('TELL ALLAN about this! It confused and instead of citation returned this: ', citationsArray.data[0].type[0]);
      $state.reload();
    }
    else {
      citations = citationsArray.data.map(function(obj) {
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
          id: obj.has_citation_pubmed_identifier ? obj.has_citation_pubmed_identifier[0] : obj.id,
          has_citation_source_type: obj.has_citation_source_type ? obj.has_citation_source_type[0] : '',
          has_citation_source_level: obj.has_citation_source_level ? obj.has_citation_source_level[0] : '',
        };
      });
    }


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
    if (currentUser.username) {
      c.mygrid.columnDefs.push({
        field: 'Edit',
        enableFiltering: false,
        enableColumnMenu: false,
        cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ng-click="grid.appScope.citations.setPubmed(grid, row, true)"><i class="fa fa-edit"></i></button></div>',
        width: 60
      });
    }





    /*View Citation SINLGE Profile*/

    //this is the current citation loaded
    function getCitation(id,citations){
      if(!id) return {};
      citations.forEach(function(citation) {
        if (citation.id.indexOf(c.id) > -1) return citation;
      });
      return {};
    }
    c.currentCitation = $stateParams.id?getCitation($stateParams.id,citations):{};
    
    
    console.log(c.currentCitation);
  
    
    
    //if it is edited
    c.editMode = !!$stateParams.edit;
    
    console.log(c.editMode);


  }
})();
