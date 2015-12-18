angular.module('CarreEntrySystem').service('Risk_factors', function($http, CARRE, CONFIG) {

  this.exports={
    'get': getRisk_factors,
    'insert': insertRisk_factor,
    'risk_evidences': getRisk_evidencesFromRisk_Factor
  };
  
  function getRisk_factors(ArrayOfIDs,raw) {
    return CARRE.instances('risk_factor',ArrayOfIDs);
  }

  function insertRisk_factor(oldElem, newElem, user) {
    
    console.log('Old: ',oldElem);
    console.log('New: ',newElem);
    
    var updateQuery, deleteQuery, insertQuery = "";

    if (oldElem.id) {

      /* Update query */

      deleteQuery = "DELETE DATA { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " { \n\
        <" + oldElem.id + ">  risk:has_risk_factor_source <" + oldElem.has_risk_factor_source[0] + ">; \n\
                              risk:has_risk_factor_target <" + oldElem.has_risk_factor_target[0] + ">; \n\
                              risk:has_risk_factor_association_type <" + oldElem.has_risk_factor_association_type[0] + ">. }}";

      /*----------*/

      insertQuery = "INSERT DATA { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " { \n\
        <" + oldElem.id + ">  risk:has_risk_factor_source <" + newElem.source + ">; \n\
                              risk:has_risk_factor_target <" + newElem.target + ">; \n\
                              risk:has_risk_factor_association_type <" + newElem.type + ">. }}";
      

      /*----------*/

      updateQuery = deleteQuery + insertQuery;
      
      console.info('-----updateQuery------');
      return CARRE.query(updateQuery);
    }
    else {
      /*Insert query*/


      insertQuery = "INSERT { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " { \n\
        ?newid  risk:has_risk_factor_source <" + newElem.source + ">; \n\
                risk:has_risk_factor_target <" + newElem.target + ">; \n\
                risk:has_risk_factor_association_type <" + newElem.type + ">; \n\
                risk:has_author <" + user + ">; \n";
                
          //add type and close query
          insertQuery += "a risk:risk_factor . } } WHERE \n\
      { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " \n\
          { { \n\
              SELECT (COUNT(DISTINCT ?elems) AS ?oldindex) FROM " + CONFIG.CARRE_DEFAULT_GRAPH + " \n\
              WHERE { \n\
               ?elems a risk:risk_factor . \n\
              } \n\
            } \n\
            BIND (IRI(CONCAT(RF:, \"RF_\", ?oldindex+1)) AS ?newid) \n\
          } }";
    
    
          console.info('-----insertQuery------');
          return CARRE.query(insertQuery);
    }

  }
  
  function getRisk_evidencesFromRisk_Factor(id) {

    var listQuery = "SELECT * FROM " + CONFIG.CARRE_DEFAULT_GRAPH + " WHERE { \n\
             ?subject a risk:risk_evidence; ?predicate ?object; \n\
             risk:has_risk_factor RF:"+id+". \n\
              OPTIONAL {    \n\
               ?object a risk:citation. \n\
               ?object risk:has_citation_pubmed_identifier ?has_citation_pubmed_identifier  \n\
              } \n\
              OPTIONAL {    \n\
               ?object a risk:observable. \n\
               ?object risk:has_observable_name ?has_observable_name  \n\
              } \n\
              OPTIONAL {    \n\
               ?object a risk:risk_element. \n\
               ?object risk:has_risk_element_name ?has_risk_element_name  \n\
              } \n\
              OPTIONAL {    \n\
               ?object a risk:measurement_type. \n\
               ?object risk:has_measurement_type_name ?has_measurement_type_name  \n\
              } \n\
              OPTIONAL {    \n\
               ?object a risk:risk_factor.  \n\
               ?object risk:has_risk_factor_association_type ?has_risk_factor_association_type. \n\
               ?object risk:has_risk_factor_source ?has_risk_factor_source. \n\
               ?object risk:has_risk_factor_target ?has_risk_factor_target. \n\
               ?has_risk_factor_source risk:has_risk_element_name ?has_source_risk_element_name.  \n\
               ?has_risk_factor_target risk:has_risk_element_name ?has_target_risk_element_name.  \n\
              } \n"


    listQuery += "}";

    return CARRE.selectQuery(listQuery);

  }
  
  return this.exports;
  
});