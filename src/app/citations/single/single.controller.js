(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('citationsSingleController', citationsSingleController);

  /** @ngInject */
  function citationsSingleController($stateParams, $state, CARRE, $scope){
   
    var vm = $scope;
    
    vm.id=$state.params.id;
    // init process 
     if ($state.is("main.citations.createWithId")) {
      if($stateParams.pubmedId) {
        //check if already exists a citation with this PubmedID;
        CARRE.search('citation',$stateParams.pubmedId).then(function(res){
          
          vm.create = true;
          console.log('Citation Records for this pubmedid'+ $stateParams.pubmedId, res);
          res.data=res.data||[];
          if(res.data.length>0){
            $state.go('main.citations.edit',{id:res.data[0].id_label},{reload:true});
          } else {
              console.log('Article with id: ',$stateParams.pubmedId);
              vm.current = { pubmedId:$stateParams.pubmedId };
              vm.mode='create';
          }
        });
      } else $state.go('main.citations.create',{},{reload:true});
      
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
    
    $scope.$on('citation:save', returnBack);
    $scope.$on('citation:cancel', returnBack);
    
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
