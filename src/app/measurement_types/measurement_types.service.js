angular.module('CarreEntrySystem').service('Measurement_types', function($http, CARRE, CONFIG) {

  this.exports={
    'get': getMeasurement_types
  };
  
  function getMeasurement_types(ArrayOfIDs) {
    return CARRE.instances('measurement_type',ArrayOfIDs);
  }

  return this.exports;
  
});