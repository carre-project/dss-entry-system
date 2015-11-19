angular.module('CarreEntrySystem').service('Risk_evidences', function($http, CARRE, CONFIG) {

  this.exports={
    'get': getRisk_evidences
  };
  
  function getRisk_evidences(risk_evidenceStr,raw) {

    var listQuery = "SELECT * FROM "+CONFIG.CARRE_DEFAULT_GRAPH+" WHERE { \n\
             ?subject a risk:risk_evidence; ?predicate ?object.";

    //add filter to query if a single risk_evidence is requested
    if (risk_evidenceStr) listQuery += "FILTER ( regex(str(?subject),\""+risk_evidenceStr+"\",\"i\") )\n }";
    else listQuery += "}";
    if(!raw){
      return CARRE.selectQuery(listQuery).then(function(res){

        return res.data.map(function(obj) {
          //console.info('Risk_evidences:',risk_evidencesArray);
          /* Risk_evidences template
            has_author: Array[2]
            has_risk_evidence_pubmed_identifier: Array[1]
            has_risk_evidence_source_level: Array[2]
            has_risk_evidence_source_type: Array[2]
            has_reviewer: Array[2]
            id: "http://carre.kmi.open.ac.uk/risk_evidences/23271790"
            type: Array[1]
          */
          
          // make label like this
          // val.substring(val.lastIndexOf('/')+1));
          return {
            has_author: obj.has_author ? obj.has_author[0] : '',
            has_author_label: obj.has_author ? obj.has_author[0].substring(obj.has_author[0].lastIndexOf('/') + 1) : '',
            has_reviewer: obj.has_reviewer ? obj.has_reviewer.join(',') : '',
            id: obj.has_risk_evidence_pubmed_identifier ? obj.has_risk_evidence_pubmed_identifier[0] : obj.id,
            has_risk_evidence_source_type: obj.has_risk_evidence_source_type ? obj.has_risk_evidence_source_type[0] : '',
            has_risk_evidence_source_level: obj.has_risk_evidence_source_level ? obj.has_risk_evidence_source_level[0] : ''
          };
        });
      });
      
      //this is mostly used right now! so probably should go up
    } else return CARRE.selectQuery(listQuery);
  }

  return this.exports;
  
});