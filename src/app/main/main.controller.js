(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($rootScope, $timeout, toastr, CARRE,currentUser, $location, CONFIG) {
    var vm = this;

    vm.user = currentUser;
    vm.config = CONFIG;
    
    //get total and unreviewed elements 
    CARRE.count('citation').then(function(res){vm.citations=res;});
    CARRE.count('risk_element').then(function(res){vm.risk_elements=res;});
    CARRE.count('risk_evidence').then(function(res){vm.risk_evidences=res;});
    CARRE.count('observable').then(function(res){vm.observables=res;});
    CARRE.count('risk_factor').then(function(res){vm.risk_factors=res;});
  
    
    
    
    //clean up the browser url
    $location.url($location.path());
    var baseUrl = $location.absUrl();

    //set up the urls 
    vm.loginUrl = CONFIG.CARRE_DEVICES + 'login?next=' + baseUrl;
    vm.logoutUrl = CONFIG.CARRE_DEVICES + 'logout?next=' + baseUrl;
    vm.settingsUrl = CONFIG.CARRE_DEVICES + 'settings';
    vm.passwordUrl = CONFIG.CARRE_DEVICES + 'recover?next=' + baseUrl;


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
