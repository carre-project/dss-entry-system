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
    
    CARRE.countAll().then(function(res){
      var r=res.data[0];
      console.log('Counter data:',r);
      
      vm.citations = {
        total:Number(r.citations.value)
      };
      vm.measurement_types = {
        total:Number(r.measurement_types.value)
      };
      vm.observables = {
        total:Number(r.observables.value),
        noreviews:Number(r.observables_unreviewed.value)
      };
      vm.risk_elements = {
        total:Number(r.risk_elements.value),
        noreviews:Number(r.risk_elements_unreviewed.value)
      };
      vm.risk_evidences = {
        total:Number(r.risk_evidences.value),
        noreviews:Number(r.risk_evidences_unreviewed.value)
      };
      vm.risk_factors = {
        total:Number(r.risk_factors.value),
        noreviews:Number(r.risk_factors_unreviewed.value)
      };
      
      //set data for the graph
      vm.counterchart_data[0][0]=vm.citations.total;
      vm.counterchart_data[0][1]=vm.measurement_types.total;
      vm.counterchart_data[0][2]=vm.observables.total;
      vm.counterchart_data[0][3]=vm.risk_elements.total;
      vm.counterchart_data[0][4]=vm.risk_evidences.total;
      vm.counterchart_data[0][5]=vm.risk_factors.total;
      
      //set top counter
      vm.countAll = Number(vm.citations.total+
      vm.risk_elements.total+
      vm.risk_factors.total+
      vm.risk_evidences.total+
      vm.observables.total+
      vm.measurement_types.total);
    });
    
    
    //get total and unreviewed elements======== OLD many requests;
    // CARRE.count('citation').then(function(res) {
    //   vm.citations = res;
    //   vm.countAllInit = vm.countAll;
    //   vm.countAll += res.total;
    //   vm.counterchart_data[0][0]=res.total;
    // });
    // CARRE.count('measurement_type').then(function(res) {
    //   vm.measurement_types = res;
    //   vm.countAllInit = vm.countAll;
    //   vm.countAll += res.total;
    //   vm.counterchart_data[0][1]=res.total;
    // });
    // CARRE.count('observable').then(function(res) {
    //   vm.observables = res;
    //   vm.countAllInit = vm.countAll;
    //   vm.countAll += res.total;
    //   vm.counterchart_data[0][2]=res.total;
    // });
    // CARRE.count('risk_element').then(function(res) {
    //   vm.risk_elements = res;
    //   vm.countAllInit = vm.countAll;
    //   vm.countAll += res.total;
    //   vm.counterchart_data[0][3]=res.total;
    // });
    // CARRE.count('risk_evidence').then(function(res) {
    //   vm.risk_evidences = res;
    //   vm.countAllInit = vm.countAll;
    //   vm.countAll += res.total;
    //   vm.counterchart_data[0][4]=res.total;
    // });
    // CARRE.count('risk_factor').then(function(res) {
    //   vm.risk_factors = res;
    //   vm.countAllInit = vm.countAll;
    //   vm.countAll += res.total;
    //   vm.counterchart_data[0][5]=res.total;
    // });

  }
})();
