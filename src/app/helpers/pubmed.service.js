angular.module('CarreEntrySystem').service('Pubmed', function($http,CONFIG) {
  var api=CONFIG.PUBMED_API_URL;
  // Retrieving a cookie and set initial user object
  var efectch=function(id){
    return $http.get(api+'efetch.fcgi?db=pubmed&retmode=text&rettype=abstract&id='+id,{ignoreLoadingBar: false,cache:true}).then(function(res){
            console.info(res);
            return res;
    },function(err){console.error(err)});
  }
  
  return {
    'fetch':efectch
  }
  
});