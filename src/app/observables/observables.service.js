angular.module('CarreEntrySystem').service('Observables', function($http, CARRE, CONFIG) {

  this.exports={
    'get': getObservables
  };
  
  function getObservables(ArrayOfIDs) {
    return CARRE.instances('observable',ArrayOfIDs);
  }

  return this.exports;
  
});