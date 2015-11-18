(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('citationsController', citationsController);

  /** @ngInject */
  function citationsController(toastr, Citations, currentUser, citations, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state, $log, contentGrid) {
    var c = this; //controller as c
    // currentUser is our user model;

    // $log.info('Citations data: ', citations);




    /* GRID STUFF */
    c.mygrid = contentGrid.default;
    c.mygrid.data = citations;
    c.mygrid.onRegisterApi = function(api) {
      //grid callbacks

      // api.selection.on.rowSelectionChanged(null, function(row) {
      //   c.setPubmed(null,row);
      // });
    };

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





    /*Pubmed browser*/
    c.setPubmed = function(grid, row, useApi) {

      c.pubmedApi = useApi;
      var id = row ? row.entity.id : null;

      if (!id) {
        c.selectedCitation = '';
        c.pubmedArticle = '';
      }
      else if (c.selectedCitation !== id) {
        c.selectedCitation = id;
        c.loading = Pubmed.fetch(id).then(function(res) {

          c.pubmedArticle = res.data;

        });
      }
      else {
        c.selectedCitation = '';
        c.pubmedArticle = '';
      }
    };

    /*View Citation SINLGE Profile*/

    //this is the current citation loaded
    function getCitation(id, citations) {
      if (!id) return {};
      citations.forEach(function(citation) {
        if (citation.id.indexOf(c.id) > -1) return citation;
      });
      return {};
    }
    c.currentCitation = $stateParams.id ? getCitation($stateParams.id, citations) : {};

    //if it is edited
    c.editMode = !!$stateParams.edit;

  }
})();
