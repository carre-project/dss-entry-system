angular.module('CarreEntrySystem').service('RdfFormatter', function(CONFIG) {

  this.exports = {
    'groupByProp': groupByProp,
    'mappings': replaceMappings
  };

  var translations={
    
    //observable
    'observable_type_personal':'personal',
    'observable_type_clinical':'clinical',
    'observable_type_other':'other',
    
    //risk element types
    'risk_element_type_biomedical':'biomedical',
    'risk_element_type_demographic':'demographic',
    'risk_element_type_behavioural':'behavioural',
    'risk_element_type_intervention':'intervention',
    'risk_element_type_genetic':'genetic',
    'risk_element_type_environmental':'environmental',
    
    //risk factor
    'risk_factor_association_type_is_an_issue_in':'is an issue in',
    'risk_factor_association_type_causes':'causes',
    'risk_factor_association_type_reduces':'reduces',
    'risk_factor_association_type_elevates':'elevates',
    
    //risk evidence ration type
    'risk_evidence_ratio_type_hazard_ratio':'hazard ratio',
    'risk_evidence_ratio_type_odds_ratio':'odds ratio',
    'risk_evidence_ratio_type_relative_risk':'relative risk',
    'risk_evidence_ratio_type_risk_ratio':'risk ratio'
    
    //citation source type
  
  
  };
  /* =====================Simple groupby prop============================================ */

  /*
  You can configure triplet variable names and group by index of property.
  e.g groupByProp(data,["citation","relation","value"],0).data groups by citation
  */
  function groupByProp(data, triplesFormat, propIndex, valueProp) {
    triplesFormat = triplesFormat || ['subject', 'predicate', 'object'];
    var settingsObj = {
      triplesFormat: triplesFormat,
      groupProp: triplesFormat[(propIndex || 0)],
      valueProp: valueProp,
      keys: [],
      fields: [],
      mappings: {},
      data: []
    };
    return data.reduce(tripleAccumulator, settingsObj);
  }

  function tripleAccumulator(settings, obj) {
    
    
    var type,id, rel, val, val_label = '';
    
    id = obj[settings.groupProp][settings.valueProp];
    rel = makeLabel(obj[settings.triplesFormat[1]][settings.valueProp]);
    type = obj[settings.triplesFormat[2]].type;
    val = obj[settings.triplesFormat[2]][settings.valueProp];

    /*  Filter educational objects  */
    if (rel === 'has_educational_material') return settings;
    
    //make labels only for literals (not for nodes or relations)
    if(type==="typed-literal"){ val_label=val; } else { val_label=makeLabel(val); }

    // console.log(type,id,rel,val_label);
    
    //get extra mappings
    if (['CI','OB', 'RF', 'RL', 'RV','ME'].indexOf(val_label.substr(0, 2)) > -1 && val_label.indexOf("observable_condition")===-1) {
      settings.mappings[val_label] = settings.mappings[val_label] || {};
      for (var prop in obj) {
        //except the 3 basic properties
        if (prop !== 'subject' && prop !== 'predicate' && prop !== 'object' && obj[prop].value.length > 0) {
          settings.mappings[val_label][prop] = obj[prop].value;
        }
      }
    }



    if (settings.fields.indexOf(rel) === -1) settings.fields.push(rel);
    var index = settings.keys.indexOf(id);
    if (index === -1) {
      //then push into the arrays
      settings.keys.push(id);
      settings.data.push({
        "id": id,
        "id_label": makeLabel(id)
      });
      //change index to the last item added
      index = settings.keys.length - 1;
    }
    settings.data[index][rel] = settings.data[index][rel] || [];
    settings.data[index][rel].push(val);

    //add label for each value
    // val = (val.indexOf('#') >= 0 ? val.split('#')[1] : val);
    settings.data[index][rel + '_label'] = settings.data[index][rel + '_label'] || '';
    settings.data[index][rel + '_label'] += (settings.data[index][rel + '_label'].length > 0 ? ',' : '') + val_label;
    settings.data[index][rel + '_label_arr'] = settings.data[index][rel + '_label_arr'] || [];
    settings.data[index][rel + '_label_arr'].push(val_label);

    return settings;
  }


  /*========================== HELPERS  ==================================================*/
  function replaceMappings(settings) {
    settings.data=settings.data.map(function(obj) {
      var cat = '';
      for (var prop in obj) {
        if (prop.indexOf('_label_arr') > 0 && prop.indexOf('has_') === 0 && prop.indexOf('has_observable_condition')===-1) {
          //select only props : has_....._label
          obj[prop]=obj[prop].map(function(term) {
            if (settings.mappings.hasOwnProperty(term)) {
              cat = term.substr(0, 2);
              switch (cat) {
                case 'CI':
                  // make label for observables
                  return prettyLabel(settings.mappings[term].has_citation_pubmed_identifier);
                case 'OB':
                  // make label for observables
                  return prettyLabel(settings.mappings[term].has_observable_name);
                case 'ME':
                  // make label for measurent types
                  return prettyLabel(settings.mappings[term].has_measurement_type_name);
                case 'RF':
                  // make label for risk factor    
                  return prettyLabel(settings.mappings[term].has_source_risk_element_name +
                    ' ['+ makeLabel(settings.mappings[term].has_risk_factor_association_type
                    .substr(settings.mappings[term].has_risk_factor_association_type.indexOf('risk_factor_association_type')+29)) + '] ' +
                    settings.mappings[term].has_target_risk_element_name);
                case 'RL':
                  // make label for risk element
                  return prettyLabel(settings.mappings[term].has_risk_element_name);
                case 'RV':
                  // make label for risk evidence
                  return prettyLabel(term);

                default:
                  return prettyLabel(term);
              }
            } else return prettyLabel(term);
            
          });
          obj[prop.split('_arr')[0]]=obj[prop].join(', ');
          
        }
      }
      return obj;
    });
    return settings;
  }

  // function simplify(obj, valueProp, addLabelsFlag) {
  //   //default valueProp as value
  //   valueProp = valueProp || 'value';
  //   //addLabelsFlag default true
  //   addLabelsFlag = addLabelsFlag || true;
  //   var newObj = {};
  //   for (var i in obj) {
  //     newObj[i] = obj.i[valueProp];
  //     if (addLabelsFlag) newObj[i + '_label'] = makeLabel(newObj[i]);
  //   }
  //   return newObj;
  // }

  // function replaceAll(str, find, replace) {
  //   return str.replace(new RegExp(find, 'g'), replace);
  // }
  
  function makeLabel(str) {
    if(str.indexOf('#') >= 0) {
      str=str.split('#')[1];
      
      if(translations.hasOwnProperty(str)) return translations[str];
      return str;
      
    } else if(str.indexOf('/') >= 0) {
      return str.substring(str.lastIndexOf('/') + 1);
    } else return str;
  }

  // function uriLabel(str) {
  //   return str.indexOf('#') >= 0 ? str.split('#')[1] : str;
  // }

  function prettyLabel(label) {
    //replace _ with spaces
    label = label.replace(new RegExp("_", "g"), " ");
    //Capitalize first letter
    //return label.charAt(0).toUpperCase() + label.slice(1);
    return label;
  }

  return this.exports;
});