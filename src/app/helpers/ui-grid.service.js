angular.module('CarreEntrySystem').service('content', function() {

  this.exports = {
    'default': getDefaultGridProperties(),
    'fields': getModelFields,
    'labelOf':labelFromKey
  };

  //auto build grid columns from keys of each element
  function getModelFields(fieldsArray, visibleArray) {
    console.log(fieldsArray,visibleArray);
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