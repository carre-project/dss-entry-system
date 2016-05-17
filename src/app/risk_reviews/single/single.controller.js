(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('risk_reviewsSingleController', risk_reviewsSingleController);

  /** @ngInject */
  function risk_reviewsSingleController(toastr, visibleFields, content, Risk_reviews, CARRE, SweetAlert, $stateParams, uiGridGroupingConstants, $scope, $timeout, Pubmed, uiGridConstants, $state) {
    var vm = this;


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

    function getRisk_factor(id) {
      Risk_reviews.get([id]).then(function(res) {
        if (res.data) {
          vm.current = res.data[0];
          vm.fields = visibleFields.map(function(field) {
            return {
              value: field,
              label: content.labelOf(field)
            };
          });
        }
        else $state.go('main.risk_reviews.list');
      }, function(err) {
        console.error(err);
        $state.go('main.risk_reviews.list');
      });
    }
    


  }

})();
