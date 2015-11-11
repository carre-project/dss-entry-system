(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('risk_factorsController', risk_factorsController);

  /** @ngInject */
  function risk_factorsController(toastr, Risk_factors, currentUser, risk_factorsArray, uiGridGroupingConstants, $timeout, Bioportal, uiGridConstants, $state) {
    var c = this; //controller as c
    // currentUser is our user model;

    var risk_factors = [];
    var risk_factorTypes=[];
    //check and reload state if the data is not the correct type ----- dont know why is happening -- api fault
    if (risk_factorsArray.data.some(function(obj) {
        return obj.type.indexOf('http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_factor') === -1;
      })) { console.log('TELL ALLAN about this! It confused and instead of risk_factor returned this: ', risk_factorsArray.data[0].type[0]); $state.reload();
    }
    else {
      console.info('risk_factors:',risk_factorsArray);
      risk_factors = risk_factorsArray.data.map(function(obj) {
        /* Risk_factors template
          has_confidence_interval: Array[1]
          has_observable_expression: Array[1]
          has_risk_factor_id: Array[1]
          has_risk_factor_observable: Array[1]
          has_risk_factor_ratio_type: Array[1]
          has_risk_factor_ratio_value: Array[1]
          has_risk_factor_source: Array[1]
          has_risk_factor_source_type: Array[1]
          id: "http://carre.kmi.open.ac.uk/CARRE_RE225"
          is_adjusted_for: Array[10]
          type: Array[1]
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
          has_risk_factor_measurement: obj.has_risk_factor_measurement ? obj.has_risk_factor_measurement[0] : '-',
          has_risk_factor_measurement_label: obj.has_risk_factor_measurement ? obj.has_risk_factor_measurement[0].substring(obj.has_risk_factor_measurement[0].lastIndexOf('/')+1).split('#')[1] : '-',
          has_risk_element_identifier: obj.has_risk_element_identifier ? obj.has_risk_element_identifier[0] : '-',
          has_risk_element_identifier_label: obj.has_risk_element_identifier ? obj.has_risk_element_identifier[0].substring(obj.has_risk_element_identifier[0].lastIndexOf('/')+1).toUpperCase() : '-',
          has_risk_factor_name: obj.has_risk_factor_name ? obj.has_risk_factor_name[0] : obj.risk_factor_name[0],
          risk_factor_unit: obj.risk_factor_unit ? obj.risk_factor_unit[0] : '-'

        };
        
        //get types 
        r.types.forEach(function(type){
          if(risk_factorTypes.indexOf(type)===-1) risk_factorTypes.push(type);
        });
        
        return r;
      });
      console.log('Risk_factor Types: ',risk_factorTypes);
    }


    /*Bioportal browser*/
    c.setBioportal = function(grid, row, nocui) {
      var id = row ? row.entity.has_risk_factor_name.toLowerCase() : null;
      if (!id) {
        c.selectedRisk_factor = {};
        c.bioportalData = {};
      }
      else if (c.selectedRisk_factor.entity.id !== id || nocui) {
        c.selectedRisk_factor = row;
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
        c.selectedRisk_factor = {};
        c.bioportalData = {};
      }
    }



    /* GRID STUFF */
    c.mygrid = {};
    c.mygrid.data = risk_factors;
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
        cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ng-click="grid.appScope.risk_factors.setBioportal(grid, row)"><i class="fa fa-eye"></i></button></div>',
        width: 40
      },{
        name: 'has_risk_factor_name',
        displayName: 'Name'
      }, {
        name: 'has_risk_factor_measurement_label',
        displayName: 'Measurement'
      },{
        name: 'risk_factor_unit',
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
          selectOptions: risk_factorTypes.map(function(obj){return {'value':obj,'label':obj};})
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
        cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ng-click="grid.appScope.risk_factors.setPubmed(grid, row, true)"><i class="fa fa-edit"></i></button></div>',
        width: 60
      });
    }
    
    
    
    
    
    /*View Citation Profile*/
    
    
    

  }
})();
