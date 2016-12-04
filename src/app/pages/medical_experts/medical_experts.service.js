(function() {
  'use strict';

angular.module('CarreEntrySystem').service('Medical_experts', function($http, CARRE, CONFIG, $q) {

  this.exports = {
    'get': getMedical_experts,
    'countFor': countAllInstancesFor,
    'saveProfile': saveMedicalExpertProfile
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

  function saveMedicalExpertProfile(oldElem, newElem, user) {
    
    user = user || CONFIG.currentUser.graphName;
    var updateQuery = "",
      insertQuery = "";
    var newObj = {};
    if (newElem.name.length > 0) newObj.has_risk_element_name = {
      pre: 'risk',
      value: newElem.name.toString(),
      type: "string"
    };
    if (newElem.identifier.length > 0) newObj.has_risk_element_identifier = {
      pre: 'risk',
      value: "http://umls.nlm.nih.gov/sab/mth/cui/" + newElem.identifier.toString(),
      type: "node"
    };
    if (newElem.type.length > 0) newObj.has_risk_element_type = {
      pre: 'risk',
      value: newElem.type.toString(),
      type: "node"
    };
    if (newElem.modifiable_status.length > 0) newObj.has_risk_element_modifiable_status = {
      pre: 'risk',
      value: newElem.modifiable_status.toString(),
      type: "string"
    };
    if (newElem.observables.length > 0) newObj.has_risk_element_observable = {
      pre: 'risk',
      value: newElem.observables,
      type: "node"
    };
    if (newElem.risk_elements.length > 0) newObj.includes_risk_element = {
      pre: 'risk',
      value: newElem.risk_elements,
      type: "node"
    };


    console.log('Old: ', oldElem);
    console.log('New: ', newElem);
    console.log('Mapped: ', newObj);

    /* invalidate risk_element_all */
    CARRE.invalidateCache('risk');
    CARRE.invalidateCache('count_all');

    if (oldElem.id) {
      /*Update query*/
      updateQuery = QUERY.update(oldElem, newObj);
      console.log('----Update Query----');
      return CARRE.query(updateQuery, 'no prefix');
    }
    else {
      /*Insert query*/
      insertQuery = QUERY.insert(newObj, "risk_element", "RL", user);
      console.info('-----insertQuery------');
      return CARRE.query(insertQuery, 'no prefix');
    }

  }

  return this.exports;

});

})();