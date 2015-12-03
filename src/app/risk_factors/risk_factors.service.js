angular.module('CarreEntrySystem').service('Risk_factors', function($http, CARRE, CONFIG) {

  this.exports={
    'get': getRisk_factors,
    'risk_evidences': getRisk_evidencesFromRisk_Factor
  };
  
  function getRisk_factors(ArrayOfIDs,raw) {
    return CARRE.instances('risk_factor',ArrayOfIDs);
  }
  
  function getRisk_evidencesFromRisk_Factor(id) {

    var listQuery = "SELECT * FROM " + CONFIG.CARRE_DEFAULT_GRAPH + " WHERE { \n\
             ?subject a risk:risk_evidence; ?predicate ?object; \n\
             risk:has_risk_factor RF:"+id+". \n\
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


    listQuery += "}";

    return CARRE.selectQuery(listQuery);

  }
  
  return this.exports;
  
});