angular.module('CarreEntrySystem').service('Risk_evidences', function($http, CARRE, CONFIG, QUERY) {

  this.exports = {
    'get': getRisk_evidences,
    'adjusted_for': getRisk_evidenceAdjusted_for,
    'save': saveRisk_evidence

  };

  function getRisk_evidenceAdjusted_for() {
    var query="PREFIX risk: <http://carre.kmi.open.ac.uk/ontology/risk.owl#> \n\
              SELECT ?adjusted_for FROM "+CONFIG.CARRE_DEFAULT_GRAPH+" WHERE { ?subject a risk:risk_evidence; risk:is_adjusted_for ?adjusted_for}";
    return CARRE.query(query,'no prefix').then(function(res){
      var types=[];
      if(res.data instanceof Array) {
        res.data.forEach(function(obj){
          var arr=obj.adjusted_for.value.split(",");
          arr.forEach(function(elem){
            elem=elem.trim().toLocaleLowerCase();
            if(elem.length>0 && types.indexOf(elem)===-1) types.push(elem);
          });
        });
      }
      return types;
    });
  }
  
  function getRisk_evidences(ArrayOfIDs) {
    return CARRE.instances('risk_evidence', ArrayOfIDs);
  }

  function saveRisk_evidence(oldElem, newElem, user) {
    user = user || CONFIG.currentUser.graphName;
    var updateQuery = "",insertQuery = "";
    var newObj = {};
    
    if(newElem.observables.length>0) newObj.has_risk_evidence_observable = {pre:'risk',value:newElem.observables,type:"node"};
    if(newElem.ratio_type.length>0) newObj.has_risk_evidence_ratio_type = {pre:'risk',value:newElem.ratio_type.toString(),type:"node"};
    if(newElem.ratio_value.length>0) newObj.has_risk_evidence_ratio_value = {pre:'risk',value:newElem.ratio_value.toString(),type:"float"};
    if(newElem.confidence_interval_min.length>0) newObj.has_confidence_interval_min = {pre:'risk',value:newElem.confidence_interval_min.toString(),type:"float"};
    if(newElem.confidence_interval_max.length>0) newObj.has_confidence_interval_max = {pre:'risk',value:newElem.confidence_interval_max.toString(),type:"float"};
    if(newElem.risk_factor.length>0) newObj.has_risk_factor = {pre:'risk',value:newElem.risk_factor,type:"node"};
    if(newElem.evidence_source.length>0) newObj.has_risk_evidence_source = {pre:'risk',value:newElem.evidence_source.toString(),type:"node"};
    if(newElem.adjusted_for.length>0) newObj.is_adjusted_for = {pre:'risk',value:newElem.adjusted_for.join(","),type:"string"};
    if(newElem.condition.length>0) {
      newObj.has_observable_condition = {pre:'risk',value:newElem.condition.toString(),type:"string"};
      newObj.has_observable_condition_json = {pre:'risk',value:newElem.condition_json.toString(),type:"string"};
      newObj.has_observable_condition_text = {pre:'risk',value:newElem.condition_text.toString(),type:"string"};
    }
    
    
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
      insertQuery = QUERY.insert(newObj,"risk_evidence","RV",user);
      console.info('-----insertQuery------');
      return CARRE.query(insertQuery,'no prefix');
    }

  }

  return this.exports;

});