angular.module('CarreEntrySystem').service('CARRE', function($http, CONFIG, Auth) {

  this.exports = {
    'count': countInstance,
    'countAll': countAllInstances,
    'query': apiQuery,
    'selectQuery': selectQuery,
    'instances': queryInstances
  };

  /*

                      PREFIX carreManufacturer: <http://carre.kmi.open.ac.uk/manufacturers/> \n\
                      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n\
                      PREFIX sensors: <http://carre.kmi.open.ac.uk/ontology/sensors.owl#> \n\
  */
  /* The prefixes for CARRE*/
  var PREFIXSTR = " PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \n\
                    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n\
                    PREFIX carreUsers: <https://carre.kmi.open.ac.uk/users/> \n\
                    PREFIX risk: <http://carre.kmi.open.ac.uk/ontology/risk.owl#> \n\
                    PREFIX ME: <http://carre.kmi.open.ac.uk/measurement_types/> \n\
                    PREFIX OB: <http://carre.kmi.open.ac.uk/observables/> \n\
                    PREFIX RL: <http://carre.kmi.open.ac.uk/risk_elements/> \n\
                    PREFIX RV: <http://carre.kmi.open.ac.uk/risk_evidences/> \n\
                    PREFIX RF: <http://carre.kmi.open.ac.uk/risk_factors/> \n\
                    PREFIX CI: <http://carre.kmi.open.ac.uk/citations/> \n";


  function queryInstances(type, ArrayOfIDs) {

    var listQuery = "SELECT * FROM " + CONFIG.CARRE_DEFAULT_GRAPH + " WHERE { \n\
             ?subject a risk:" + type + "; ?predicate ?object. ";


    //add filter to query if a single observable is requested
    if (ArrayOfIDs) {
      listQuery += "FILTER ( " + ArrayOfIDs.map(function(id) {
        return "?subject=" + id.split('_')[0] + ":" + id;
      }).join("||") + "  )\n }";
    }
    else listQuery += "}";

    return selectQuery(listQuery);

  }

  /* Dashboard count instances methods */
  function countInstance(instanceType) {
    var query = "SELECT ?s (COUNT(?r) as ?reviews) FROM " + CONFIG.CARRE_DEFAULT_GRAPH + " WHERE { ?s a risk:" + instanceType + " . OPTIONAL {?s risk:has_reviewer ?r .} } GROUP BY ?s";
    return apiQuery(query).then(function(res) {
      var sum = 0;
      res.data.forEach(function(obj) {
        if (obj.reviews.value === '0') sum += 1;
      });
      return {
        total: res.data.length,
        noreviews: sum
      };
    });
  }

  function countAllInstances(instanceType) {
    var query = "SELECT ?s (COUNT(?r) as ?reviews) FROM " + CONFIG.CARRE_DEFAULT_GRAPH + " WHERE { ?s a risk:" + instanceType + " . OPTIONAL {?s risk:has_reviewer ?r .} } GROUP BY ?s";
    return apiQuery(query).then(function(res) {
      var sum = 0;
      res.data.forEach(function(obj) {
        if (obj.reviews.value === '0') sum += 1;
      });
      return {
        total: res.data.length,
        noreviews: sum
      };
    });
  }


  /* Easy select query to transform triples to javascript objects */
  function selectQuery(sparqlQuery, raw) {
    return apiQuery(sparqlQuery).then(function(res) {
      /*
      You can configure triplet variable names and group by index of property.
      e.g groupByProp(data,["citation","relation","value"],0).data groups by citation
      */
      if (raw) return res;
      var results = groupByProp(res.data, ['subject','predicate','object','has_observable_name','has_risk_element_name','has_measurement_type_name','has_risk_factor_association_type','has_risk_factor_source','has_risk_factor_target','has_source_risk_element_name','has_target_risk_element_name'], null, 'value');
      if (results.data.length > 0) return results;
      else return [];
    });
  }



  /* CORE query method*/
  function apiQuery(sparqlQuery) {

    var params = {};
    //add prefixes
    params.sparql = PREFIXSTR + sparqlQuery;
    // use token
    if (Auth.cookie) params.token = Auth.cookie;

    console.info('Final query: ', params.sparql);
    return $http.post(CONFIG.CARRE_API_URL + 'query', params);

  }
  
  
  
/* ======================IMPORTANT SPARQL QUERIES =============================*/
    /* Try to fill the names of other elements */
    /*
#try to fetch linked observables,risk_elements,measurements,risk_factors details from ids

#observable stuff
OPTIONAL {  
 ?object a risk:observable.
 ?object risk:has_observable_name ?has_observable_name
}
#risk element stuff
OPTIONAL {  
 ?object a risk:risk_element.
 ?object risk:has_risk_element_name ?has_risk_element_name
}
#measurement stuff
OPTIONAL {  
 ?object a risk:measurement_type.
 ?object risk:has_measurement_type_name ?has_measurement_type_name
}
#risk factor stuff
OPTIONAL {  
 ?object a risk:risk_factor.
 ?object risk:has_risk_factor_association_type ?has_risk_factor_association_type.
 ?object risk:has_risk_factor_source ?has_risk_factor_source.
 ?object risk:has_risk_factor_target ?has_risk_factor_target.
 ?has_risk_factor_source risk:has_risk_element_name ?has_source_risk_element_name.
 ?has_risk_factor_target risk:has_risk_element_name ?has_target_risk_element_name.
}
}
    */


  /* Helpers */


  /* Super Array reduce helper for grouping triples into objects with default key the subject! */
  function groupByProp(data, triplesFormat, propIndex, valueProp) {
    triplesFormat = triplesFormat || ['subject', 'predicate', 'object'];
    var settingsObj = {
      triplesFormat: triplesFormat,
      groupProp: triplesFormat[(propIndex || 0)],
      valueProp: valueProp,
      keys: [],
      fields: [],
      data: []
    };
    return data.reduce(tripleAccumulator, settingsObj);
  }

  function tripleAccumulator(settings, obj) {


    var id, rel, val = '';
    if (settings.valueProp) {
      id = obj[settings.groupProp][settings.valueProp];
      rel = obj[settings.triplesFormat[1]][settings.valueProp].split("#")[1] || "_";
      val = obj[settings.triplesFormat[2]][settings.valueProp];
    }
    else {
      id = obj[settings.groupProp];
      rel = obj[settings.triplesFormat[1]].split("#")[1] || "_";
      val = obj[settings.triplesFormat[2]];
    }


    /*  Filter educational objects  */
    if (rel === 'has_educational_material') return settings;



    if (settings.fields.indexOf(rel) === -1) settings.fields.push(rel);
    var index = settings.keys.indexOf(id);
    if (index === -1) {
      //then push into the arrays
      settings.keys.push(id);
      settings.data.push({
        "id": id,
        "id_label": id.indexOf('#') >= 0 ? id.split('#')[1] : id.substring(id.lastIndexOf('/') + 1)
      });
      //change index to the last item added
      index = settings.keys.length - 1;
    }
    settings.data[index][rel] = settings.data[index][rel] || [];
    settings.data[index][rel].push(val);

    //add label for each value
    val = (val.indexOf('#') >= 0 ? val.split('#')[1] : val);
    settings.data[index][rel + '_label'] = settings.data[index][rel + '_label'] || '';
    settings.data[index][rel + '_label'] += (settings.data[index][rel + '_label'].length > 0 ? ',' : '') + val.substring(val.lastIndexOf('/') + 1);

    return settings;
  }




  return this.exports;
});