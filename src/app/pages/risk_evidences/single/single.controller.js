/*global jsep*/
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('risk_evidencesSingleController', risk_evidencesSingleController);

  /** @ngInject */
  function risk_evidencesSingleController( $state, $scope, CARRE) {
    
    var vm = $scope;
    
    vm.id=$state.params.id;
    vm.pubmedId=$state.params.pubmedId;
    
    // init process 
     if ($state.is("main.risk_evidences.createWithId")) {
      console.log(vm.pubmedId);
      if(vm.pubmedId) {
        //check if already exists a risk_evidence with this PubmedID;
        CARRE.search('citation',vm.pubmedId).then(function(res){
          vm.create = true;
          console.log('risk_evidence Records for this pubmedid: '+ vm.pubmedId, res);
          res.data=res.data||[];
          if(res.data.length>0){
            
            console.log('Article found with data: ',res.data[0]);
            vm.current = { pubmedId:vm.pubmedId, citation: res.data[0].id };
            vm.mode='create';
            
          } else {
            console.log('Article not found id: ',vm.pubmedId);
            vm.current = { pubmedId:vm.pubmedId };
            vm.mode='create';
          }
        });
      } else $state.go('main.risk_evidences.create',{},{reload:true});
      
    } else if ($state.includes("**.create")) {
      vm.mode = 'create';
    } else if (vm.id) {
      if($state.includes("**.view")){
        vm.mode='view';
      } else if($state.includes("**.edit")){
        vm.mode='edit';
      } else {
        $state.go('404_error');
        return;
      }
    }
    
    $scope.$on('risk_evidence:save', returnBack);
    $scope.$on('risk_evidence:cancel', returnBack);
    
    function returnBack() {
      console.log('called',vm.id);
      if (vm.id) {
        $state.go('^.view', {
          id: vm.id
        });
      }
      else $state.go('^.list');
    }
    

  }

})();
