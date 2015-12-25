(function() {
  'use strict';

angular.module('CarreEntrySystem').service('Medical_experts', function($http, CARRE, CONFIG, $q) {

  this.exports = {
    'get': getMedical_experts,
    'countFor': countAllInstancesFor
    // 'insert': insertMedical_expert
  };
    
  CONFIG.medical_experts=CONFIG.medical_experts|| {};
  
  function getMedical_experts(ArrayOfIDs) {
    if(ArrayOfIDs) return CARRE.instances('medical_expert', ArrayOfIDs);
    else if(CONFIG.medical_experts.cache) {
      console.info("CACHE WORKS!");
      return $q(function(resolve, reject) {
        resolve(CONFIG.medical_experts.cache)
        reject();
      });
    }
    else return CARRE.instances('medical_expert', ArrayOfIDs).then(function(res){ 
      CONFIG.medical_experts.cache=res;
      console.info("CACHE LOADED!");
      return res;
    })
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