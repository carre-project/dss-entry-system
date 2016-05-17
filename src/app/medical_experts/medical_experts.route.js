/*global angular*/
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    

    
    $stateProvider
    
      /*  Medical Experts  */
      .state('main.medical_experts', {
        'abstract':true,
        templateUrl: 'app/medical_experts/main.html',
        url: '/medical_experts'
      })
      .state('main.medical_experts.list', {
        controller: 'medical_expertsController',
        controllerAs: 'medical_experts',
        templateUrl: 'app/medical_experts/list.html',
        url: ''
      })
      .state('main.medical_experts.view', {
        controller: 'medical_expertsSingleController',
        templateUrl: 'app/medical_experts/single/view.html',
        controllerAs: 'medical_expert',
        url: '/:id'
      });
  }

})();
