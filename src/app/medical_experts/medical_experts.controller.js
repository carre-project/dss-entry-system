(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('medical_expertsController', medical_expertsController);

  /** @ngInject */
  function medical_expertsController(Bioportal, toastr, Medical_experts, currentUser, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state , content) {
    var vm = this; //controller as vm
    // currentUser is our user model;
    
    var visibleGridColumns=[
      "has_firstname",
      "has_lastname",
      "has_medical_specialty_identifier",
      "has_medical_position",
      "has_short_cv",
      "has_personal_page_url",
      "has_user_graph"
      ];
    
    
    /************** List Template **************/
    
    var medical_experts = [];
    vm.gridLoading=Medical_experts.get().then(function(res) {
      medical_experts = res.data;
      vm.users = [];
      
      console.log('Model response: ', res);
      //make the response available in the view
      vm.res = res;
      medical_experts.forEach(function(user){
          var u={};
          angular.copy(user,u);
          Bioportal.fetch(user.has_medical_specialty_identifier_label).then(function(res){
            
            u.has_medical_specialty_label=res[0].label||"";
            u.has_medical_specialty_link=res[0].link||"";
            vm.users.push(u);
          })
      })

    });

  }
})();
