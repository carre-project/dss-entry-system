angular.module('CarreEntrySystem').service('content', function() {

  this.exports = {
    'default': getDefaultGridProperties(),
    'fields': getModelFields,
    'labelOf':labelFromKey
  };

  //auto build grid columns from keys of each element
  function getModelFields(fieldsArray, filterOutArray) {
    var columnDefs = [];
    filterOutArray = (filterOutArray || []).concat(['type','has_observable_condition','has_risk_element_identifier_system','has_risk_evidence_source','has_risk_evidence_observable','has_author','has_reviewer']);
    fieldsArray.forEach(function(obj) {
    
      if(filterOutArray.indexOf(obj)===-1) {
        columnDefs.push({
          field: obj+'_label',
          displayName: labelFromKey(obj)
        });
      }
      
    });

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
        showColumnFooter: true
        // fastWatch: true
    };
    
  }

  /* Private */
  function labelFromKey(key) {
    //remove has_
    if (key.indexOf("has_") >= 0) key = key.split("has_")[1];
    //replace _ with spaces
    key = key.replace(new RegExp("_", "g"), " ");
    //Capitalize first letter
    return key.charAt(0).toUpperCase() + key.slice(1);
  }



  return this.exports;

});