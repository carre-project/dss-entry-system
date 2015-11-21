angular.module('CarreEntrySystem').service('Risk_evidences', function($http, CARRE, CONFIG) {

  this.exports={
    'get': getRisk_evidences
  };
  
  function getRisk_evidences(ArrayOfIDs) {
    return CARRE.instances('risk_evidence',ArrayOfIDs);
  }

  return this.exports;
  
});