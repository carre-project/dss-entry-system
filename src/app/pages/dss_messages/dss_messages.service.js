angular.module('CarreEntrySystem').service('DSS_messages', function($http, CARRE, CONFIG, QUERY) {

  this.exports={
    'get': getdss_messages,
    'save': savedss_message
  };
  
  function getdss_messages(ArrayOfIDs,raw) {
    return CARRE.instances('dss_message',ArrayOfIDs);
  }
  
  function savedss_message(oldElem, newElem, user) {
    user = user || CONFIG.currentUser.graphName;
    var updateQuery = "",insertQuery = "";
    var newObj = {};
    
    if(newElem.source.length>0) newObj.has_dss_message_source = {pre:'dss',value:newElem.source,type:"node"};
    if(newElem.target.length>0) newObj.has_dss_message_target = {pre:'dss',value:newElem.target.toString(),type:"node"};
    if(newElem.type.length>0) newObj.has_dss_message_association_type = {pre:'dss',value:newElem.type.toString(),type:"node"};
    
    console.log('Old: ',oldElem);
    console.log('New: ',newElem);
    console.log('Mapped: ',newObj);
    
    /* invalidate Risk factors and Risk evidences */
    CARRE.invalidateCache('dss_message_all');
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
      insertQuery = QUERY.insert(newObj,"dss_message","RF",user);
      console.info('-----insertQuery------');
      return CARRE.query(insertQuery,'no prefix');
    }

  }
  
  return this.exports;
  
});