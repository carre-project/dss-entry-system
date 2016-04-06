angular.module('CarreEntrySystem').filter('translateMapping', function(CarreTranslate) {
  return function(input) {
    return CarreTranslate(input);
  };
}).service('CarreTranslate', function() {
  
  var translations={
    //global
    
    "has_author":"Entered by",
    "has_reviewer":"Reviewed by",
    
    //medical_expert
    
    "has_firstname":"First name",
    "has_lastname":"Last name",
    "has_medical_specialty":"Medical specialty",
    "has_medical_position":"Medical position",
    "has_short_cv":"Short CV",
    "has_personal_page_url":"Personal website",
    "has_user_graph":"User graph",
    
    //observable
    
    "has_observable_name":"Name",
    "has_observable_acronym":"Acronym",
    "has_observable_type":"Type",
    "has_external_type":"External Vocabulary",
    "has_observable_measurement_type":"Measurement type",
    
    'observable_type_personal':'personal',
    'observable_type_clinical':'clinical',
    'observable_type_other':'other',
    
    //risk element
    
    "has_risk_element_name":"Name",
    "has_risk_element_identifier":"UMLS Identifier",
    "has_risk_element_type":"Type",
    "has_risk_element_modifiable_status":"Modifiable status",
    "has_risk_element_observable":"Observable",
    "has_risk_element_observable_condition":"Observable condition",
    "includes_risk_element":"Includes",
    
    'risk_element_type_biomedical':'biomedical',
    'risk_element_type_demographic':'demographic',
    'risk_element_type_behavioural':'behavioural',
    'risk_element_type_intervention':'intervention',
    'risk_element_type_genetic':'genetic',
    'risk_element_type_environmental':'environmental',
    
    //risk factor
    
    "has_risk_factor_source":"Source",
    "has_risk_factor_target":"Target",
    "has_risk_factor_association_type":"Association type",
    'risk_factor_association_type_is_an_issue_in':'is an issue in',
    'risk_factor_association_type_causes':'causes',
    'risk_factor_association_type_reduces':'reduces',
    'risk_factor_association_type_elevates':'elevates',
    
    //risk evidence
    
    "has_risk_factor":"Risk factor",
    "has_risk_evidence_observable":"Observable",
    "has_observable_condition":"Observable condition",
    "has_observable_condition_text":"Observable condition",
    "has_risk_evidence_ratio_type":"Ratio type",
    "has_risk_evidence_ratio_value":"Ratio value",
    "has_confidence_interval_min":"Confidence Interval min",
    "has_confidence_interval_max":"Confidence Interval max",
    "is_adjusted_for":"Is adjusted for",
    "has_risk_evidence_source":"Source",
    'risk_evidence_ratio_type_hazard_ratio':'hazard ratio',
    'risk_evidence_ratio_type_odds_ratio':'odds ratio',
    'risk_evidence_ratio_type_relative_risk':'relative risk',
    'risk_evidence_ratio_type_risk_ratio':'risk ratio',
    
    //citation
    "has_citation_pubmed_identifier":"Pubmed Identifier",
    "has_citation_summary":"Summary",
    "has_citation_source_type":"Study type",
    "has_citation_source_level":"Study level",
    
    //measurement types
    "has_measurement_type_name":"Name",
    "has_datatype":"Datatype",
    "has_label":"Unit",
    "has_enumeration_values":"Values",
    "has_external_unit":"External Vocabulary"
    
    
    
  };
  return function(str,showOnlyIfExists){
    // console.log((showOnlyIfExists?"--Not-Available-Translation--":str));
    if(translations.hasOwnProperty(str)) return translations[str];
    else return (showOnlyIfExists?"--Not-Available-Translation--":str);
  };
  
});