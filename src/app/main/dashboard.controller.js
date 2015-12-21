(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('DashboardController', DashboardController);

  /** @ngInject */
  function DashboardController($rootScope, $timeout, toastr, CARRE, $location, CONFIG) {
    var vm = this;

    //graph init
    vm.countAllInit = 0;
    vm.countAll = 0;
  
    vm.counterchart_labels = [
      // "Medical Experts",
      "Risk Factors",
      "Risk Evidences",
      "Risk Elements",
      "Observables",
      "Citations"
      // "Measurement Types",
    ];
    vm.counterchart_data=[];
    vm.counterchart_data[0] = [0,0,0,0,0];


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
      // vm.medical_experts = {
      //   total:Number(r.risk_factors.value),
      //   noreviews:Number(r.risk_factors_unreviewed.value)
      // };
      
      //set data for the graph
      vm.counterchart_data[0][0]=vm.risk_factors.total;
      vm.counterchart_data[0][1]=vm.risk_evidences.total;
      vm.counterchart_data[0][2]=vm.risk_elements.total;
      vm.counterchart_data[0][3]=vm.observables.total;
      // vm.counterchart_data[0][0]=vm.measurement_types.total;
      vm.counterchart_data[0][4]=vm.citations.total;
      
      //set top counter
      vm.countAll = vm.citations.total+
                    vm.risk_elements.total+
                    vm.risk_factors.total+
                    vm.risk_evidences.total+
                    vm.observables.total+
                    vm.measurement_types.total;
    });

  }
})();
