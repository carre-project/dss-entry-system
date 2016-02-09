angular.module('CarreEntrySystem').service('SPARQL', function(CONFIG) {

  this.exports = {
    // 'count': countInstance,
    'insert': countAllInstances,
    'prefix': addPrefix,
    'delete': deleteInstance
  };


  /*
    PREFIX carreManufacturer: <http://carre.kmi.open.ac.uk/manufacturers/> \n\
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n\
    PREFIX sensors: <http://carre.kmi.open.ac.uk/ontology/sensors.owl#> \n\
  */
  /* The prefixes for CARRE*/
  var PREFIXES = {
    'xsd': 'http://www.w3.org/2001/XMLSchema#',
    'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    'carreUsers': 'https://carre.kmi.open.ac.uk/users/',
    'risk': 'http://carre.kmi.open.ac.uk/ontology/risk.owl#',
    'ME': 'http://carre.kmi.open.ac.uk/measurement_types/',
    'OB': 'http://carre.kmi.open.ac.uk/observables/',
    'RL': 'http://carre.kmi.open.ac.uk/risk_elements/',
    'RV': 'http://carre.kmi.open.ac.uk/risk_evidences/',
    'RF': 'http://carre.kmi.open.ac.uk/risk_factors/',
    'MD': 'http://carre.kmi.open.ac.uk/medical_experts/',
    'CI': 'http://carre.kmi.open.ac.uk/citations/',
  };
  var PREFIXSTR = '';
  var PREFIXARR = [];

  function addPrefix(prefix) {
    if (prefix) {
      if (PREFIXES.hasOwnProperty(prefix)) {
        PREFIXARR.push(prefix);
        PREFIXSTR += 'PREFIX ' + prefix + ': <' + PREFIXES[prefix] + '> \n';
      }
    }
    else {
      //add all prefixes
      for (var prop in PREFIXES) {
        PREFIXARR.push(prop);
        PREFIXSTR += 'PREFIX ' + prop + ': <' + PREFIXES[prop] + '> \n';
      }
    }
  }

  function fillPrefix(test, prefixes) {
    prefixes = prefixes || PREFIXES;
    var val = test.split(':');
    if (prefixes.hasOwnProperty(val[0])) return '<' + prefixes[val[0]] + val[1] + '>';
    else return '<node_' + Math.round(Math.random() * 100000000) + '>';
  }

  /****** private functions *******/
  function parseRdf(node) {
    node = String(node);
    if (node.indexOf('http://') === 0 || node.indexOf('https://') === 0) return '<' + node + '>';
    else {
      return fillPrefix(node);
    }
  }

  //types: string,boolean,integer,float,datetime
  function parseVal(val, type) {
    val = String(val);
    type = type || 'string';
    return "\"" + val + "\"^^" + fillPrefix('xsd:' + type);
  }

  function sentence(obj, idProp) {
    idProp = idProp || "id";
    var s = '',
      pre = '',
      id = parseRdf(obj[prop]);
      
    for (var prop in obj) {
      if (prop != idProp) {
        //non id
        //property
        pre = prop.indexOf(':') === -1 ? 'risk:' : '';
        s += id +' '+ parseRdf(prop) + ' ' + parseRdf(obj[prop]) + '. \n';
      }
    }
    return s;
  }

  function parseTriples(arr) {
    return arr.map(function(triple) {
      return makeTriple(triple[0], triple[1], triple[2]);
    }).join('.');
  }


  //make modify query
  function modify(triples, templateToDelete, templateToInsert) {
    if (!triples) triples = [];
    if (!templateToInsert) templateToInsert = [];
    if (!templateToDelete) templateToDelete = [];

    return query(
      'MODIFY <http://carre.kmi.open.ac.uk/public> ' +
      'DELETE { ' + parseTriples(templateToDelete) + ' } ' +
      'INSERT { ' + parseTriples(templateToInsert) + ' } ' +
      'WHERE { ' +
      parseTriples(triples) +
      '} '
    );
  }

  //make insert query
  function insert(triples) {
    if (!triples || triples.length < 1) return {
      error: 'You have not specified any triples'
    };
    return query(
      'INSERT DATA { ' +
      'GRAPH ' +
      '<http://carre.kmi.open.ac.uk/public> { ' +
      parseTriples(triples) +
      '}' +
      '}'
    );
  }


  return this.exports;
});