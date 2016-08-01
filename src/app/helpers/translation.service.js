angular.module('CarreEntrySystem').filter('translateMapping', function(CarreTranslate) {
  return function(input) {
    return CarreTranslate(input);
  };
}).service('CarreTranslate',["CONFIG", function(CONFIG) {
  
  var translations=window.CARRE_TRANSLATIONS;
  
  return function(str,showOnlyIfExists){
    // console.log((showOnlyIfExists?"--Not-Available-Translation--":str));
    if(translations[CONFIG.LANG].hasOwnProperty(str)) return translations[CONFIG.LANG][str];
    else return (showOnlyIfExists?"--Not-Available-Translation--":str);
  };
  
}])
  .filter('translate',function(Translate){
    return function(input){
      return Translate(input);
    }
  });