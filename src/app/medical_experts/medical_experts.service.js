(function() {
  'use strict';

angular.module('CarreEntrySystem').service('Medical_experts', function($http, CARRE, CONFIG, $q) {

  this.exports = {
    'get': getMedical_experts,
    // 'insert': insertMedical_expert
  };

  function getMedical_experts(ArrayOfIDs) {
    return CARRE.instances('medical_expert', ArrayOfIDs);
  }


  return this.exports;

});

})();