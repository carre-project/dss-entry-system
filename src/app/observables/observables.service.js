angular.module('CarreEntrySystem').service('Observables', function($http, CARRE, CONFIG) {

  this.exports={
    'get': getObservables
  };
  
  function getObservables(observableStr,raw) {

    var listQuery = "SELECT * FROM "+CONFIG.CARRE_DEFAULT_GRAPH+" WHERE { \n\
             ?subject a risk:observable; ?predicate ?object.";

    //add filter to query if a single observable is requested
    if (observableStr) listQuery += "FILTER ( regex(str(?subject),\""+observableStr+"\",\"i\") )\n }";
    else listQuery += "}";
    
    
    return CARRE.selectQuery(listQuery);
  }

  return this.exports;
  
});