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

    
    //show message for the user
    if(currentUser.username){
      toastr.info('<h3>Hello '+currentUser.username+'!</h3><p>Have fun with the risk factors!</p>');
    } else {
      toastr.warning('<h3>Hello Guest!</h3><p>Please login to edit the data.</p>');
    }

    

  }
})();
