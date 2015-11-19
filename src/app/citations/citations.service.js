angular.module('CarreEntrySystem').service('Citations', function($http, CARRE) {

  this.exports={
    'get': getCitations,
    'insert': insertCitation,
    'update': updateCitation
  };
  
  function getCitations(citationStr,raw) {

    var listQuery = "SELECT * FROM <http://carre.kmi.open.ac.uk/beta> WHERE { \n\
             ?subject a risk:citation; ?predicate ?object.";

    //add filter to query if a single citation is requested
    if (citationStr) listQuery += "FILTER ( regex(str(?subject),\""+citationStr+"\",\"i\") )\n }";
    else listQuery += "}";
    if(!raw){
      return CARRE.selectQuery(listQuery).then(function(res){

        return res.data.map(function(obj) {
          //console.info('Citations:',citationsArray);
          /* Citations template
            has_author: Array[2]
            has_citation_pubmed_identifier: Array[1]
            has_citation_source_level: Array[2]
            has_citation_source_type: Array[2]
            has_reviewer: Array[2]
            id: "http://carre.kmi.open.ac.uk/citations/23271790"
            type: Array[1]
          */
          
          // make label like this
          // val.substring(val.lastIndexOf('/')+1));
          return {
            has_author: obj.has_author ? obj.has_author[0] : '',
            has_author_label: obj.has_author ? obj.has_author[0].substring(obj.has_author[0].lastIndexOf('/') + 1) : '',
            has_reviewer: obj.has_reviewer ? obj.has_reviewer.join(',') : '',
            id: obj.has_citation_pubmed_identifier ? obj.has_citation_pubmed_identifier[0] : obj.id,
            has_citation_source_type: obj.has_citation_source_type ? obj.has_citation_source_type[0] : '',
            has_citation_source_level: obj.has_citation_source_level ? obj.has_citation_source_level[0] : '',
          };
        });
      });
      
    } else return CARRE.selectQuery(listQuery);
  }

  function insertCitation(citationObj) {

    var insertQuery = "INSERT INTO  <http://carre.kmi.open.ac.uk/beta> { \n\
      <" + citationObj.citation.value + "> rdf:type risk:citation ; \n\
                          risk:has_author <" + citationObj.has_author.value + ">; \n\
                          risk:has_citation_pubmed_identifier '" + citationObj.has_citation_pubmed_identifier.value + "'^^xsd:int ; \n\
                          risk:has_reviewer <" + citationObj.has_reviewer.value + ">; \n\
            	            risk:has_citation_source_type '" + citationObj.has_citation_source_type.value + "'^^xsd:string; \n\
            	            risk:has_citation_source_level '" + citationObj.has_citation_source_level.value + "'^^xsd:int . \n\
    }";

  }

  function updateCitation(oldCitationObj, newCitationObj, archiveFlag) {

    //for the shake of complexity do not find diff and just resplace the whole thing. i mean it!!
    var updateQuery = "DELETE FROM <http://carre.kmi.open.ac.uk/beta> WHERE { \n\
                          <" + oldCitationObj.citation.value + "> rdf:type risk:citation ; \n\
                          risk:has_author <" + oldCitationObj.has_author.value + ">; \n\
                          risk:has_citation_pubmed_identifier '" + oldCitationObj.has_citation_pubmed_identifier.value + "'^^xsd:int ; \n\
                          risk:has_reviewer <" + oldCitationObj.has_reviewer.value + ">; \n\
            	            risk:has_citation_source_type '" + oldCitationObj.has_citation_source_type.value + "'^^xsd:string; \n\
            	            risk:has_citation_source_level '" + oldCitationObj.has_citation_source_level.value + "'^^xsd:int . \n\
                      } \n\
                      INSERT INTO  <http://carre.kmi.open.ac.uk/beta> { \n\
                          <" + newCitationObj.citation.value + "> rdf:type risk:citation ; \n\
                          risk:has_author <" + newCitationObj.has_author.value + ">; \n\
                          risk:has_citation_pubmed_identifier '" + newCitationObj.has_citation_pubmed_identifier.value + "'^^xsd:int ; \n\
                          risk:has_reviewer <" + newCitationObj.has_reviewer.value + ">; \n\
            	            risk:has_citation_source_type '" + newCitationObj.has_citation_source_type.value + "'^^xsd:string; \n\
            	            risk:has_citation_source_level '" + newCitationObj.has_citation_source_level.value + "'^^xsd:int . \n\
                      }";

  }
  
  return this.exports;
  
});