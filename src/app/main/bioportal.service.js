angular.module('CarreEntrySystem').service('Bioportal', function($http,CONFIG) {
  
  var apikey=CONFIG.BIOPORTAL_API_KEY;
  var apiurl = CONFIG.BIOPORTAL_API_URL;

  //pass the Bioportal supported options to override the default 
  
  
  /*Implement basic methods*/
  var search = function(input,options) {
    var params=options||{};
    params.q=input;
    params.apikey=apikey;
    return $http.get(apiurl+'search',{params:params});
  };
  var annotator = function(input,options) {
    var params=options||{};
    params.text=input;
    params.apikey=apikey;
    return $http.get(apiurl+'annotator',{params:params});
  };
  var recommender = function(input,options) {
    var params=options||{};
    params.input=input;
    params.apikey=apikey;
    return $http.get(apiurl+'recommender',{params:params});
  };
  
  return {
    'search':search,
    'annotator':annotator,
    'recommender':recommender
  }

});