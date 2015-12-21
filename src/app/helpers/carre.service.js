angular.module('CarreEntrySystem').service('CARRE', function($http, CONFIG, Auth, RdfFormatter,$q,toastr,$state) {

  this.exports = {
    // 'count': countInstance,
    'countAll': countAllInstances,
    'query': apiQuery,
    'selectQuery': selectQuery,
    'instances': queryInstances,
    'delete': deleteInstance
  };

  /*

                      PREFIX carreManufacturer: <http://carre.kmi.open.ac.uk/manufacturers/> \n\
                      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n\
                      PREFIX sensors: <http://carre.kmi.open.ac.uk/ontology/sensors.owl#> \n\
  */
  /* The prefixes for CARRE*/
  var PREFIXSTR = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \n\
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n\
PREFIX carreUsers: <https://carre.kmi.open.ac.uk/users/> \n\
PREFIX risk: <http://carre.kmi.open.ac.uk/ontology/risk.owl#> \n\
PREFIX ME: <http://carre.kmi.open.ac.uk/measurement_types/> \n\
PREFIX OB: <http://carre.kmi.open.ac.uk/observables/> \n\
PREFIX RL: <http://carre.kmi.open.ac.uk/risk_elements/> \n\
PREFIX RV: <http://carre.kmi.open.ac.uk/risk_evidences/> \n\
PREFIX RF: <http://carre.kmi.open.ac.uk/risk_factors/> \n\
PREFIX CI: <http://carre.kmi.open.ac.uk/citations/> \n";


  function deleteInstance(id){
    var query = "WITH " + CONFIG.CARRE_DEFAULT_GRAPH + " DELETE { ?id ?s ?p .  }  WHERE { ?id ?s ?p . FILTER (?id=<"+id+">) }";
    return apiQuery(query);
  }
  
  /*               
  OPTIONAL {    \n\
                 ?object risk:includes_risk_element ?includes_risk_element. \n\
                 ?includes_risk_element risk:has_risk_element_name ?includes_risk_element_name. \n\
                } \n\
                */

  function queryInstances(type, ArrayOfIDs) {

    var listQuery = "SELECT * FROM " + CONFIG.CARRE_DEFAULT_GRAPH + " WHERE { \n\
             ?subject a risk:" + type + "; ?predicate ?object. \n\
              OPTIONAL {    \n\
               ?object a risk:citation. \n\
               ?object risk:has_citation_pubmed_identifier ?has_citation_pubmed_identifier  \n\
              } \n\
              OPTIONAL {    \n\
               ?object a risk:observable. \n\
               ?object risk:has_observable_name ?has_observable_name  \n\
              } \n\
              OPTIONAL {    \n\
               ?object a risk:risk_element. \n\
               ?object risk:has_risk_element_name ?has_risk_element_name  \n\
              } \n\
              OPTIONAL {    \n\
               ?object a risk:measurement_type. \n\
               ?object risk:has_measurement_type_name ?has_measurement_type_name  \n\
              } \n\
              OPTIONAL {    \n\
               ?object a risk:risk_factor.  \n\
               ?object risk:has_risk_factor_association_type ?has_risk_factor_association_type. \n\
               ?object risk:has_risk_factor_source ?has_risk_factor_source. \n\
               ?object risk:has_risk_factor_target ?has_risk_factor_target. \n\
               ?has_risk_factor_source risk:has_risk_element_name ?has_source_risk_element_name.  \n\
               ?has_risk_factor_target risk:has_risk_element_name ?has_target_risk_element_name.  \n\
              } \n"


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
  function countAllInstances() {
    var query = "SELECT \n\
    (COUNT(?rf) as ?risk_factors) \n\
    (COUNT(?rf_r) as ?risk_factors_unreviewed) \n\
    (COUNT(?rl) as ?risk_elements) \n\
    (COUNT(?rl_r) as ?risk_elements_unreviewed) \n\
    (COUNT(?ob) as ?observables) \n\
    (COUNT(?ob_r) as ?observables_unreviewed) \n\
    (COUNT(?rv) as ?risk_evidences) \n\
    (COUNT(?rv_r) as ?risk_evidences_unreviewed) \n\
    (COUNT(?ci) as ?citations) \n\
    (COUNT(?me) as ?measurement_types)  \n\
    (COUNT(?ex) as ?medical_experts)  \n\
    FROM " + CONFIG.CARRE_DEFAULT_GRAPH + " WHERE { \n\
    {?rf a risk:risk_factor} \n\
    UNION { ?rf_r a risk:risk_factor FILTER NOT EXISTS {?rf_r risk:has_reviewer ?anything} } \n\
    UNION {?rl a risk:risk_element} \n\
    UNION { ?rl_r a risk:risk_element FILTER NOT EXISTS {?rl_r risk:has_reviewer ?anything} } \n\
    UNION {?ob a risk:observable} UNION { ?ob_r a risk:observable FILTER NOT EXISTS {?ob_r risk:has_reviewer ?anything} } \n\
    UNION {?rv a risk:risk_evidence} UNION { ?rv_r a risk:risk_evidence FILTER NOT EXISTS {?rv_r risk:has_reviewer ?anything} } \n\
    UNION {?ci a risk:citation} \n\
    UNION {?ex a risk:medical_expert} \n\
    UNION {?me a risk:measurement_type}  }";
    
    return apiQuery(query);
  }
  /* DEPRECATED */
  // function countInstance(instanceType) {
  //   var query = "SELECT ?s (COUNT(?r) as ?reviews) FROM " + CONFIG.CARRE_DEFAULT_GRAPH + " WHERE { ?s a risk:" + instanceType + " . OPTIONAL {?s risk:has_reviewer ?r .} } GROUP BY ?s";
  //   return apiQuery(query).then(function(res) {
  //     var sum = 0;
  //     res.data.forEach(function(obj) {
  //       if (obj.reviews.value === '0') sum += 1;
  //     });
  //     return {
  //       total: res.data.length,
  //       noreviews: sum
  //     };
  //   });
  // }

  /* Easy select query to transform triples to javascript objects */
  function selectQuery(sparqlQuery, raw) {
    return apiQuery(sparqlQuery).then(function(res) {
      var props=[
        'subject',
        'predicate',
        'object',
        'has_observable_name',
        'has_risk_element_name',
        'has_measurement_type_name',
        'has_risk_factor_association_type',
        'has_risk_factor_source',
        'has_risk_factor_target',
        'has_source_risk_element_name',
        'has_target_risk_element_name',
        'has_citation_pubmed_identifier'
        ];
      if (raw) return res;
      // console.log(res.data);
      var results = RdfFormatter.groupByProp(res.data, props, null, 'value');
      if (results.data.length > 0) return RdfFormatter.mappings(results);
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
    return $http.post(CONFIG.CARRE_API_URL + 'query', params, {timeout:6000}).then(function(res){
      if(res.data==='No JSON object could be decoded') {
        console.error(res);
        toastr.error('<p>'+res.data+'</p>','<h4>Oh Error</h4>');
        return $q.reject(res);
      }  else return res;
    }).catch(function(err){
        console.log(err);
        $state.go('500_API_ERROR');
    });

  }
  
  
  
/* ======================IMPORTANT SPARQL QUERIES =============================*/
//['subject','predicate','object','has_observable_name','has_risk_element_name','has_measurement_type_name','has_risk_factor_association_type','has_risk_factor_source','has_risk_factor_target','has_source_risk_element_name','has_target_risk_element_name']
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


# COUNT elements and reviews

SELECT 
(COUNT(?rf) as ?risk_factors) 
(COUNT(?rf_r) as ?risk_factors_unreviewed)
(COUNT(?rl) as ?risk_elements) 
(COUNT(?rl_r) as ?risk_elements_unreviewed)
(COUNT(?ob) as ?observables) 
(COUNT(?ob_r) as ?observables_unreviewed)
(COUNT(?rv) as ?risk_evidences) 
(COUNT(?rv_r) as ?risk_evidences_unreviewed)
(COUNT(?ci) as ?citations) 
(COUNT(?me) as ?measurement_types) 
FROM <http://carre.kmi.open.ac.uk/public> WHERE { 
{?rf a risk:risk_factor}
UNION
{ ?rf_r a risk:risk_factor FILTER NOT EXISTS {?rf_r risk:has_reviewer ?anything} }
UNION
{?rl a risk:risk_element}
UNION
{ ?rl_r a risk:risk_element FILTER NOT EXISTS {?rl_r risk:has_reviewer ?anything} }
UNION
{?ob a risk:observable}
UNION
{ ?ob_r a risk:observable FILTER NOT EXISTS {?ob_r risk:has_reviewer ?anything} }
UNION
{?rv a risk:risk_evidence}
UNION
{ ?rv_r a risk:risk_evidence FILTER NOT EXISTS {?rv_r risk:has_reviewer ?anything} }
UNION
{?ci a risk:citation}
UNION
{?me a risk:measurement_type}


}


    */




  return this.exports;
});