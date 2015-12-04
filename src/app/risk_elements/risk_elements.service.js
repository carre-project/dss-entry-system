angular.module('CarreEntrySystem').service('Risk_elements', function($http, CARRE, CONFIG, $q) {

  this.exports = {
    'get': getRisk_elements,
    'insert': insertRisk_element
  };

  function getRisk_elements(ArrayOfIDs) {
    return CARRE.instances('risk_element', ArrayOfIDs);
  }

  function insertRisk_element(oldElem, newElem, user) {
    
    console.log('Old: ',oldElem);
    console.log('New: ',newElem);
    
    /*
    
    oldElem Template
    
       "node":"http://carre.kmi.open.ac.uk/risk_elements/RL_3",
       "type":"http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_element",
       "has_author":"https://carre.kmi.open.ac.uk/users/KalliopiPafili",
       "has_reviewer":"https://carre.kmi.open.ac.uk/users/GintareJuozalenaite",
       "has_risk_element_identifier":"http://umls.nlm.nih.gov/sab/mth/cui/C0001783",
       "has_risk_element_modifiable_status":"no",
       "has_risk_element_name":"age",
       "has_risk_element_observable":"http://carre.kmi.open.ac.uk/observables/OB_7",
       "has_risk_element_type":"http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_element_type_demographic",
       "has_risk_element_index":"3"
    
    newElem Template
        "observables": [
          "http://carre.kmi.open.ac.uk/observables/OB_7"
        ],
        "type": "risk_element_type_demographic",
        "name": "age",
        "identifier": "C0001783",
        "modifiable_status": "no"
        
    */

    var updateQuery, deleteQuery, insertQuery = "";

    if (oldElem.id) {

      /* Update query */

      deleteQuery = "DELETE DATA { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " { \n\
              <" + oldElem.id + "> risk:has_risk_element_name \"" + oldElem.has_risk_element_name[0] + "\"^^xsd:string; \n\
              risk:has_risk_element_identifier <http://umls.nlm.nih.gov/sab/mth/cui/" + oldElem.has_risk_element_identifier[0] + ">; \n\
              risk:has_risk_element_type <" + oldElem.has_risk_element_type[0] + ">; \n";
      oldElem.has_risk_element_observable.forEach(function(ob) {
        deleteQuery += "              risk:has_risk_element_observable <" + ob + ">; \n";
      });
      if(oldElem.includes_risk_element) {
        oldElem.includes_risk_element.forEach(function(rl) {
          deleteQuery += "              risk:includes_risk_element <" + rl + ">; \n";
        });
      }
      deleteQuery += "              risk:has_risk_element_modifiable_status \"" + oldElem.has_risk_element_modifiable_status[0] + "\"^^xsd:string . \n }} \n";

      /*----------*/

      insertQuery = "INSERT DATA { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " { \n\
              <" + oldElem.id + "> risk:has_risk_element_name \"" + newElem.name + "\"^^xsd:string; \n\
              risk:has_risk_element_identifier <http://umls.nlm.nih.gov/sab/mth/cui/" + newElem.identifier + ">; \n\
              risk:has_risk_element_type <" + newElem.type + ">; \n";
      newElem.observables.forEach(function(ob) {
        insertQuery += "              risk:has_risk_element_observable <" + ob + ">; \n";
      });
      if(newElem.risk_elements) {
        newElem.risk_elements.forEach(function(rl) {
          insertQuery += "              risk:includes_risk_element <" + rl + ">; \n";
        });
      }
      insertQuery += "              risk:has_risk_element_modifiable_status \"" + newElem.modifiable_status + "\"^^xsd:string . \n }}";
      

      /*----------*/

      updateQuery = deleteQuery + insertQuery;
      
      console.info('-----updateQuery------');
      return CARRE.query(updateQuery);
    }
    else {
      /*Insert query*/


      insertQuery = "INSERT { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " { \n\
?newid risk:has_risk_element_name \"" + newElem.name + "\"^^xsd:string; \n\
risk:has_risk_element_identifier <http://umls.nlm.nih.gov/sab/mth/cui/" + newElem.identifier + ">; \n\
risk:has_risk_element_type <" + newElem.type + ">; \n\
risk:has_risk_element_modifiable_status \"" + newElem.modifiable_status + "\"^^xsd:string; \n\
risk:has_author <" + user + ">; \n";

      //add observables
      newElem.observables.forEach(function(ob) {
        insertQuery += "risk:has_risk_element_observable <" + ob + ">; \n";
      });
      if (newElem.risk_elements) {
        newElem.risk_elements.forEach(function(rl) {
          insertQuery += "              risk:includes_risk_element <" + rl + ">; \n";
        });
      }
      //add type and close query
      insertQuery += "a risk:risk_element . } } WHERE \n\
  { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " \n\
      { { \n\
          SELECT (COUNT(DISTINCT ?elems) AS ?oldindex) FROM " + CONFIG.CARRE_DEFAULT_GRAPH + " \n\
          WHERE { \n\
           ?elems a risk:risk_element . \n\
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