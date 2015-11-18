angular.module('CarreEntrySystem').service('CARRE', function($http, CONFIG, Auth) {

  this.exports={
    'count':countInstance,
    'query': apiQuery,
    'instances': apiInstances,
    'virtuosoQuery': sparqlEndpointQuery
  };


  /* The prefixes for CARRE*/
  var PREFIXSTR = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \n\
                    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n\
                    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n\
                    PREFIX sensors: <http://carre.kmi.open.ac.uk/ontology/sensors.owl#> \n\
                    PREFIX risk: <http://carre.kmi.open.ac.uk/ontology/risk.owl#> \n\
                    PREFIX carreManufacturer: <http://carre.kmi.open.ac.uk/manufacturers/> \n\
                    PREFIX carreUsers: <https://carre.kmi.open.ac.uk/users/> \n";
                    
  /* Auth Required */
  function apiQuery(sparqlQuery) {

    //add prefixes
    sparqlQuery = PREFIXSTR + sparqlQuery;
    // console.info('Final query: ', sparqlQuery);
    return $http.post(CONFIG.CARRE_API_URL + 'query', {
      'sparql': sparqlQuery,
      'token': Auth.cookie
    });
  }


  /* Auth not required */
  function countInstance(instanceType){
    var query="SELECT ?s (COUNT(?r) as ?reviews) WHERE { ?s a risk:"+instanceType+" . OPTIONAL {?s risk:has_reviewer ?r .} } GROUP BY ?s";
    return sparqlEndpointQuery(query,true).then(function(res){
      var sum=0;
      res.data.results.bindings.forEach(function(obj){
        if(obj.reviews.value==='0') sum+=1;
      })
      return {
        total:res.data.results.bindings.length,
        noreviews:sum
      }
    });
  }
  
  function sparqlEndpointQuery(sparqlQuery,raw) {
    
    //add prefixes
    sparqlQuery = PREFIXSTR + sparqlQuery;
    // console.info('Final query: ', sparqlQuery);
      
    return $http.get(CONFIG.CARRE_SPARQL_ENDPOINT,{
      params: { 
        query: sparqlQuery,
        format:'application/sparql-results+json'
      }
    })
    .then(function(res) {
      
      /*
      You can configure triplet variable names and group by index of property.
      e.g groupByProp(data,["citation","relation","value"],0).data groups by citation
      */
      if(raw) return res;
      var results = groupByProp(res.data.results.bindings,null,null,'value');
      if (results.data.length > 0) return results;
      else return [];
    });
  }



  // /* Auth not required */
  function apiInstances(instanceType,raw) {
      
      var callInstance=$http.get(CONFIG.CARRE_API_URL + 'instances?type=' + instanceType).then(function(res) {

      /* Instances bug */
      // if(res.data[0].object.indexOf(instanceType)===-1) {
      //   console.log(instanceType+ ' != '+res.data[0].object);
      //   console.log('TELL ALLAN about this! It confused and instead of citation returned this: ', res.data[0].object);
      //   return callInstance; 
      // }
      /* End of bug */
      
      /*
      You can configure triplet variable names and group by index of property.
      e.g groupByProp(data,["citation","relation","value"],0).data groups by citation
      */
      if(raw) return res;
      var results = groupByProp(res.data);
      if (results.data.length > 0) return results;
      else return [];
    });
    return callInstance;
  }


  /* Helpers */


  /* Super Array reduce helper for grouping triples into objects with default key the subject! */
  function groupByProp(data, triplesFormat, propIndex,valueProp) {
    triplesFormat = triplesFormat || ['subject', 'predicate', 'object'];
    var settingsObj = {
      triplesFormat: triplesFormat,
      groupProp: triplesFormat[(propIndex || 0)],
      valueProp:valueProp,
      keys: [],
      data: []
    };
    return data.reduce(tripleAccumulator, settingsObj);
  }
  function tripleAccumulator(settings, obj) {
    var id,rel,val='';
    if(settings.valueProp) {
      id = obj[settings.groupProp][settings.valueProp];
      rel = obj[settings.triplesFormat[1]][settings.valueProp].split("#")[1] || "_";
      val = obj[settings.triplesFormat[2]][settings.valueProp];
    } else {
      id = obj[settings.groupProp];
      rel = obj[settings.triplesFormat[1]].split("#")[1] || "_";
      val = obj[settings.triplesFormat[2]];
    }
    var index = settings.keys.indexOf(id);
    if (index === -1) {
      //then push into the arrays
      settings.keys.push(id);
      settings.data.push({
        "id": id
      });
      //change index to the last item added
      index = settings.keys.length - 1;
    }
    settings.data[index][rel] = settings.data[index][rel] || [];
    settings.data[index][rel].push(val);

    return settings;
  }




  return this.exports;
});