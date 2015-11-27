(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('DashboardController', DashboardController);

  /** @ngInject */
  function DashboardController($rootScope, $timeout, toastr, CARRE, currentUser, $location, CONFIG) {
    var vm = this;

    //graph init
    vm.countAllInit = 0;
    vm.countAll = 0;
  
    vm.counterchart_labels = [
      "Citations",
      "Measurement Types",
      "Observables",
      "Risk Elements",
      "Risk Evidences",
      "Risk Factors",
    ];
    vm.counterchart_data=[];
    vm.counterchart_data[0] = [0,0,0,0,0,0];

    //get total and unreviewed elements 
    CARRE.count('citation').then(function(res) {
      vm.citations = res;
      vm.countAllInit = vm.countAll;
      vm.countAll += res.total;
      vm.counterchart_data[0][0]=res.total;
    });
    CARRE.count('measurement_type').then(function(res) {
      vm.measurement_types = res;
      vm.countAllInit = vm.countAll;
      vm.countAll += res.total;
      vm.counterchart_data[0][1]=res.total;
    });
    CARRE.count('observable').then(function(res) {
      vm.observables = res;
      vm.countAllInit = vm.countAll;
      vm.countAll += res.total;
      vm.counterchart_data[0][2]=res.total;
    });
    CARRE.count('risk_element').then(function(res) {
      vm.risk_elements = res;
      vm.countAllInit = vm.countAll;
      vm.countAll += res.total;
      vm.counterchart_data[0][3]=res.total;
    });
    CARRE.count('risk_evidence').then(function(res) {
      vm.risk_evidences = res;
      vm.countAllInit = vm.countAll;
      vm.countAll += res.total;
      vm.counterchart_data[0][4]=res.total;
    });
    CARRE.count('risk_factor').then(function(res) {
      vm.risk_factors = res;
      vm.countAllInit = vm.countAll;
      vm.countAll += res.total;
      vm.counterchart_data[0][5]=res.total;
    });

  }
})();
