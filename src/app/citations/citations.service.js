angular.module('CarreEntrySystem').service('Citations', function($http, CARRE, CONFIG) {

  this.exports={
    'get': getCitations,
    'insert': insertCitation
  };
  
  function getCitations(ArrayOfIDs) {
    
    return CARRE.instances('citation',ArrayOfIDs).then(function(res){
      
      //get all citation study types and cache them into CONFIG object
      if(!CONFIG.CitationTypes) {
        CONFIG.CitationTypes=[];
        res.data.forEach(function(obj){
          if (CONFIG.CitationTypes.indexOf(obj.has_citation_source_type_label)===-1){
            CONFIG.CitationTypes.push(obj.has_citation_source_type_label);
          }
        });
      }
      return res;
    });
    
  }

  function insertCitation(oldElem, newElem, user) {
    
    console.log('Old: ',oldElem);
    console.log('New: ',newElem);
    
    var updateQuery, deleteQuery, insertQuery = "";

    if (oldElem.id) {

      /* Update query */

      deleteQuery = "DELETE DATA { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " { \n\
              <" + oldElem.id + "> risk:has_citation_pubmed_identifier ?citation_pubmed_identifier_var \n\
              risk:has_citation_source_level ?source_level_var \n\
              risk:has_citation_source_type ?source_type_var; \n\
              risk:has_citation_summary ?source_summary_var; \n";
      deleteQuery += "              }} \n";

      /*----------*/

      insertQuery = "INSERT DATA { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " { \n\
              <" + oldElem.id + "> risk:has_citation_pubmed_identifier \"" + newElem.pubmedId + "\"^^xsd:string; \n\
              risk:has_citation_source_level \"" + newElem.level + "\"^^xsd:integer; \n\
              risk:has_citation_source_type <" + newElem.type + ">; \n\
              risk:has_citation_summary <" + newElem.summary + ">; \n";
      insertQuery += "              }}";
      

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