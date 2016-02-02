angular.module('CarreEntrySystem').service('Pubmed', function($http,CONFIG) {
  var api=CONFIG.PUBMED_API_URL;
  
  var efetch=function(id){
    return $http.get(api+'efetch.fcgi?db=pubmed&retmode=text&rettype=abstract&id='+id,{ignoreLoadingBar: false,cache:true}).then(function(res){
            console.info(res);
            return res;
    },function(err){console.error(err)});
  };
  
  //search Pubmed Central through EuropePMC
  var esearch=function(query){
    return $http.jsonp('http://www.ebi.ac.uk/europepmc/webservices/rest/search?resulttype=lite&format=json&callback=JSON_CALLBACK&query='+query,{ignoreLoadingBar: false,cache:true}).then(function(res){
            console.info(res);
            return res;
    },function(err){console.error(err)});
  };
  
  return {
    'fetch':efetch,
    'search':esearch
  };
  
});