angular.module('CarreEntrySystem').service('Risk_factors', function($http, CARRE, CONFIG, QUERY) {

  this.exports={
    'get': getRisk_factors,
    'save': saveRisk_factor,
    'risk_evidences': getRisk_evidencesFromRisk_Factor
  };
  
  function getRisk_factors(ArrayOfIDs,raw) {
    return CARRE.instances('risk_factor',ArrayOfIDs);
  }
  
  function saveRisk_factor(oldElem, newElem, user) {
    user = user || CONFIG.currentUser.graphName;
    var updateQuery = "",insertQuery = "";
    var newObj = {};
    
    if(newElem.source.length>0) newObj.has_risk_factor_source = {pre:'risk',value:newElem.source,type:"node"};
    if(newElem.target.length>0) newObj.has_risk_factor_target = {pre:'risk',value:newElem.target.toString(),type:"node"};
    if(newElem.type.length>0) newObj.has_risk_factor_association_type = {pre:'risk',value:newElem.type.toString(),type:"node"};
    
    console.log('Old: ',oldElem);
    console.log('New: ',newElem);
    console.log('Mapped: ',newObj);
    
    /* invalidate Risk factors and Risk evidences */
    CARRE.invalidateCache('risk_factor_all');
    CARRE.invalidateCache('risk_evidence_all');
    CARRE.invalidateCache('count_all');

    if (oldElem.id) {
      /*Update query*/
      updateQuery = QUERY.update(oldElem,newObj);
      console.log('----Update Query----');
      return CARRE.query(updateQuery,'no prefix');
    }
    else {
      /*Insert query*/
      insertQuery = QUERY.insert(newObj,"risk_factor","RF",user);
      console.info('-----insertQuery------');
      return CARRE.query(insertQuery,'no prefix');
    }

  }
  

  function getRisk_evidencesFromRisk_Factor(ArrayOfIDs) {
    console.log("getRisk_evidencesFromRisk_Factor",ArrayOfIDs);
    
    ArrayOfIDs = ArrayOfIDs ? (ArrayOfIDs instanceof Array ? ArrayOfIDs : [ArrayOfIDs]) : [];
    
    var listQuery = "SELECT * FROM " + CONFIG.CARRE_DEFAULT_GRAPH + " WHERE { \n\
             ?subject a risk:risk_evidence; ?predicate ?object. \n\
             ?subject risk:has_risk_factor ?filter. \n\
             VALUES (?filter) { "+ArrayOfIDs.map(function(id) { return "(" + id.split('_')[0] + ":" + id+ ')'; }).join(" ")+" } \n\
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
              } \n";
              
    //add filter to query if a single observable is requested
    listQuery += " }";
    console.log("getRisk_evidencesFromRisk_Factor: ",listQuery);
    return CARRE.selectQuery(listQuery);//,null,'risk_evidences_for_'+ArrayOfIDs.join("_"));
   

  }
  
  return this.exports;
  
});