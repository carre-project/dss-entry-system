angular.module('CarreEntrySystem').service('Bioportal', function($http, CONFIG) {

  var apikey = CONFIG.BIOPORTAL_API_KEY;
  var apiurl = CONFIG.BIOPORTAL_API_URL;

  //pass the Bioportal supported options to override the default 
  var fetch = function(term, options,nocui) {
    return search(term, options).then(function(res) {
      var cuis = [];
      var results = [];
      res.data.collection.forEach(function(obj) {
        if (nocui||((obj.cui?obj.cui.length>0:false) && cuis.indexOf(obj.cui[0]) === -1)) {
          if(!nocui) cuis.push(obj.cui[0]);
          results.push({
            label: obj.prefLabel,
            value: nocui?obj['@id']:obj.cui[0],
            link:obj.links.ui
          });
        }
        
      });
      console.info(results);
      return results;

    });

  };


  /*Implement basic methods*/
  var cachesearch = function(input, options) {
    var params = options || {};
    params.q = input;
    params.apikey = apikey;
    return $http.get('http://beta.carre-project.eu:3002/bioportal/'+encodeURIComponent(apiurl + 'search/'+$.param( params )), {
      ignoreLoadingBar: true,
      cache: true
    });
  };
  
  /*Implement basic methods*/
  var search = function(input, options) {
    options = options || {};
    var params = {
      display_context: options.display_context||'false',
      require_exact_match: options.require_exact_match||'false',
      include: options.include||'prefLabel,definition,cui',
      display_links: options.display_links||'true',
      ontologies: options.ontologies||CONFIG.BIOPORTAL_ONTOLOGIES,
      require_definitions: options.require_definitions||'false'
    };
    params.q = input;
    params.apikey = apikey;
    return $http.get(apiurl + 'search', {
      params: params,
      ignoreLoadingBar: true,
      cache: true
    });
  };
  var annotator = function(input, options) {
    var params = options || {};
    params.text = input;
    params.apikey = apikey;
    return $http.get(apiurl + 'annotator', {
      params: params,
      ignoreLoadingBar: true,
      cache: true
    });
  };
  var recommender = function(input, options) {
    var params = options || {};
    params.input = input;
    params.apikey = apikey;
    return $http.get(apiurl + 'recommender', {
      params: params,
      ignoreLoadingBar: true,
      cache: true
    });
  };

  return {
    'fetch': fetch,
    'search': search,
    'annotator': annotator,
    'recommender': recommender
  }
  
  /* Unimplemented */

// var CUI_DETAILS = {};

// var BIOPORTAL_ONTOLOGIES="ICD10,ICD10CM";//",ICD10CM,ICD10PCS,ICD9CM";


// var BioPortalsearch = function(input, cuis) {
//     cuis = (cuis instanceof Array)?cuis:(cuis?cuis.split(','):'');
//     input=input||"";
//     request({
//         url: "https://data.bioontology.org/search?token=a15281a9-d87d-4c0f-b7aa-31debe0f6449&cui="+cuis.join(',')+"&q="+input+"&include=prefLabel,definition,cui&display_context=false&display_links=true&ontologies="+BIOPORTAL_ONTOLOGIES,
//         method: 'GET'
        
//     }, function(error, response, body){
//         if(error) { console.log(error); } else saveCuis(cuis,body.collection); });
     
// };
// /*Implement BioPortalsearch methods*/
// var saveCuis = (cuis,data)=>{
//     var arr=[];
//     arr.concat(data);
    
//     cuis.forEach((cui)=>{
//         for (var i=0,len=arr.length;i<len;i++){
//             if(arr[i].cui.indexOf(arr[i])>=0) {
//                 mcache.put(cui,arr[i]);
//                 getAncestors(cui,arr[i].links.ancestors);
//                 arr.splice(i,1);
//                 break;
//             }   
//         }        
//     })
// }

// var getAncestors = (cui,ancestorUrl) => {
//     var cachedAncestors = mcache.get(cui+'_ancestors');
//     if(cachedAncestors) return cachedAncestors; 
//     else return request(ancestorUrl,function(err,res,body){
//         if(err) console.log(err); else {
//             mcache.put(cui+'_ancestors',body);
//             return body;
//         }
//     });
// }

});