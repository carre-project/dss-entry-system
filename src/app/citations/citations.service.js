angular.module('CarreEntrySystem').service('Citations', function($http, CARRE, CONFIG,QUERY) {

  this.exports={
    'get': getCitations,
    'insert': insertCitation
  };
  
  function getCitations(ArrayOfIDs) {
    
    return CARRE.instances('citation',ArrayOfIDs).then(function(res){
      
      //get all citation study types and cache them into CONFIG object
      if(!CONFIG.CitationTypes && ArrayOfIDs) {
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
    console.log('Inserted citation by ',CONFIG.currentUser.graphName);
    user = user || CONFIG.currentUser.graphName;
    console.log('Old: ',oldElem);
    console.log('New: ',newElem);
    
    var updateQuery, deleteQuery, insertQuery = "";

    if (oldElem.id) {
      
      updateQuery = QUERY.update(oldElem,newElem);
      /* Update query */

      // deleteQuery = "WITH " + CONFIG.CARRE_DEFAULT_GRAPH + " DELETE { \n\
      //         <" + oldElem.id + "> risk:has_citation_pubmed_identifier ?citation_pubmed_identifier_var; \n\
      //         risk:has_citation_source_level ?source_level_var; \n\
      //         risk:has_citation_source_type ?source_type_var; \n\
      //         risk:has_citation_summary ?source_summary_var. \n";
      // deleteQuery += "              } WHERE { \n\
      //         <" + oldElem.id + "> risk:has_citation_pubmed_identifier ?citation_pubmed_identifier_var; \n\
      //         risk:has_citation_source_level ?source_level_var; \n\
      //         risk:has_citation_source_type ?source_type_var; \n\
      //         risk:has_citation_summary ?source_summary_var. \n";
      // deleteQuery += "}";

      // /*----------*/

      // insertQuery = "INSERT DATA { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " { \n\
      //         <" + oldElem.id + "> risk:has_citation_pubmed_identifier \"" + newElem.pubmedId + "\"^^xsd:string; \n\
      //         risk:has_citation_source_level \"" + newElem.level + "\"^^xsd:integer; \n\
      //         risk:has_citation_source_type  \"" + newElem.type + "\"^^xsd:string; \n\
      //         risk:has_citation_summary \"" + newElem.summary + "\"^^xsd:string . \n";
      // insertQuery += "              }}";
      

      // /*----------*/

      // updateQuery = deleteQuery + insertQuery;
      
      console.info('-----updateQuery------');
      // return CARRE.query(updateQuery);
      console.log(updateQuery);
    }
    else {
      /*Insert query*/

      insertQuery = QUERY.insert(newElem,"citation","CI",user);
      // insertQuery = "INSERT { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " { \n\
      //         ?newid risk:has_citation_pubmed_identifier \"" + newElem.pubmedId + "\"^^xsd:string; \n\
      //         risk:has_citation_source_level \"" + newElem.level + "\"^^xsd:integer; \n\
      //         risk:has_citation_source_type  \"" + newElem.type + "\"^^xsd:string; \n\
      //         risk:has_citation_summary \"" + newElem.summary + "\"^^xsd:string; \n";
              
      //         //add author
      //         insertQuery += "risk:has_author <" + user + ">; \n";
              
      //         //add type and close query
      //         insertQuery += "a risk:citation . } } WHERE \n\
      //     { GRAPH " + CONFIG.CARRE_DEFAULT_GRAPH + " \n\
      //     { { \n\
      //         SELECT ?oldindex FROM " + CONFIG.CARRE_DEFAULT_GRAPH + " \n\
      //         WHERE { \n\
      //         ?elem a risk:citation . \n\
      //           BIND (xsd:integer(strafter(STR(?elem),\"CI_\")) AS ?oldindex) \n\
      //         } ORDER BY DESC(?oldindex) LIMIT 1 \n\
      //       } \n\
      //       BIND (IRI(CONCAT(CI:, \"CI_\", ?oldindex+1)) AS ?newid) \n\
      //     } }";

      console.info('-----insertQuery------');
      // return CARRE.query(insertQuery);
      console.log(insertQuery);
    }

  }
  
  return this.exports;
  
});