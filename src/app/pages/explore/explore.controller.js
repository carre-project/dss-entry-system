(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('ExploreController', ExploreController);

  /** @ngInject */
  function ExploreController($rootScope, $timeout, toastr, CARRE, $location, CONFIG, $scope, Email, Risk_elements,$state,$http,GRAPH, Risk_factors) {
    var vm = this;
    vm.minConnections=0;
    vm.ready=true;
    vm.risk_elements_selected=[];
    vm.graph_type=$location.search().graphtype||"sankey";
    console.log("Explore state params:",$state.params)
    vm.setNewId=function(){
      vm.ready=false;
      $timeout(function(){
        vm.id=vm.risk_elements_selected;
        vm.ready=true;
      },100)
    }
    vm.examples=[
    {
      "label":"Connections between diabetes,hypertension and colorectal cancer",
      "data":["http://carre.kmi.open.ac.uk/risk_elements/RL_29","http://carre.kmi.open.ac.uk/risk_elements/RL_19","http://carre.kmi.open.ac.uk/risk_elements/RL_14"]
    },{
      "label":"How do obesity, diabetes and depression relate with each other?",
      "data":["http://carre.kmi.open.ac.uk/risk_elements/RL_38","http://carre.kmi.open.ac.uk/risk_elements/RL_19","http://carre.kmi.open.ac.uk/risk_elements/RL_18"]
    },
    {
      "label": "a complex one",
      "data": ["http://carre.kmi.open.ac.uk/risk_elements/RL_19","http://carre.kmi.open.ac.uk/risk_elements/RL_33", "http://carre.kmi.open.ac.uk/risk_elements/RL_36", "http://carre.kmi.open.ac.uk/risk_elements/RL_38", "http://carre.kmi.open.ac.uk/risk_elements/RL_25"]
    },
    {
      "label":"too complex to read",
      "data":["http://carre.kmi.open.ac.uk/risk_elements/RL_19","http://carre.kmi.open.ac.uk/risk_elements/RL_33","http://carre.kmi.open.ac.uk/risk_elements/RL_36","http://carre.kmi.open.ac.uk/risk_elements/RL_38","http://carre.kmi.open.ac.uk/risk_elements/RL_25","http://carre.kmi.open.ac.uk/risk_elements/RL_7","http://carre.kmi.open.ac.uk/risk_elements/RL_10","http://carre.kmi.open.ac.uk/risk_elements/RL_11","http://carre.kmi.open.ac.uk/risk_elements/RL_18","http://carre.kmi.open.ac.uk/risk_elements/RL_22","http://carre.kmi.open.ac.uk/risk_elements/RL_9","http://carre.kmi.open.ac.uk/risk_elements/RL_29","http://carre.kmi.open.ac.uk/risk_elements/RL_16","http://carre.kmi.open.ac.uk/risk_elements/RL_31","http://carre.kmi.open.ac.uk/risk_elements/RL_40"]
    },
    // {
    //   "label":"Demo test from unknown user",
    //   "data":["http://carre.kmi.open.ac.uk/risk_elements/RL_19","http://carre.kmi.open.ac.uk/risk_elements/RL_33","http://carre.kmi.open.ac.uk/risk_elements/RL_36","http://carre.kmi.open.ac.uk/risk_elements/RL_38","http://carre.kmi.open.ac.uk/risk_elements/RL_25"]
    // }
    ];
    
    vm.recommendPopoverUrl="recommendExampleTemplate.html";
    vm.recommendExample=function(label,items){
      var data={
        label:label,
        data:vm.risk_elements_selected
      }
      Email.example(data);
    }
    
    //play with colors
    $scope.refreshColors=function(){
      var elems=angular.element('.ui-select-match-item');
      angular.forEach(elems, function( el,index ){
         angular.element(el).css('background',CONFIG.COLORS[index]);
      });
    }
    
    //add item programmatically
    function addItem(item){
      vm.risk_elements_selected.push(item);
      $timeout(function(){$scope.refreshColors()},50);
    }
    
    //example #1
    $scope.runExample=function(exampleItems){
      var timeInterval=500;
      vm.risk_elements_selected=[];
      exampleItems.forEach(function(url,index,arr){
        $timeout(function(){ addItem(url); },index*timeInterval);
      });
      $timeout(function(){ vm.setNewId(); },exampleItems.length*timeInterval);
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
    
    
    // set elements by url
    if($location.search().elements&&$location.search().elementstype){
      vm.risk_elements_selected = $location.search().elements.split(',').map(function(elem){
        return "http://carre.kmi.open.ac.uk/"+$location.search().elementstype+"/"+elem;
      })
      vm.setNewId();
    }
    
  }
})();
