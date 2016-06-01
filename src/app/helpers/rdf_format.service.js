angular.module('CarreEntrySystem').service('RdfFormatter', function(CONFIG, CarreTranslate, Email) {

  this.exports = {
    'groupByProp': groupByProp,
    'mappings': replaceMappings,
    'translate':translate
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
                      //reducer           //initial object acts as prev in the reducer
    return data.reduce(tripleAccumulator, settingsObj);
  }   
                            //accumulatedObj , current
  function tripleAccumulator(settings, obj) {
    
    
    
    var type,id, rel, val, val_label;
    
    id = obj[settings.groupProp][settings.valueProp];
    rel = makeLabel(obj[settings.triplesFormat[1]][settings.valueProp]);
    type = obj[settings.triplesFormat[2]].type;
    val = obj[settings.triplesFormat[2]][settings.valueProp];

    /*  Filter educational objects  */
    if (rel === 'has_educational_material') return settings;

    /*  Filter BUG-Virtuoso  */
    if (rel === 'has_risk_evidence_ratio_value' && val==="NAN") {
      console.log("BUG-Virtuoso: ",id+': ',val);
      Email.bug({
        "title": "Risk evidence ratio value "+(settings.data.length>1?"List view":"Single view"),
        "element": id,
        "predicate": "has_risk_evidence_ratio_value",
        "value": val
      });
    }
    
    /*  Filter other languages  */
    if(obj[settings.triplesFormat[2]].hasOwnProperty('xml:lang') && obj[settings.triplesFormat[2]]['xml:lang']!==CONFIG.LANG){
      return settings;
    }
    
    //make labels only for literals (not for nodes or relations)
    if(type==="typed-literal"){ val_label=val; } else { val_label=makeLabel(val);}

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
    
    // dont make labels for external annotations
    if(rel === 'has_external_type' || rel === 'has_external_unit'|| rel === 'has_external_predicate') {
      val_label = makeLabel(val);
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
        if ( prop.indexOf('_label_arr') > 0 && prop.indexOf('has_observable_condition')===-1) {
          //select only props : has_....._label
          obj[prop]=obj[prop].map(function(term) {
            if (settings.mappings.hasOwnProperty(term)) {
              cat = term.substr(0, 2);
              switch (cat) {
                case 'CI':
                  // make label for observables
                  return settings.mappings[term].has_citation_pubmed_identifier;
                case 'OB':
                  // make label for observables
                  return settings.mappings[term].has_observable_name;
                case 'ME':
                  // make label for measurent types
                  return settings.mappings[term].has_measurement_type_name;
                case 'RF':
                  // make label for risk factor    
                  return settings.mappings[term].has_source_risk_element_name +
                    ' ['+ translate(settings.mappings[term].has_risk_factor_association_type) + '] ' +
                    settings.mappings[term].has_target_risk_element_name;
                case 'RL':
                  // make label for risk element
                  return settings.mappings[term].has_risk_element_name;
                case 'RV':
                  // make label for risk evidence
                  return term;

                default:
                  return term;
              }
            } else return translate(term);
            
          });
          obj[prop.split('_arr')[0]]=obj[prop].join(', ');
          
        }
      }
      return obj;
    });
    return settings;
  }

  function translate(str){
    if(!str) return '';
    if(str.indexOf('#') >= 0) return CarreTranslate(str.split('#')[1]);
    else return CarreTranslate(str);
  };
  function makeLabel(str) {
    if(str.indexOf('#') >= 0) {
      str=str.split('#')[1];
      return str;
    } else if(str.indexOf('http') >= 0) {
      return str.substring(str.lastIndexOf('/') + 1);
    } else return str;
  }

  return this.exports;
});