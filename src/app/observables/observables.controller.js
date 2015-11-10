(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('observablesController', observablesController);

  /** @ngInject */
  function observablesController(toastr, Observables, currentUser, observablesArray, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state) {
    var c = this; //controller as c
    // currentUser is our user model;

    var observables = [];
    var observableTypes=[];
    //check and reload state if the data is not the correct type ----- dont know why is happening -- api fault
    if (observablesArray.data.some(function(obj) {
        return obj.type.indexOf('http://carre.kmi.open.ac.uk/ontology/risk.owl#observable') === -1;
      })) { console.log('TELL ALLAN about this! It confused and instead of observable returned this: ', observablesArray.data[0].type[0]); $state.reload();
    }
    else {
      observables = observablesArray.data.map(function(obj) {
        // console.info('observables:',observablesArray);
        /* Observables template
          has_author: Array[1]
          has_observable_measurement: Array[1]
          has_observable_name: Array[1] ?? == observable_name: Array[1]
          has_reviewer: Array[2]
          observable_unit: Array[1]
          has_risk_element_identifier: Array[1]
          id: "http://carre.kmi.open.ac.uk/observables/left_ventricular_hypertrophy_diagnosis"
          type: Array[2]
        */

        //make label like this
        // val.substring(val.lastIndexOf('/')+1));
        var r={
          id:obj.id,
          types: obj.type.map(function(val){ return val.substring(val.lastIndexOf('/')+1).split('#')[1];}),
          types_label: obj.type.map(function(val){ return val.substring(val.lastIndexOf('/')+1).split('#')[1];}).join(','),
          has_author: obj.has_author ? obj.has_author[0] : '-',
          has_author_label: obj.has_author ? obj.has_author[0].substring(obj.has_author[0].lastIndexOf('/') + 1) : '-',
          has_reviewer: obj.has_reviewer ? obj.has_reviewer.join(',') : '-',
          has_observable_measurement: obj.has_observable_measurement ? obj.has_observable_measurement[0] : '-',
          has_observable_measurement_label: obj.has_observable_measurement ? obj.has_observable_measurement[0].substring(obj.has_observable_measurement[0].lastIndexOf('/')+1).split('#')[1] : '-',
          has_risk_element_identifier: obj.has_risk_element_identifier ? obj.has_risk_element_identifier[0] : '-',
          has_risk_element_identifier_label: obj.has_risk_element_identifier ? obj.has_risk_element_identifier[0].substring(obj.has_risk_element_identifier[0].lastIndexOf('/')+1) : '-',
          has_observable_name: obj.has_observable_name ? obj.has_observable_name[0] : obj.observable_name[0],
          observable_unit: obj.observable_unit ? obj.observable_unit[0] : '-'

        };
        
        //get types 
        r.types.forEach(function(type){
          if(observableTypes.indexOf(type)===-1) observableTypes.push(type);
        });
        
        return r;
      });
      console.log('Observable Types: ',observableTypes);
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


    // var observable='<http://carre.kmi.open.ac.uk/observables/15385656>';
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
    c.mygrid.data = observables;
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
        name: 'has_observable_name',
        displayName: 'Name'
      }, {
        name: 'has_observable_measurement_label',
        displayName: 'Measurement'
      },{
        name: 'observable_unit',
        displayName: 'Unit'
      },{
        name: 'has_risk_element_identifier_label',
        displayName: 'CUI'
      }, {
        name: 'types_label',
        displayName: 'Types',
        enableCellEdit: true,
        filter: {
          type: uiGridConstants.filter.SELECT,
          selectOptions: observableTypes.map(function(obj){return {'value':obj,'label':obj};})
        }
      }
      // , {
      //   field: 'Iframe',
      //   enableFiltering: false,
      //   enableColumnMenu: false,
      //   cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ng-click="grid.appScope.observables.setPubmed(grid, row)"><i class="fa fa-eye"></i></button></div>',
      //   width: 60
      // }, {
      //   field: 'API',
      //   enableFiltering: false,
      //   enableColumnMenu: false,
      //   cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ng-click="grid.appScope.observables.setPubmed(grid, row, true)"><i class="fa fa-eye"></i></button></div>',
      //   width: 60
      // }
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
        cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ng-click="grid.appScope.observables.setPubmed(grid, row, true)"><i class="fa fa-edit"></i></button></div>',
        width: 60
      });
    }
    
    
    
    
    
    /*View Citation Profile*/
    
    
    

  }
})();
