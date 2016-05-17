(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('risk_factorsSingleController', risk_factorsSingleController);

  /** @ngInject */
  function risk_factorsSingleController(content, Risk_factors, uiGridGroupingConstants, $scope, uiGridConstants, $state) {

    var vm = $scope;
    
    vm.id=$state.params.id;
    // init process 
    if ($state.includes("**.create")) {
      vm.mode = 'create';
    } else if (vm.id) {
      if($state.includes("**.view")){
        vm.mode='view';
        loadRiskEvidences(vm.id);
      } else if($state.includes("**.edit")){
        vm.mode='edit';
      } else {
        $state.go('404_error');
        return;
      }
    }
    
    $scope.$on('risk_factor:save', returnBack);
    $scope.$on('risk_factor:cancel', returnBack);
    
    function returnBack() {
      console.log('called',vm.id);
      if (vm.id) {
        $state.go('^.view', {
          id: vm.id
        });
      }
      else $state.go('^.list');
    }

    /************** List Template **************/

    var visibleGridColumns = [
      'has_risk_factor',
      'has_observable_condition_text',
      // 'has_risk_evidence_source',
      // 'has_risk_evidence_ratio_type',
      'has_risk_evidence_ratio_value',
      // 'has_confidence_interval_min',
      // 'has_confidence_interval_max'
    ];


    function loadRiskEvidences(id) {
      
      vm.gridLoading = Risk_factors.risk_evidences(id).then(function(res) {
        
        if(res.data) {
          console.log(res.data)
          vm.mygrid.data = res.data;
  
          //make the response available in the view
          vm.res = res;
  
          /* Reset columns */
          vm.mygrid.columnDefs = [];
          
          vm.mygrid.columnDefs.push({
            field: 'View',
            enableFiltering: false,
            enableColumnMenu: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ui-sref="main.risk_evidences.view({id:row.entity.id_label})"><i class="fa fa-eye"></i></button></div>',
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
        } else {
          vm.mygrid.columnDefs = [];
          vm.mygrid.data=[];
        }



      });
    }

    /* GRID Default options */
    vm.mygrid = content.default;



  }

})();
