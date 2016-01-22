(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('risk_elementsController', risk_elementsController);

  /** @ngInject */
  function risk_elementsController(toastr, currentUser, Risk_elements, $stateParams, CONFIG, uiGridGroupingConstants, $timeout, Pubmed, uiGridConstants, $state , content) {
    var vm = this; //controller as vm
    
    
    var visibleGridColumns=[
      'has_risk_element_name',
      'has_risk_element_identifier',
      'has_risk_element_type',
      'has_risk_element_modifiable_status',
      'has_risk_element_observable',
      ];
    
    
    /************** List Template **************/
    
    var risk_elements = [];
    vm.gridLoading=Risk_elements.get().then(function(res) {
      risk_elements = res.data;
      vm.mygrid.data = risk_elements;
      
      console.log('Model response: ', res);
      //make the response available in the view
      vm.res = res;

      /* Reset columns */
      vm.mygrid.columnDefs = [];
      
      
      vm.mygrid.columnDefs.push({
        field: 'View',
        enableFiltering: false,
        enableColumnMenu: false,
        cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ui-sref="main.risk_elements.view({id:row.entity.id_label})"><i class="fa fa-eye"></i></button></div>',
        width: 60
      });

      //show edit buttons
      if (currentUser.username) {
        vm.mygrid.columnDefs.push({
          field: 'Edit',
          enableFiltering: false,
          enableColumnMenu: false,
          cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ui-sref="main.risk_elements.edit({id:row.entity.id_label})"><i class="fa fa-edit"></i></button></div>',
          width: 60
        });
      }
      
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
