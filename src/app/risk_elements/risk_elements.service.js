angular.module('CarreEntrySystem').service('Risk_elements', function($http, CARRE, CONFIG, QUERY) {

  this.exports = {
    'get': getRisk_elements,
    'save': saveRisk_element
  };

  function getRisk_elements(ArrayOfIDs) {
    return CARRE.instances('risk_element', ArrayOfIDs);
  }

  function saveRisk_element(oldElem, newElem, user) {
    user = user || CONFIG.currentUser.graphName;
    var updateQuery = "",insertQuery = "";
    var newObj = {};
    if(newElem.name.length>0) newObj.has_risk_element_name = {pre:'risk',value:newElem.name.toString(),type:"string"};
    if(newElem.identifier.length>0) newObj.has_risk_element_identifier = {pre:'risk',value:"http://umls.nlm.nih.gov/sab/mth/cui/"+newElem.identifier.toString(),type:"node"};
    if(newElem.type.length>0) newObj.has_risk_element_type = {pre:'risk',value:newElem.type.toString(),type:"node"};
    if(newElem.modifiable_status.length>0) newObj.has_risk_element_modifiable_status = {pre:'risk',value:newElem.modifiable_status.toString(),type:"string"};
    if(newElem.observables.length>0) newObj.has_risk_element_observable = {pre:'risk',value:newElem.observables,type:"node"};
    if(newElem.risk_elements.length>0) newObj.includes_risk_element = {pre:'risk',value:newElem.risk_elements,type:"node"};
    
    
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
      insertQuery = QUERY.insert(newObj,"risk_element","RL",user);
      console.info('-----insertQuery------');
      return CARRE.query(insertQuery,'no prefix');
    }

  }
  
  return this.exports;

});