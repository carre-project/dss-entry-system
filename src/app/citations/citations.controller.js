(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('CitationsController', CitationsController);

  /** @ngInject */
  function CitationsController(toastr,Citations,currentUser,NgTableParams,CARRE) {
    var vm = this;

    
    // vm.user=currentUser;
    
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
    vm.list=Citations.list();
    // vm.tableParams = new NgTableParams({}, {
    //   getData: function(params) {
    //     // ajax request to api
    //     return Citations.list();
    //   }
    // });
    
      
  }
})();
