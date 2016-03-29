'use strict';
angular.module('CarreEntrySystem').service('content', function(CarreTranslate,SweetAlert,$state) {

  this.exports = {
    'default': getDefaultGridProperties(),
    'fields': getModelFields,
    'labelOf':labelFromKey,
    'typeFromId':getTypeFromId,
    'goTo':showElement
  };

  //auto build grid columns from keys of each element
  function getModelFields(fieldsArray, visibleArray) {
    // console.log(fieldsArray,visibleArray);
    var columnDefs = [];
    
    //add ordered columns
    visibleArray.forEach(function(field_name) {
        columnDefs.push({
          field: field_name+'_label',
          displayName: labelFromKey(field_name)
        });
    }); 
    
    //add rest of the fields;
    fieldsArray.forEach(function(field_name) {
      if(visibleArray.indexOf(field_name)===-1) {
        columnDefs.push({
          field: field_name+'_label',
          displayName: labelFromKey(field_name),
          visible:false
        });
      }
    });
    
    //enable sorting ASC by the 1st field usually name
    columnDefs[0].sort={ priority: 0, direction: 'asc' };
    
    return columnDefs;
  }


  function getDefaultGridProperties() {

    /* GRID Default properties */
    return {
        paginationPageSizes: [10, 50, 100],
        paginationPageSize: 10,
        enableColumnResizing: true,
        enableFiltering: true,
        allowCellFocus: true,
        enableGridMenu: true,
        multiSelect: true,
        enableRowSelection: true,
        enableHighlighting: true,
        // enableFullRowSelection  : true,
        enableColumnMenus: true,
        showGridFooter: true,
        showColumnFooter: true,
        exporterMenuPdf: false, // ADD THIS
        exporterCsvFilename: window.location.href.substr(window.location.href.lastIndexOf("/")+1)+'.csv',
        // fastWatch: true
    };
    
  }
  
  //alias for CarreTranslate
  function labelFromKey(key) {
    return CarreTranslate(key);
  }
  
  
  function getTypeFromId(id){
    if(!id) return '';
    if(id.indexOf('_')===-1) return '';
    var str=id.substr(id.lastIndexOf('_')-2,2).toUpperCase();
    if(str==='OB') return {state:'observables',raw:'risk_element',label:'Risk element'};
    if(str==='CI') return {state:'citations',raw:'citation',label:'Citation'};
    if(str==='MD') return {state:'medical_experts',raw:'medical_expert',label:'Medical expert'};
    if(str==='ME') return {state:'measurement_types',raw:'measurement_type',label:'Measurement types'};
    if(str==='RL') return {state:'risk_elements',raw:'risk_element',label:'Risk element'};
    if(str==='RF') return {state:'risk_factors',raw:'risk_factor',label:'Risk factor'};
    if(str==='RV') return {state:'risk_evidences',raw:'risk_evidence',label:'Risk evidence'};
    else console.log(str,id);
  }
        
        
  function showElement(id,label){
    var type=getTypeFromId(id);
    //implement a basic confirm popup
    SweetAlert.swal({
        title: "Show the "+type.label+"?",
        text: "This will redirect you to the `"+label+"` "+type.label+"'s detail page.",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#2E8B57",
        confirmButtonText: "Yes, show me!",
        closeOnConfirm: true,
        closeOnCancel: true
      },
      function(isConfirm) {
        if (isConfirm) {
          $state.go("main."+type.state+".view",{id:id});
        }
      });
  };



  return this.exports;

});