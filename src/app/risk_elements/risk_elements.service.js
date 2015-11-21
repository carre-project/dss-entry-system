angular.module('CarreEntrySystem').service('Risk_elements', function($http, CARRE, CONFIG) {

  this.exports = {
    'get': getRisk_elements
  };

  function getRisk_elements(ArrayOfIDs, joins) {
    if (joins) return getRisk_elementsJoins(ArrayOfIDs);
    else return CARRE.instances('risk_element', ArrayOfIDs);
  }

  function getRisk_elementsJoins(ArrayOfIDs) {
    var listQuery = "\n\
  SELECT * FROM " + CONFIG.CARRE_DEFAULT_GRAPH + " WHERE { \n\
             ?id a risk:risk_element; ?predicate ?object. \n\
         OPTIONAL { \n\
         ?object a risk:observable.\n\
         ?object risk:has_observable_name ?has_observable_name. \n\
         } \n";
 


    //add filter to query if a single observable is requested
    if (ArrayOfIDs) {
      listQuery += "FILTER ( " + ArrayOfIDs.map(function(id) {
        return "?id=" + id.split('_')[0] + ":" + id;
      }).join("||") + "  )\n }";
    }
    else listQuery += "}";

    return CARRE.query(listQuery);
  }
  return this.exports;

});