angular.module('CarreEntrySystem').service('Risk_factors', function($http, CARRE, CONFIG) {

  this.exports={
    'get': getRisk_factors
  };
  
  function getRisk_factors(ArrayOfIDs,raw) {
    return CARRE.instances('risk_factor',ArrayOfIDs);
  }

  return this.exports;
  
});