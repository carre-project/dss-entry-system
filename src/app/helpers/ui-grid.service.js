angular.module('CarreEntrySystem').service('contentGrid', function() {

  this.exports = {
    'default': getDefaultGridProperties(),
    'fields': getModelFields
  };

  //auto build grid columns from keys of each element
  function getModelFields(fieldsArray, replaceArray) {
    var columnDefs = [];
    replaceArray = replaceArray || [];
    fieldsArray.forEach(function(obj) {
    
      if (replaceArray.indexOf(obj) >= 0) {
        columnDefs.push(obj);
      }
      else {
        columnDefs.push({
          field: obj,
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
        // enableFullRowSelection  : true,
        enableColumnMenus: true,
        showGridFooter: true,
        showColumnFooter: true,
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