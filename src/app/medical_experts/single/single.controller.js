(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('medical_expertsSingleController', medical_expertsSingleController);

  /** @ngInject */
  function medical_expertsSingleController(toastr,CONFIG, content, Bioportal, Medical_experts, CARRE, SweetAlert, $stateParams, $timeout, Pubmed, $state, $scope) {
    var vm = this;
    
    var visibleFields = [
      "has_firstname",
      "has_lastname",
      "has_medical_specialty_identifier",
      "has_medical_position",
      "has_short_cv",
      "has_personal_page_url",
      "has_user_graph",
      "has_avatar",
      "is_coordinator_of_team",
      "has_team_name"
    ];
    
    var labels=[
        "Risk Factors",
        "Risk Evidences",
        "Risk Elements",
        "Observables",
        "Citations"
      ];
      
    var labels_lo=labels.map(function(str){return str.toLowerCase().replace(" ","_")});

  
    vm.colors=CONFIG.COLORS;
    vm.counterchart_labels = labels;
    vm.counterchart_series=["Entered","Reviewed"];
    vm.counterchart_data=[[0,0,0,0,0],[0,0,0,0,0]];
    
    /* View Risk_element */
    vm.id = $stateParams.id;
    vm.current = {};
    if (vm.id) getMedical_expert(vm.id);


    /* Helper functions */
    function getMedical_expert(id) {
      Medical_experts.get([id]).then(function(res) {
        if (res.data) {
          vm.current = res.data[0];
          
          Bioportal.fetch(vm.current.has_medical_specialty_identifier_label).then(function(res){
            vm.current.has_medical_specialty_label=res[0].label||"";
            vm.current.has_medical_specialty_link=res[0].link||"";
          })
          
          Medical_experts.countFor(vm.current.has_graph_uri[0]).then(function(res){
            //set data for the graph
            res.data.forEach(function(obj){
              var pos=labels_lo.indexOf(obj.type.value.split("#")[1]+'s');
              vm.counterchart_data[0][pos]=Number(obj.authored.value);
              vm.counterchart_data[1][pos]=Number(obj.reviewed.value);
            });
          });
          
        }
        else $state.go('main.medical_experts.list');
      }, function(err) {
        console.error(err);
        $state.go('main.medical_experts.list');
      });
    }
    
    
    //event on create method
    // $scope.$on('create', function (event, chart) {
    //   // set colors for each bar
    //   if(chart.datasets){
    //     chart.datasets[0].bars.map(function(obj,index){
    //       var rgb=hexToRgb(vm.colors[index])
    //       obj.fillColor="rgba("+rgb.r+","+rgb.g+","+rgb.b+",0.5)";
    //       obj.strokeColor="#FFF";
    //       return obj;
    //     });
        
    //     chart.datasets[1].bars.map(function(obj,index){
    //       var rgb=hexToRgb(vm.colors[index])
    //       obj.fillColor="rgba("+rgb.r+","+rgb.g+","+rgb.b+",1)";
    //       obj.strokeColor="#FFF";
    //       return obj;
    //     });
    //   }
    // });

  }

})();
