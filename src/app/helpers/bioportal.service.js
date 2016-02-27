angular.module('CarreEntrySystem').service('Bioportal', function($http, CONFIG) {

  var apikey = CONFIG.BIOPORTAL_API_KEY;
  var apiurl = CONFIG.CARRE_CACHE_URL?CONFIG.CARRE_CACHE_URL +'/bioportal/':CONFIG.BIOPORTAL_API_URL;

  //pass the Bioportal supported options to override the default 
  var fetch = function(term, options) {

    options = options || {
      display_context: 'false',
      require_exact_match: 'false',
      include: 'prefLabel,definition,cui',
      display_links: 'true',
      ontologies: CONFIG.BIOPORTAL_ONTOLOGIES,
      require_definitions: 'false'
    };

    return search(term, options).then(function(res) {
      var cuis = [];
      var results = [];
      res.data.collection.forEach(function(obj) {
        if ((obj.cui?obj.cui.length>0:false) && cuis.indexOf(obj.cui[0]) === -1) {
          cuis.push(obj.cui[0]);
          results.push({
            label: obj.prefLabel,
            value: obj.cui[0],
            link:obj.links.ui
          });
        }
        
      });
      console.info(results);
      return results;

    });

  };


  /*Implement basic methods*/
  var search = function(input, options) {
    var params = options || {};
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

});