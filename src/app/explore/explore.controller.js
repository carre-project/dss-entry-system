(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('ExploreController', ExploreController);

  /** @ngInject */
  function ExploreController($rootScope, $timeout, toastr, CARRE, $location, CONFIG, $scope, Risk_elements,$state,SweetAlert) {
    var vm = this;
    vm.minConnections=0;
    vm.ready=true;
    vm.risk_elements_selected=[];
    vm.setNewId=function(){
      vm.ready=false;
      $timeout(function(){
        vm.id=vm.risk_elements_selected;
        vm.ready=true;
      },100)
    }
    
    //play with colors
    $scope.refreshColors=function(){
      var elems=angular.element('.ui-select-match-item');
      angular.forEach(elems, function( el,index ){
         angular.element(el).css('background',CONFIG.COLORS[index]);
      });
    }
    
    
    //add item programmatically
    vm.addItem = function(item){
      vm.risk_elements_selected.push(item);
      $timeout(function(){$scope.refreshColors()},50);
    }
    
    //example #1
    $scope.runExample=function(exampleItems){
      vm.risk_elements_selected=[];
      $timeout(function(){
        vm.addItem('http://carre.kmi.open.ac.uk/risk_elements/RL_9');
      },0)
      $timeout(function(){
        vm.addItem('http://carre.kmi.open.ac.uk/risk_elements/RL_18');
      },500)
      $timeout(function(){
        vm.addItem('http://carre.kmi.open.ac.uk/risk_elements/RL_19');
      },1000)
      $timeout(function(){
        vm.setNewId();
      },1500);
    }
    
    //get risk elements
    Risk_elements.get().then(function(res) {
      vm.risk_elements = res.data.map(function(rl) {
          var obj={
            value: rl.id,
            label: rl.has_risk_element_name_label
          };
          return obj;
      });
    });
    
    
    
  }
})();
