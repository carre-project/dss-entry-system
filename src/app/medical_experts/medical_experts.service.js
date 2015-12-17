(function() {
  'use strict';

angular.module('CarreEntrySystem').service('Medical_experts', function($http, CARRE, CONFIG, $q) {

  this.exports = {
    'get': getMedical_experts,
    'insert': insertMedical_expert
  };

  function getMedical_experts(ArrayOfIDs) {
    return CARRE.instances('medical_expert', ArrayOfIDs);
  }

  function insertMedical_expert(oldElem, newElem, user) {
    
    console.log('Old: ',oldElem);
    console.log('New: ',newElem);
    
    /*
    
    oldElem Template
    
       "node":"http://carre.kmi.open.ac.uk/medical_experts/RL_3",
       "type":"http://carre.kmi.open.ac.uk/ontology/risk.owl#medical_expert",
       "has_author":"https://carre.kmi.open.ac.uk/users/KalliopiPafili",
       "has_reviewer":"https://carre.kmi.open.ac.uk/users/GintareJuozalenaite",
       "has_medical_expert_identifier":"http://umls.nlm.nih.gov/sab/mth/cui/C0001783",
       "has_medical_expert_modifiable_status":"no",
       "has_medical_expert_name":"age",
       "has_medical_expert_observable":"http://carre.kmi.open.ac.uk/observables/OB_7",
       "has_medical_expert_type":"http://carre.kmi.open.ac.uk/ontology/risk.owl#medical_expert_type_demographic",
       "has_medical_expert_index":"3"
    
    newElem Template
        "observables": [
          "http://carre.kmi.open.ac.uk/observables/OB_7"
        ],
        "type": "medical_expert_type_demographic",
        "name": "age",
        "identifier": "C0001783",
        "modifiable_status": "no"
        
    */

    var updateQuery, deleteQuery, insertQuery = "";

    if (oldElem.id) {

      /* Update query */

      deleteQuery = "DELETE DATA { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " { \n\
              <" + oldElem.id + "> risk:has_medical_expert_name \"" + oldElem.has_medical_expert_name[0] + "\"^^xsd:string; \n\
              risk:has_medical_expert_identifier <http://umls.nlm.nih.gov/sab/mth/cui/" + oldElem.has_medical_expert_identifier[0] + ">; \n\
              risk:has_medical_expert_type <" + oldElem.has_medical_expert_type[0] + ">; \n";
      oldElem.has_medical_expert_observable.forEach(function(ob) {
        deleteQuery += "              risk:has_medical_expert_observable <" + ob + ">; \n";
      });
      if(oldElem.includes_medical_expert) {
        oldElem.includes_medical_expert.forEach(function(rl) {
          deleteQuery += "              risk:includes_medical_expert <" + rl + ">; \n";
        });
      }
      deleteQuery += "              risk:has_medical_expert_modifiable_status \"" + oldElem.has_medical_expert_modifiable_status[0] + "\"^^xsd:string . \n }} \n";

      /*----------*/

      insertQuery = "INSERT DATA { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " { \n\
              <" + oldElem.id + "> risk:has_medical_expert_name \"" + newElem.name + "\"^^xsd:string; \n\
              risk:has_medical_expert_identifier <http://umls.nlm.nih.gov/sab/mth/cui/" + newElem.identifier + ">; \n\
              risk:has_medical_expert_type <" + newElem.type + ">; \n";
      newElem.observables.forEach(function(ob) {
        insertQuery += "              risk:has_medical_expert_observable <" + ob + ">; \n";
      });
      if(newElem.medical_experts) {
        newElem.medical_experts.forEach(function(rl) {
          insertQuery += "              risk:includes_medical_expert <" + rl + ">; \n";
        });
      }
      insertQuery += "              risk:has_medical_expert_modifiable_status \"" + newElem.modifiable_status + "\"^^xsd:string . \n }}";
      

      /*----------*/

      updateQuery = deleteQuery + insertQuery;
      
      console.info('-----updateQuery------');
      return CARRE.query(updateQuery);
    }
    else {
      /*Insert query*/


      insertQuery = "INSERT { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " { \n\
?newid risk:has_medical_expert_name \"" + newElem.name + "\"^^xsd:string; \n\
risk:has_medical_expert_identifier <http://umls.nlm.nih.gov/sab/mth/cui/" + newElem.identifier + ">; \n\
risk:has_medical_expert_type <" + newElem.type + ">; \n\
risk:has_medical_expert_modifiable_status \"" + newElem.modifiable_status + "\"^^xsd:string; \n\
risk:has_author <" + user + ">; \n";

      //add observables
      newElem.observables.forEach(function(ob) {
        insertQuery += "risk:has_medical_expert_observable <" + ob + ">; \n";
      });
      if (newElem.medical_experts) {
        newElem.medical_experts.forEach(function(rl) {
          insertQuery += "              risk:includes_medical_expert <" + rl + ">; \n";
        });
      }
      //add type and close query
      insertQuery += "a risk:medical_expert . } } WHERE \n\
  { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " \n\
      { { \n\
          SELECT (COUNT(DISTINCT ?elems) AS ?oldindex) FROM " + CONFIG.CARRE_DEFAULT_GRAPH + " \n\
          WHERE { \n\
           ?elems a risk:medical_expert . \n\
          } \n\
        } \n\
        BIND (IRI(CONCAT(RL:, \"RL_\", ?oldindex+1)) AS ?newid) \n\
      } }";


      console.info('-----insertQuery------');
      return CARRE.query(insertQuery);
    }

  }

  return this.exports;

});

})();