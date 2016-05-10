(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('risk_reviewsSingleController', risk_reviewsSingleController);

  /** @ngInject */
  function risk_reviewsSingleController(toastr, content, Risk_factors, CARRE, SweetAlert, $stateParams, uiGridGroupingConstants, $scope, $timeout, Pubmed, uiGridConstants, $state) {
    var vm = this;


    // var visibleFields = [
    //   // "type",      
    //   // "id",
    //   "has_risk_review_source",
    //   "has_risk_review_target",
    //   "has_risk_review_association_type",
    //   "has_author",
    //   "has_reviewer"
    // ];


    // /* View Risk_factor */
    // vm.id = $stateParams.id;
    // vm.current = {};
    // vm.edit = $stateParams.edit;
    // if (vm.id) {
    //   getRisk_factor(vm.id);
    //   loadRiskEvidences(vm.id);
    // }

    // //Handle events
    // $scope.$on('risk_review:save', function() {
    //   if (vm.current.id) {
    //     $state.go('main.risk_reviews.view', {
    //       id: vm.id
    //     });
    //   }
    //   else $state.go('main.risk_reviews.list');
    // });
    // $scope.$on('risk_review:cancel', function() {
    //   if (vm.current.id) {
    //     $state.go('main.risk_reviews.view', {
    //       id: vm.id
    //     });
    //   }
    //   else $state.go('main.risk_reviews.list');
    // });


    // if ($state.is("main.risk_reviews.create")) {
    //   vm.create = true;
    //   vm.current = {};
    // }
    // else if ($state.is("main.risk_reviews.edit")) {}
    // else {}
    

    // /* Helper functions */

    // function getRisk_factor(id) {
    //   Risk_factors.get([id]).then(function(res) {
    //     if (res.data) {
    //       vm.current = res.data[0];
    //       vm.fields = visibleFields.map(function(field) {
    //         return {
    //           value: field,
    //           label: content.labelOf(field)
    //         };
    //       });
    //     }
    //     else $state.go('main.risk_reviews.list');
    //   }, function(err) {
    //     console.error(err);
    //     $state.go('main.risk_reviews.list');
    //   });
    // }

    // vm.deleteCurrent = function() {
    //   SweetAlert.swal({
    //       title: "Are you sure?",
    //       text: "Your will not be able to recover this element!",
    //       type: "warning",
    //       showCancelButton: true,
    //       confirmButtonColor: "#DD6B55",
    //       confirmButtonText: "Yes, delete it!",
    //       closeOnConfirm: true,
    //       closeOnCancel: true
    //     },
    //     function(isConfirm) {
    //       if (isConfirm) { CARRE.delete(vm.current.id).then(function() { $state.go('main.risk_reviews.list'); }); }
    //     });
    // };


    // /************** List Template **************/

    // var visibleGridColumns = [
    //   'has_risk_review',
    //   'has_observable_condition_text',
    //   // 'has_risk_evidence_source',
    //   // 'has_risk_evidence_ratio_type',
    //   'has_risk_evidence_ratio_value',
    //   // 'has_confidence_interval_min',
    //   // 'has_confidence_interval_max'
    // ];


    // function loadRiskEvidences(id) {
      
    //   vm.gridLoading = Risk_factors.risk_evidences(id).then(function(res) {
        
    //     if(res.data) {
    //       console.log(res.data)
    //       vm.mygrid.data = res.data;
  
    //       //make the response available in the view
    //       vm.res = res;
  
    //       /* Reset columns */
    //       vm.mygrid.columnDefs = [];
          
    //       vm.mygrid.columnDefs.push({
    //         field: 'View',
    //         enableFiltering: false,
    //         enableColumnMenu: false,
    //         cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary" ui-sref="main.risk_evidences.view({id:row.entity.id_label})"><i class="fa fa-eye"></i></button></div>',
    //         width: 60
    //       });
          
    //       //dynamic creation of the grid columns
    //       content.fields(res.fields, visibleGridColumns).forEach((function(obj) {
    //         vm.mygrid.columnDefs.push(obj);
    //       }));
  
    //       vm.mygrid.columnDefs.push({
    //         field: 'id_label',
    //         displayName: 'ID',
    //         visible: false
    //       });
    //     } else {
    //       vm.mygrid.columnDefs = [];
    //       vm.mygrid.data=[];
    //     }



    //   });
    // }

    // /* GRID Default options */
    // vm.mygrid = content.default;



  }

})();
