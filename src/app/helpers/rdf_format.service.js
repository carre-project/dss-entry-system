angular.module('CarreEntrySystem').service('RdfFormatter', function() {

  this.exports = {
    'groupByProp': groupByProp,
    'mappings': replaceMappings
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


    var id, rel, val, val_label = '';
    if (settings.valueProp) {
      id = obj[settings.groupProp][settings.valueProp];
      rel = makeLabel(obj[settings.triplesFormat[1]][settings.valueProp]);
      val = obj[settings.triplesFormat[2]][settings.valueProp];
    }
    else {
      id = obj[settings.groupProp];
      rel = obj[settings.triplesFormat[1]].split("#")[1] || "_";
      val = obj[settings.triplesFormat[2]];
    }

    val_label = makeLabel(val);


    //get extra mappings
    if (['OB', 'RF', 'RL', 'RV','ME'].indexOf(val_label.substr(0, 2)) > -1) {
      settings.mappings[val_label] = settings.mappings[val_label] || {};
      for (var prop in obj) {
        //except the 3 basic properties
        if (prop !== 'subject' && prop !== 'predicate' && prop !== 'object' && obj[prop].value.length > 0) {
          settings.mappings[val_label][prop] = obj[prop].value;
        }
      }
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

    return settings;
  }


  /*========================== HELPERS  ==================================================*/
  function replaceMappings(settings) {
    settings.data=settings.data.map(function(obj) {
      var cat = '';
      for (var prop in obj) {
        if (prop.indexOf('_label') > 0 && prop.indexOf('has_') === 0) {
          //select only props : has_....._label
          obj[prop]=obj[prop].toString().split(',').map(function(term) {
            if (settings.mappings.hasOwnProperty(term)) {
              cat = term.substr(0, 2);
              switch (cat) {
                case 'OB':
                  // make label for observables
                  return prettyLabel(settings.mappings[term].has_observable_name);
                case 'ME':
                  // make label for measurent types
                  return prettyLabel(settings.mappings[term].has_measurement_type_name);
                case 'RF':
                  // make label for risk factor              
                  return prettyLabel(settings.mappings[term].has_source_risk_element_name +
                    ' '+ settings.mappings[term].has_risk_factor_association_type + ' ' +
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

          }).join(',');

        }
      }
      return obj;
    });
    return settings;
  }

  function simplify(obj, valueProp, addLabelsFlag) {
    //default valueProp as value
    valueProp = valueProp || 'value';
    //addLabelsFlag default true
    addLabelsFlag = addLabelsFlag || true;
    var newObj = {};
    for (var i in obj) {
      newObj[i] = obj.i[valueProp];
      if (addLabelsFlag) newObj[i + '_label'] = makeLabel(newObj[i]);
    }
    return newObj;
  }

  function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  function makeLabel(str) {
    return str.indexOf('#') >= 0 ? str.split('#')[1] : str.substring(str.lastIndexOf('/') + 1);
  }

  /* Private */
  function prettyLabel(label) {
    //replace _ with spaces
    label = label.replace(new RegExp("_", "g"), " ");
    //Capitalize first letter
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  return this.exports;
});