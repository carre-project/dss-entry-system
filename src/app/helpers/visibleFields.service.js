angular.module('CarreEntrySystem').service('VisibleFields', function() {
  
  var visibleFields={
    "risk_alert": {
      "single": [
            // "type",
            // "id",
            "has_risk_alert_name",
            "has_risk_alert_calculated_observable",
            "has_risk_alert_condition",
            "has_counter_for_recorded",
            "has_counter_for_missed",
            "has_counter_for_recorded_limit",
            "has_counter_for_missed_limit",
            "has_output_message",
            "has_educational_resource_url",
            "has_output_type",
            "has_author",
            "has_reviewer"
            ],
      "list": [
        'has_risk_alert_name',
        'has_risk_alert_condition_text',
        'has_output_message'
        ]
      },
    "dss_message": {
      "single": [
                // "type",      
                // "id",
                "has_message_name",
                "has_alert_level",
                "has_short_message",
                "has_long_message",
                "has_author",
                "has_reviewer"
              ],
      "list": [
              'has_message_name',
              'has_alert_level',
              'has_short_message'
            ]
    },
    "calculated_observable": {
      "single": [
        // "type",      
        // "id",
        "has_calculated_observable_name",
        // "has_calculated_observable_acronym",
        // "has_observable_identifier_system",
        // "has_observable_identifier_value",
        // "has_calculated_observable_measurement_type",
        "has_calculated_observable_function",
        "has_primary_observable",
        "has_arg_min_measurements",
        "has_arg_how_many_measurements",
        "has_arg_how_many_max_days_before",
        "has_arg_increment_value",
        "has_arg_average_period_days",
        "has_arg_treshold_value",
        "has_arg_calculated_enum",
        "has_external_type",
        "has_author",
        "has_reviewer"
      ],
      "list": [
        'has_calculated_observable_name',
        "has_arg_min_measurements",
        "has_arg_how_many_measurements",
        "has_arg_how_many_max_days_before",
        "has_arg_treshold_value"
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