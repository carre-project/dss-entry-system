angular.module('CarreEntrySystem').service('VisibleFields', function() {
  
  var visibleFields={
    "risk_element": {
      "single": [
              // "type",      
              // "id",
              "has_risk_element_name",
              "has_risk_element_identifier",
              "has_risk_element_type",
              "has_risk_element_modifiable_status",
              "has_risk_element_observable",
              "has_risk_element_observable_condition",
              "includes_risk_element",
              "has_author",
              "has_reviewer"
      ],
      "list": [
            'has_risk_element_name',
            'has_risk_element_identifier',
            'has_risk_element_type',
            'has_risk_element_modifiable_status',
            'has_risk_element_observable'
      ]
    },
    "risk_evidence": {
      "single": [
            // "type",
            // "id",
            "has_risk_factor",
            "has_risk_evidence_observable",
            "has_observable_condition",
            "has_risk_evidence_ratio_type",
            "has_risk_evidence_ratio_value",
            "has_confidence_interval_min",
            "has_confidence_interval_max",
            "is_adjusted_for",
            "has_risk_evidence_source",
            "has_author",
            "has_reviewer"
            ],
      "list": [
        'has_risk_factor',
        'has_observable_condition_text',
        // 'has_risk_evidence_source',
        // 'has_risk_evidence_ratio_type',
        'has_risk_evidence_ratio_value',
        // 'has_confidence_interval_min',
        // 'has_confidence_interval_max'
        ]
      },
    "risk_factor": {
      "single": [
                // "type",      
                // "id",
                "has_risk_factor_source",
                "has_risk_factor_target",
                "has_risk_factor_association_type",
                "has_author",
                "has_reviewer"
              ],
      "list": [
              'has_risk_factor_source',
              'has_risk_factor_target',
              'has_risk_factor_association_type'
            ]
    },
    "risk_review": {
      "single": [
        "is_for_element",
        "is_assigned_to",
        "has_review_notes",
        "has_review_json",
        "review_date",
        "assign_date",
        "review_status"
      ],
      "list": [
        "is_for_element",
        "is_assigned_to",
        "has_review_notes",
        "review_status"
      ]
    },
    "observable": {
      "single": [
        // "type",      
        // "id",
        "has_observable_name",
        "has_observable_acronym",
        "has_observable_type",
        "has_observable_measurement_type",
        "has_external_type",
        "has_external_predicate",
        "has_author",
        "has_reviewer"
      ],
      "list": [
        'has_observable_name',
        'has_observable_type',
        'has_observable_measurement_type'
      ]
    },
    "citation": {
      "single": [
        // "type",      
        // "id",
        "has_citation_pubmed_identifier",
        "has_citation_summary",
        "has_citation_source_type",
        "has_citation_source_level",
        "has_author",
        "has_reviewer"
      ],
      "list": [
        'has_citation_pubmed_identifier',
        'has_citation_summary',
        'has_citation_source_type',
        'has_citation_source_level'
      ]
    },
    "measurement_type": {
      "single": [
        // "type",      
        // "id",
        "has_measurement_type_name",
        "has_enumeration_values",
        "has_label",
        "has_datatype",
        "has_author",
        "has_reviewer",
        "has_external_unit"
      ],
      "list": [
        'has_measurement_type_name',
        'has_datatype',
        'has_label',
        'has_enumeration_values'
      ]
    },
    "medical_expert": {
      "single": [],
      "list": []
    }
    
  };
  
  return function(type,view,removeFields){
    if(!type || !visibleFields[type]) return '';
    view = view || 'list'; //list or single
    removeFields = (removeFields && removeFields instanceof Array) ? removeFields : [];
    return visibleFields[type][view].filter(function(field){
      if(removeFields.indexOf(field)==-1) return true; 
      else return false;
    });
  };
  
});