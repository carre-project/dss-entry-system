(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('medical_expertsController', medical_expertsController);

  /** @ngInject */
  function medical_expertsController(toastr, Medical_experts, currentUser, $stateParams, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state , content) {
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
      vm.mygrid.data = medical_experts;
      
      console.log('Model response: ', res);
      //make the response available in the view
      vm.res = res;

      /* Reset columns */
      vm.mygrid.columnDefs = [];
      
      
      vm.mygrid.columnDefs.push({
        field: 'View',
        enableFiltering: false,
        enableColumnMenu: false,
        cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ui-sref="main.medical_experts.view({id:row.entity.id_label})"><i class="fa fa-eye"></i></button></div>',
        width: 60
      });
      
      //dynamic creation of the grid columns
      content.fields(res.fields, visibleGridColumns).forEach((function(obj) {
        vm.mygrid.columnDefs.push(obj);
      }));

      vm.mygrid.columnDefs.push({
        field: 'id_label',
        displayName: 'ID',
        visible: false
      });


    });

    /* GRID Default options */
    vm.mygrid = content.default;

  }
})();
