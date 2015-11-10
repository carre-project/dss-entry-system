(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, toastr, Citations, currentUser, $location, CONFIG,citationsArray,risk_elementsArray,risk_evidencesArray,observablesArray,risk_factorsArray) {
    var vm = this;


    vm.user = currentUser;
    vm.config = CONFIG;
    
    //get resolved data
    vm.citations=citationsArray.data||[];
    vm.observables=observablesArray.data||[];
    vm.risk_elements=risk_elementsArray.data||[];
    vm.risk_evidences=risk_evidencesArray.data||[];
    vm.risk_factors=risk_factorsArray.data||[];
    
    
    
    //find those without reviews
    function unreviewedReducer(array,obj){
      if(!obj.has_reviewer) array.push(obj);
      return array;
    }
    vm.citationsUnreviewed=vm.citations.reduce(unreviewedReducer,[]);
    vm.observablesUnreviewed=vm.observables.reduce(unreviewedReducer,[]);
    vm.risk_elementsUnreviewed=vm.risk_elements.reduce(unreviewedReducer,[]);
    vm.risk_evidencesUnreviewed=vm.risk_evidences.reduce(unreviewedReducer,[]);
    vm.risk_factorsUnreviewed=vm.risk_factors.reduce(unreviewedReducer,[]);
    
    
    
    //clean up the browser url
    $location.url($location.path());
    var baseUrl = $location.absUrl();

    //set up the urls 
    vm.loginUrl = CONFIG.CARRE_DEVICES + 'login?next=' + baseUrl;
    vm.logoutUrl = CONFIG.CARRE_DEVICES + 'logout?next=' + baseUrl;


    // activate();

    // function activate() {
    //   getWebDevTec();
    //   $timeout(function() {
    //     vm.classAnimation = 'rubberBand';
    //   }, 4000);
    // }

    // function showToastr() {
    //   toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
    //   vm.classAnimation = '';
    // }

    // function getWebDevTec() {
    //   vm.awesomeThings = webDevTec.getTec();

    //   angular.forEach(vm.awesomeThings, function(awesomeThing) {
    //     awesomeThing.rank = Math.random();
    //   });
    // }

  }
})();
