(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('citationsController', citationsController);

  /** @ngInject */
  function citationsController(toastr,Citations,currentUser,NgTableParams,citationsList) {
    var vm = this;
    
    vm.tableParams = new NgTableParams({}, {
      dataset:citationsList
    });
    // var citation='<http://carre.kmi.open.ac.uk/citations/15385656>';
    // if(currentUser){
    //   Citations.get().success(function(data) {
          
          
    //       console.log('Raw Data: ',data); 
          
    //       // vm.queryResult={
    //       //   'error': !(data instanceof Array),
    //       //   'data': data
    //       // }
    //   });
    // }

    
      
  }
})();
