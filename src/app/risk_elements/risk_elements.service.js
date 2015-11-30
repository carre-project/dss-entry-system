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
      deleteQuery += "              risk:has_risk_element_modifiable_status \"" + oldElem.has_risk_element_modifiable_status[0] + "\"^^xsd:string . \n }} \n";

      /*----------*/

      insertQuery = "INSERT DATA { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " { \n\
              <" + oldElem.id + "> risk:has_risk_element_name \"" + newElem.name + "\"^^xsd:string; \n\
              risk:has_risk_element_identifier <http://umls.nlm.nih.gov/sab/mth/cui/" + newElem.identifier + ">; \n\
              risk:has_risk_element_type <" + newElem.type + ">; \n";
      newElem.observables.forEach(function(ob) {
        insertQuery += "              risk:has_risk_element_observable <" + ob + ">; \n";
      });
      insertQuery += "              risk:has_risk_element_modifiable_status \"" + newElem.modifiable_status + "\"^^xsd:string . \n }}";

      /*----------*/

      updateQuery = deleteQuery + insertQuery;
      
      // console.info('updateQuery: ', updateQuery);
      return CARRE.query(updateQuery);
    }
    else {
      /*Insert query*/


      insertQuery = "DELETE { GRAPH <http://carre.kmi.open.ac.uk/public> { risk:risk_element risk:has_index ?oldindex }} \n\
INSERT INTO " + CONFIG.CARRE_DEFAULT_GRAPH + " { \n\
risk:risk_element risk:has_index ?newindex \n\
?newid risk:has_risk_element_name \"" + newElem.name + "\"^^xsd:string; \n\
risk:has_risk_element_identifier <http://umls.nlm.nih.gov/sab/mth/cui/" + newElem.identifier + ">; \n\
risk:has_risk_element_type <" + newElem.type + ">; \n\
risk:has_risk_element_modifiable_status \"" + newElem.modifiable_status + "\"^^xsd:string; \n\
risk:has_author <" + user + ">; \n";

      //add observables
      newElem.observables.forEach(function(ob) {
        insertQuery += "risk:has_risk_element_observable <" + ob + ">; \n";
      });

      //add type and close query
      insertQuery += "rdf:type risk:risk_element. \n\
      } } WHERE { GRAPH <http://carre.kmi.open.ac.uk/public> { \n\
 risk:risk_element risk:has_index ?oldindex. \n\
      BIND ((?oldindex+1) AS ?newindex) \n\
      BIND (IRI(CONCAT(RL:,'RL_',?newindex)) AS ?newid) }}";


      console.info('insertQuery: ', insertQuery);
      // return $q.reject({data:'Not implemented yet!'})
      return CARRE.query(insertQuery);
    }

  }

  return this.exports;
/*PREFIX  risk: <http://carre.kmi.open.ac.uk/ontology/risk.owl#>
PREFIX  rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX  apf:  <http://jena.hpl.hp.com/ARQ/property#>
PREFIX  xsd:  <http://www.w3.org/2001/XMLSchema#>
PREFIX  owl:  <http://www.w3.org/2002/07/owl#>
PREFIX  rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX  fn:   <http://www.w3.org/2005/xpath-functions#>
PREFIX  RL:   <http://carre.kmi.open.ac.uk/risk_elements/>

DELETE {
  GRAPH <http://carre.kmi.open.ac.uk/public> {
    risk:risk_element risk:has_index ?oldindex .
  }
}
INSERT {
  GRAPH <http://carre.kmi.open.ac.uk/public> {
    risk:risk_element risk:has_index ?newindex .
    ?newid risk:has_risk_element_name "test aids"^^xsd:string .
    ?newid risk:has_risk_element_identifier <http://umls.nlm.nih.gov/sab/mth/cui/C0001175> .
    ?newid risk:has_risk_element_type risk:risk_element_type_demographic .
    ?newid risk:has_risk_element_modifiable_status "yes"^^xsd:string .
    ?newid risk:has_author <https://carre.kmi.open.ac.uk/users/educationalAggregator> .
    ?newid risk:has_risk_element_observable <http://carre.kmi.open.ac.uk/observables/OB_2> .
    ?newid risk:has_risk_element_observable <http://carre.kmi.open.ac.uk/observables/OB_9> .
    ?newid risk:has_risk_element_observable <http://carre.kmi.open.ac.uk/observables/OB_4> .
    ?newid rdf:type risk:risk_element .
  }
}
WHERE
  { GRAPH <http://carre.kmi.open.ac.uk/public>
      { risk:risk_element risk:has_index ?oldindex .
        ?newid risk:has_risk_element_name ?name .
        ?newid risk:has_risk_element_identifier ?identifier .
        ?newid risk:has_risk_element_type ?type .
        ?newid risk:has_risk_element_modifiable_status ?status .
        ?newid risk:has_author ?author .
        ?newid risk:has_risk_element_observable ?observables .
        ?newid rdf:type risk:risk_element
        BIND(( ?oldindex + 1 ) AS ?newindex)
        BIND(iri(concat(RL:, "RL_", ?newindex)) AS ?newid)
      }
  }*/
});