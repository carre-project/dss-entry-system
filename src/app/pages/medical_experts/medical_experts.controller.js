(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('medical_expertsController', medical_expertsController);

  /** @ngInject */
  function medical_expertsController(Bioportal, toastr, Medical_experts, CONFIG, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state , content) {
    var vm = this; //controller as vm
    
    
    var visibleGridColumns=[
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
    
    
    /************** List Template **************/
    
    var medical_experts = [];
    vm.gridLoading=Medical_experts.get().then(function(res) {
      vm.users = res.data;
      
      console.log('Model response: ', res);
      //make the response available in the view
      vm.res = res;

    });

  }
})();
