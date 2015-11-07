angular.module('CarreEntrySystem').service('CARRE', function($http,CONFIG,Auth) {

    /* Helpers */
    
    
    /* Super Array reduce helper for grouping triples into objects with default key the subject! */
    var groupByProp=function(data,triplesFormat,propIndex){
      var triplesFormat=triplesFormat||['subject','predicate','object'];
      var settingsObj={
        triplesFormat:triplesFormat,
        groupProp:triplesFormat[(propIndex||0)],
        propIndex:[],
        data:[]
      };
      return data.reduce(tripleAccumulator,settingsObj);
    }
    var tripleAccumulator=function(settings,obj){
    
      var id=obj[settings.groupProp];
      var index=settings.propIndex.indexOf(id);
      if(index===-1){
        //then push into the arrays
        settings.propIndex.push(id);
        settings.data.push({
          "id":id,
          "id_label":id.substring(id.lastIndexOf('/')+1)
        });
        //change index to the last item added
        index=settings.propIndex.length-1;
      }
      
      var rel=obj[settings.triplesFormat[1]].split("#")[1]||"_";
      var val=obj[settings.triplesFormat[2]];
      settings.data[index][rel]=settings.data[index][rel]||'';
      
      if(!settings.data[index][rel]) {
        settings.data[index][rel]=val;
        settings.data[index][rel+'_label']=val.substring(val.lastIndexOf('/')+1);
      }
        
      return settings;
    }
    
    /* The prefixes for CARRE*/
    var PREFIXSTR = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \n\
                    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n\
                    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n\
                    PREFIX sensors: <http://carre.kmi.open.ac.uk/ontology/sensors.owl#> \n\
                    PREFIX risk: <http://carre.kmi.open.ac.uk/ontology/risk.owl#> \n\
                    PREFIX carreManufacturer: <http://carre.kmi.open.ac.uk/manufacturers/> \n\
                    PREFIX carreUsers: <https://carre.kmi.open.ac.uk/users/> \n";
    
                    
    
    /* Auth Required */
    var apiQuery=function(sparqlQuery) {

        //add prefixes
        sparqlQuery = PREFIXSTR + sparqlQuery;
        console.info('Final query: ', sparqlQuery);

        return $http.post(CONFIG.API + 'query', {
            'sparql': sparqlQuery,
            'token': Auth.cookie
        });
    };
    
    
    /* Auth not required */
    var apiInstances = function(instanceType) {
      
        return $http.get(CONFIG.API + 'instances?type='+instanceType).then(function(res){
            /*
            You can configure triplet variable names and group by index of property.
            e.g groupByProp(data,["citation","relation","value"],0).data groups by citation
            */
            var results=groupByProp(res.data);
            if(results.data.length>0) return results.data;
            else return [];
        });
    };
    
    return {
        'toObj':groupByProp,
        'query':apiQuery,
        'instances':apiInstances
    }
});