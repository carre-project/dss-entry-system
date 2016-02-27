angular.module('CarreEntrySystem').service('Pubmed', function($http,CONFIG) {
  var apiEfetch=CONFIG.PUBMED_API_URL;
  var apiSearch=CONFIG.EUROPEPMC_API_URL;
  
  var efetch=function(id){
    return $http.get(apiEfetch+'efetch.fcgi?db=pubmed&retmode=text&rettype=abstract&id='+id,{ignoreLoadingBar: false,cache:true}).then(function(res){
            console.info(res);
            return res;
    },function(err){console.error(err)});
  };
  
  //search Pubmed Central through EuropePMC
  var esearch=function(query){
    return $http.jsonp(apiSearch+'search?resulttype=lite&format=json&callback=JSON_CALLBACK&query='+query,{ignoreLoadingBar: false,cache:true}).then(function(res){
      return { 
        count : res.data.hitCount,
        result : res.data.resultList.result
      };
    },function(err){console.error(err)});
  };
  
  return {
    'fetch':efetch,
    'search':esearch
  };
  
});