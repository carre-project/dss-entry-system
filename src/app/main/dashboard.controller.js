(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('DashboardController', DashboardController);

  /** @ngInject */
  function DashboardController($rootScope, $timeout, toastr, CARRE,currentUser, $location, CONFIG) {
    var vm = this;
    
    //get total and unreviewed elements 
    CARRE.count('citation').then(function(res){vm.citations=res;});
    CARRE.count('risk_element').then(function(res){vm.risk_elements=res;});
    CARRE.count('risk_evidence').then(function(res){vm.risk_evidences=res;});
    CARRE.count('observable').then(function(res){vm.observables=res;});
    CARRE.count('risk_factor').then(function(res){vm.risk_factors=res;});
  
    

  }
})();
