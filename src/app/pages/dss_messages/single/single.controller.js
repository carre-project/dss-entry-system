(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('dss_messagesSingleController', dss_messagesSingleController);

  /** @ngInject */
  function dss_messagesSingleController(content, dss_messages, uiGridGroupingConstants, $scope, uiGridConstants, $state) {

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
    
    $scope.$on('dss_message:save', returnBack);
    $scope.$on('dss_message:cancel', returnBack);
    
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
      'has_dss_message',
      'has_risk_alert_condition_text',
      // 'has_risk_alert_source',
      // 'has_risk_alert_ratio_type',
      'has_risk_alert_ratio_value',
      // 'has_confidence_interval_min',
      // 'has_confidence_interval_max'
    ];


    function loadRiskEvidences(id) {
      
      vm.gridLoading = dss_messages.risk_alerts(id).then(function(res) {
        
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
            cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ui-sref="main.risk_alerts.view({id:row.entity.id_label})"><i class="fa fa-eye"></i></button></div>',
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
