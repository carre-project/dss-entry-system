angular.module('CarreEntrySystem').service('Citations', function($http, CARRE, CONFIG,QUERY) {

  this.exports={
    'types': getCitationTypes,
    'get': getCitations,
    'save': saveCitation
  };
  
  function getCitations(ArrayOfIDs) { return CARRE.instances('citation',ArrayOfIDs); }
  
  function getCitationTypes() {
    var query="PREFIX risk: <http://carre.kmi.open.ac.uk/ontology/risk.owl#> \n\
              SELECT ?citationType FROM "+CONFIG.CARRE_DEFAULT_GRAPH+" WHERE { ?subject a risk:citation; risk:has_citation_source_type ?citationType}";
    return CARRE.query(query,'no prefix').then(function(res){
      var types=[];
      if(res.data instanceof Array) {
        res.data.forEach(function(obj){
          var type=obj.citationType.value;
          if(type.length>0 && types.indexOf(type)===-1) types.push(type);
        });
      }
      return types;
    });
  }

  function saveCitation(oldElem, newElem, user) {
    console.log('Inserted citation by ',CONFIG.currentUser.graphName);
    user = user || CONFIG.currentUser.graphName;
    var newObj = mapper(newElem);
    console.log('Old: ',oldElem);
    console.log('New: ',newElem);
    console.log('Mapped: ',newObj);
    
    var updateQuery = "",insertQuery = "";

    if (oldElem.id) {
      /*Update query*/
      updateQuery = QUERY.update(oldElem,newObj);
      console.log('----Update Query----');
      return CARRE.query(updateQuery,'no prefix');
    }
    else {
      /*Insert query*/
      insertQuery = QUERY.insert(newObj,"citation","CI",user);
      console.info('-----insertQuery------');
      return CARRE.query(insertQuery,'no prefix');
    }

  }
  
  //map the final object to rdf properties
  function mapper(obj){
    return {
      has_citation_source_type: {pre:'risk',value:obj.type.toString(),type:"string"},
      has_citation_source_level: {pre:'risk',value:obj.level.toString(),type:"integer"},
      has_citation_summary: {pre:'risk',value:obj.summary.toString(),type:"string"},
      has_citation_pubmed_identifier: {pre:'risk',value:obj.pubmedId.toString(),type:"string"}
    };
  }
  
  return this.exports;
  
});