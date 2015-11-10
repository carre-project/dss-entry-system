(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('observablesController', observablesController);

  /** @ngInject */
  function observablesController(toastr, Observables, currentUser, observablesArray, uiGridGroupingConstants, $timeout, Bioportal, uiGridConstants, $state) {
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
          has_reviewer_label: obj.has_reviewer ? obj.has_reviewer.map(function(val){return val.substring(val.lastIndexOf('/')+1);}).join(',') : '-',
          has_observable_measurement: obj.has_observable_measurement ? obj.has_observable_measurement[0] : '-',
          has_observable_measurement_label: obj.has_observable_measurement ? obj.has_observable_measurement[0].substring(obj.has_observable_measurement[0].lastIndexOf('/')+1).split('#')[1] : '-',
          has_risk_element_identifier: obj.has_risk_element_identifier ? obj.has_risk_element_identifier[0] : '-',
          has_risk_element_identifier_label: obj.has_risk_element_identifier ? obj.has_risk_element_identifier[0].substring(obj.has_risk_element_identifier[0].lastIndexOf('/')+1).toUpperCase() : '-',
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


    /*Bioportal browser*/
    c.setBioportal = function(grid, row, nocui) {
      var id = row ? row.entity.has_observable_name.toLowerCase() : null;
      if (!id) {
        c.selectedObservable = {};
        c.bioportalData = {};
      }
      else if (c.selectedObservable.entity.id !== id || nocui) {
        c.selectedObservable = row;
        var options={
          display_context:'false',
          require_exact_match:'false',
          include:'prefLabel,definition,cui',
          display_links:'true',
          require_definitions:'false'
        };
        if(row.entity.has_risk_element_identifier_label.length>4&&!nocui){
          options.cui=row.entity.has_risk_element_identifier_label.toUpperCase();
        }
        c.loading = Bioportal.search(id,options).then(function(res) {
          // console.log(res);
          //filter data that have cui, and the title match incase
          c.bioportalData = res.data.collection.filter(function(obj){
            if(!obj.cui) return false;
            if(!obj.prefLabel.toLowerCase().indexOf(id)) return false;
            return true
          });
        })
      }
      else {
        c.selectedObservable = {};
        c.bioportalData = {};
      }
    }



    /* GRID STUFF */
    c.mygrid = {};
    c.mygrid.data = observables;
    c.mygrid.onRegisterApi = function(api) {
      //grid callbacks

      // api.selection.on.rowSelectionChanged(null, function(row) {
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
    c.mygrid.columnDefs = [
      {
        field: 'B',
        enableFiltering: false,
        enableColumnMenu: false,
        cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ng-click="grid.appScope.observables.setBioportal(grid, row)"><i class="fa fa-eye"></i></button></div>',
        width: 40
      },{
        name: 'has_observable_name',
        displayName: 'Name'
      }, {
        name: 'has_observable_measurement_label',
        displayName: 'Measurement'
      },{
        name: 'observable_unit',
        displayName: 'Unit',
        width:100
      },{
        name: 'has_risk_element_identifier_label',
        displayName: 'CUI',
        width:95
        // ,cellTemplate:'<div><a ng-href="{{row.entity.has_risk_element_identifier}}">{{row.entity.has_risk_element_identifier_label}}</a></div>'
      }, {
        name: 'types_label',
        displayName: 'Types',
        enableCellEdit: true,
        width:250,
        filter: {
          type: uiGridConstants.filter.SELECT,
          selectOptions: observableTypes.map(function(obj){return {'value':obj,'label':obj};})
        }
      }
      , {
        name: 'has_reviewer_label',
        displayName: 'Reviewers',
        // enableCellEdit: true,
        width: 100
      }
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
