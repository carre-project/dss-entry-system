angular.module('CarreEntrySystem').service('Risk_elements', function($http, CARRE, CONFIG) {

  this.exports = {
    'get': getRisk_elements
  };

  function getRisk_elements(ArrayOfIDs) {
    return CARRE.instances('risk_element', ArrayOfIDs);
  }

  return this.exports;

});