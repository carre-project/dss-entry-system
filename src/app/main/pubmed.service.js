angular.module('CarreEntrySystem').service('Pubmed', function($http) {
  var api='http://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
  // Retrieving a cookie and set initial user object
  var efectch=function(id){
    return $http.get(api+'efetch.fcgi?db=pubmed&retmode=text&rettype=abstract&id='+id);
  }
  
  return {
    'fetch':efectch
  }
  
});