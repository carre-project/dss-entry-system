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
    if(!raw){
      return CARRE.selectQuery(listQuery).then(function(res){

        return res.data.map(function(obj) {
          //console.info('Observables:',observablesArray);
          /* Observables template
            has_author: Array[2]
            has_observable_pubmed_identifier: Array[1]
            has_observable_source_level: Array[2]
            has_observable_source_type: Array[2]
            has_reviewer: Array[2]
            id: "http://carre.kmi.open.ac.uk/observables/23271790"
            type: Array[1]
          */
          
          // make label like this
          // val.substring(val.lastIndexOf('/')+1));
          return {
            has_author: obj.has_author ? obj.has_author[0] : '',
            has_author_label: obj.has_author ? obj.has_author[0].substring(obj.has_author[0].lastIndexOf('/') + 1) : '',
            has_reviewer: obj.has_reviewer ? obj.has_reviewer.join(',') : '',
            id: obj.has_observable_pubmed_identifier ? obj.has_observable_pubmed_identifier[0] : obj.id,
            has_observable_source_type: obj.has_observable_source_type ? obj.has_observable_source_type[0] : '',
            has_observable_source_level: obj.has_observable_source_level ? obj.has_observable_source_level[0] : ''
          };
        });
      });
      
      //this is mostly used right now! so probably should go up
    } else return CARRE.selectQuery(listQuery);
  }

  return this.exports;
  
});