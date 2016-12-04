(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('DashboardController', DashboardController);

  /** @ngInject */
  function DashboardController($rootScope, $timeout, toastr, CARRE, $location, CONFIG, $scope,Email) {
    var vm = this;

    //graph init
    vm.countAllInit = 0;
    vm.countAll = 0;
  
    vm.colors=CONFIG.COLORS;
    console.log(vm.colors);
    vm.counterchart_labels = [
      "DSS Messages",
      "Risk Alerts",
      "Calculated Observables",
    ];
    vm.counterchart_data=[];
    vm.counterchart_data[0] = [0,0,0,0,0];
    
    //event on create method
    $scope.$on('create', function (event, chart) {
      // set colors for each bar
      if(chart && chart.datasets && chart.datasets[0] && chart.datasets[0].bars.length>0){
        chart.datasets[0].bars.map(function(obj,index){
          obj.fillColor=vm.colors[index];
          obj.strokeColor="#FFF";
          return obj;
        });
      } else {
        Email.bug({title:'chart datasets not exist',data:chart.datasets[0]});
        console.log('chart datasets not exist');
        $timeout(function(){
        chart.datasets[0].bars.map(function(obj,index){
          obj.fillColor=vm.colors[index];
          obj.strokeColor="#FFF";
          return obj;
        });
      },200);
      }
    });

    //get total elements 
    
    CARRE.countAll().then(function(res){
      var r=res.data[0];
      console.log('Counter data:',r);
      
      vm.calculated_observables = {
        total:Number(r.calculated_observables.value)
      };
      vm.dss_messages = {
        total:Number(r.dss_messages.value)
      };
      vm.risk_alerts = {
        total:Number(r.risk_alerts.value)
      };
      
      //set data for the graph
      vm.counterchart_data[0][1]=vm.risk_alerts.total;
      vm.counterchart_data[0][0]=vm.dss_messages.total;
      vm.counterchart_data[0][2]=vm.calculated_observables.total;
      
      //set top counter
      vm.countAll = vm.dss_messages.total+
                    vm.risk_alerts.total+
                    vm.calculated_observables.total;
                    
                    
      /* Donut graph temp */
    vm.counterdonut_data=[
      vm.risk_alerts.total,
      vm.dss_messages.total,
      vm.calculated_observables.total
    ];
    vm.counterdonut_labels=vm.counterchart_labels;
    vm.counterdonut_options={};
    
    });

    
  }
})();
