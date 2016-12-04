angular.module('CarreEntrySystem').service('Risk_alerts', function($http, CARRE, CONFIG, QUERY) {

  this.exports = {
    'get': getRisk_alerts,
    'save': saveRisk_alert

  };
  
  function getRisk_alerts(ArrayOfIDs) {
    return CARRE.instances('risk_alert', ArrayOfIDs);
  }

  /* This needs to be modified to map the form variables to SPARQL predicates*/
  /* 
    e.g. newElem.ratio_type <-> newObj.has_risk_alert_ratio_type 
  */
  function saveRisk_alert(oldElem, newElem, user) {
    user = user || CONFIG.currentUser.graphName;
    var updateQuery = "",insertQuery = "";
    var newObj = {};
    
    if(newElem.observables.length>0) newObj.has_risk_alert_observable = {pre:'dss',value:newElem.observables,type:"node"};
    if(newElem.ratio_type.length>0) newObj.has_risk_alert_ratio_type = {pre:'dss',value:newElem.ratio_type.toString(),type:"node"};
    if(newElem.ratio_value) newObj.has_risk_alert_ratio_value = {pre:'dss',value:newElem.ratio_value,type:"decimal"};
    if(newElem.confidence_interval_min) newObj.has_confidence_interval_min = {pre:'dss',value:newElem.confidence_interval_min,type:"decimal"};
    if(newElem.confidence_interval_max) newObj.has_confidence_interval_max = {pre:'dss',value:newElem.confidence_interval_max,type:"decimal"};
    if(newElem.risk_factor.length>0) newObj.has_risk_factor = {pre:'dss',value:newElem.risk_factor,type:"node"};
    if(newElem.evidence_source.length>0) newObj.has_risk_alert_source = {pre:'dss',value:newElem.evidence_source.toString(),type:"node"};
    if(newElem.adjusted_for.length>0) newObj.is_adjusted_for = {pre:'dss',value:newElem.adjusted_for.join(","),type:"string"};
    if(newElem.condition.length>0) {
      newObj.has_risk_alert_condition = {pre:'dss',value:newElem.condition.toString(),type:"string"};
      newObj.has_risk_alert_condition_json = {pre:'dss',value:newElem.condition_json.toString(),type:"string"};
      newObj.has_risk_alert_condition_text = {pre:'dss',value:newElem.condition_text.toString(),type:"string"};
    }
    
    
    console.log('Old: ',oldElem);
    console.log('New: ',newElem);
    console.log('Mapped: ',newObj);
    
    /* invalidate Risk factors and Risk evidences */
    CARRE.invalidateCache('risk_factor_all');
    CARRE.invalidateCache('risk_alert_all');
    CARRE.invalidateCache('count_all');

    if (oldElem.id) {
      /*Update query*/
      updateQuery = QUERY.update(oldElem,newObj);
      console.log('----Update Query----');
      return CARRE.query(updateQuery,'no prefix');
    }
    else {
      /*Insert query*/
      insertQuery = QUERY.insert(newObj,"risk_alert","RV",user);
      console.info('-----insertQuery------');
      return CARRE.query(insertQuery,'no prefix');
    }

  }

  return this.exports;

});