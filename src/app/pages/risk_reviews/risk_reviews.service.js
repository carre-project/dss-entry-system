angular.module('CarreEntrySystem').service('Risk_reviews', function($http, CARRE, CONFIG, QUERY,$timeout) {

  this.exports={
    'get': getRisk_reviews,
    'save': saveRisk_review
  };
  
  
  function saveRisk_review(oldElem, newElem, user) {
    user = user || CONFIG.currentUser.graphName;
    var updateQuery = "",insertQuery = "";
    var newObj = {};
    
    if(newElem.elemId.length>0) newObj.is_for_element = {pre:'risk',value:newElem.elemId,type:"node"};
    if(newElem.assigned_to.length>0) newObj.is_assigned_to = {pre:'risk',value:newElem.assigned_to.toString(),type:"node"};
    if(newElem.notes.length>0) newObj.has_review_notes = {pre:'risk',value:newElem.notes.toString(),type:"string"};
    // if(newElem.json.length>0) newObj.has_review_json = {pre:'risk',value:newElem.notes.toString(),type:"string"};
    if(newElem.review_date.length>0) newObj.review_date = {pre:'risk',value:newElem.review_date.toString(),type:"date"};
    if(newElem.assign_date.length>0) newObj.assign_date = {pre:'risk',value:newElem.assign_date.toString(),type:"date"};
    if(newElem.review_status.length>0) newObj.review_status = {pre:'risk',value:newElem.review_status.toString(),type:"string"};
    
    console.log('Old: ',oldElem);
    console.log('New: ',newElem);
    console.log('Mapped: ',newObj);

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
  

  function getRisk_reviews(ArrayOfIDs) {
    
    ArrayOfIDs = ArrayOfIDs ? (ArrayOfIDs instanceof Array ? ArrayOfIDs : [ArrayOfIDs]) : [];
    ArrayOfIDs = ['MD_1','MD_2','MD_3','MD_4'];
    var filter = ArrayOfIDs.length>0?"FILTER ( \n\
             "+ArrayOfIDs.map(function(id) { 
               var fid=id.split("_")[0] + ":" + id;
               return "( ?Authorfilter="+fid+" || ?Reviewerfilter="+fid+" )"; 
             }).join(" || ")+" \n\
             )":"";
    
    var listQuery = "SELECT * FROM " + CONFIG.CARRE_DEFAULT_GRAPH + " WHERE { \n\
             ?subject a risk:risk_review; ?predicate ?object. \n\
             ?subject risk:is_for_element ?elem_id.  \n\
             ?elem_id risk:has_author ?Authorfilter. \n\
             ?subject risk:is_assigned_to ?Reviewerfilter. \n\
             "+filter+" \n\
              OPTIONAL {    \n\
               ?object a risk:medical_expert. \n\
               ?object risk:has_citation_pubmed_identifier ?has_citation_pubmed_identifier  \n\
              } \n\
              OPTIONAL {    \n\
               ?object a risk:risk_evidence. \n\
               ?object risk:has_observable_name ?has_observable_name  \n\
              } \n\
              OPTIONAL {    \n\
               ?object a risk:risk_element. \n\
               ?object risk:has_risk_element_name ?has_risk_element_name  \n\
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
    return CARRE.selectQuery(listQuery);//,null,'risk_evidences_for_'+ArrayOfIDs.join("_"));
   

  }
  
  return this.exports;
  
});