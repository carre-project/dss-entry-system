(function() {
  'use strict';

angular.module('CarreEntrySystem').service('Medical_experts', function($http, CARRE, CONFIG, $q) {

  this.exports = {
    'get': getMedical_experts,
    'countFor': countAllInstancesFor
    // 'insert': insertMedical_expert
  };

  function getMedical_experts(ArrayOfIDs) {
    return CARRE.instances('medical_expert', ArrayOfIDs);
  }


  function countAllInstancesFor(medicalExpert) {
    var query = "SELECT ?type (COUNT(?item_authored) AS ?authored) (COUNT(?item_reviewed) AS ?reviewed) \n\
    FROM " + CONFIG.CARRE_DEFAULT_GRAPH + " WHERE { \n\
    {?item_authored risk:has_author ?user; a ?type } UNION {?item_reviewed risk:has_reviewer ?user; a ?type} \n\
    "
    //add filter to query if a single observable is requested
    if (medicalExpert) {
      query += "FILTER ( ?user=<" +medicalExpert+ ">) }";
    }
    else query += "}";
    return CARRE.query(query);
  }

  return this.exports;

});

})();