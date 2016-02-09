angular.module('CarreEntrySystem').service('QUERY', function(CONFIG) {

  this.exports = {
    'insert': buildInsertQuery,
    'prefix': addPrefix,
    'update': buildUpdateQuery,
    
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
    if(test.indexOf(":")===-1) test = "risk:"+test;
    var val = test.split(':');
    if (prefixes.hasOwnProperty(val[0])) return '<' + prefixes[val[0]] + val[1] + '>';
    else return '<node_' + Math.round(Math.random() * 100000000) + '>';
  }

  function keepDiffProps(oldObj,newObj) {
    var obj={};
    for (var prop in newObj) {
      //iterate new object properties
      if( newObj[prop].val instanceof Array) {
        //if array
        if((newObj[prop].val.length!==oldObj[prop].length)) obj[prop]=newObj[prop];
        else {
          for (var i=0,arr=newObj[prop].val;i<arr.length;i++){
            if(oldObj[prop].indexOf(arr[i])===-1) {
              obj[prop]=newObj[prop];
              break;
            }
          }
        }
      } else if(oldObj[prop+'_label']!=newObj[prop].val) obj[prop]=newObj[prop];
    }
    return obj;
  }
  
  
  function parseRdf(node) {
    node = node+"";
    if (node.indexOf('http://') === 0 || node.indexOf('https://') === 0) return '<' + node + '>';
    else return fillPrefix(node);
  }

  //types: string,boolean,integer,float,datetime
  function parseVal(val, type) {
    val = val+"";
    type = type || 'string';
    if(type==='node') return parseRdf(val);
    return "\"" + val + "\"^^" + fillPrefix('xsd:' + type);
  }

  /* Update query */
  function buildUpdateQuery (old,obj,id,graph) {
    graph = graph || CONFIG.CARRE_DEFAULT_GRAPH;
    obj = keepDiffProps(old,obj);
    console.log(obj);
    id = id||parseRdf(old.id);
    var deleteTriples = "";
    var insertTriples = "";
    var objEmpty = true;
    for (var prop in obj) {
      objEmpty = false;
      console.log(prop);
      deleteTriples+= id +" "+ parseRdf(prop) +" ?"+prop+"_var . \n";
      insertTriples+= id +" "+ parseRdf(prop) +" "+parseVal(obj[prop].val,obj[prop].type)+" . \n" ;  
    }
    if(objEmpty) return "";
    var deleteQuery = "WITH " + graph + " DELETE { \n" + deleteTriples + " } \n WHERE { \n"+ deleteTriples + " } \n";
    var insertQuery = "INSERT DATA { GRAPH " + graph + " { \n" + insertTriples + " }} \n";
    return deleteQuery + insertQuery;

  }

  /* Insert query */
  function buildInsertQuery (obj,type,idlabel,usergraph,graph) {
    graph = graph || CONFIG.CARRE_DEFAULT_GRAPH;
    usergraph = parseRdf(usergraph);
    var insertTriples = "";
    var objEmpty = true;
    for (var prop in obj) {
      objEmpty = false;
      insertTriples+= "?newid "+ parseRdf(prop) +" "+parseVal(obj[prop].val,obj[prop].type)+" . \n";
    }
    if(objEmpty) return "";
    //add author and type
    insertTriples+= "?newid "+parseRdf("risk:has_author")+ " " + parseRdf(usergraph) + "; a "+parseRdf("risk:"+type)+" .  \n";
    var insertQuery = "INSERT { GRAPH " + graph + " { \n" + insertTriples + " }} WHERE \n\
          { GRAPH " + graph + " \n\
          { { \n\
              SELECT ?oldindex FROM " + graph + " \n\
              WHERE { \n\
               ?elem a "+parseRdf("risk:"+type)+" . \n\
                BIND (xsd:integer(strafter(STR(?elem),\"CI_\")) AS ?oldindex) \n\
              } ORDER BY DESC(?oldindex) LIMIT 1 \n\
            } \n\
            BIND (IRI(CONCAT("+idlabel+":, \""+idlabel+"_\", ?oldindex+1)) AS ?newid) \n\
          } }";
          
    /*
WITH <http://carre.kmi.open.ac.uk/riskdata> DELETE { 
<http://carre.kmi.open.ac.uk/citations/CI_60> <node_95146690> ?has_citation_summary_var . 
 } 
 WHERE { 
<http://carre.kmi.open.ac.uk/citations/CI_60> <node_95146690> ?has_citation_summary_var . 
 } 
INSERT DATA { GRAPH <http://carre.kmi.open.ac.uk/riskdata> { 
<http://carre.kmi.open.ac.uk/citations/CI_60> <node_81891397> "Peters SA, Huxley RR, Woodward M.; Diabetes as risk factor for incident coronary heart disease in women compared with men: a systematic review and meta-analysis of 64 cohorts including 858,507 individuals and 28,203 coronary events. Diabetologia 2014;57(8):1542-1551. doi:10.1007/s00125-014-3260-6"^^<http://www.w3.org/2001/XMLSchema#string> . 
 }}
    */
    return insertQuery;
  }
      

  return this.exports;
});