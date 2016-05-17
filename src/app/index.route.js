/*global angular*/
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    
    
    //Perform route permission check without angular-permission module
    // function _skipIfAuthenticated($q, $state, $auth) {
    //   var defer = $q.defer();
    //   if ($auth.authenticate()) {
    //     defer.reject(); /* (1) */
    //   }
    //   else {
    //     defer.resolve(); /* (2) */
    //   }
    //   return defer.promise;
    // }

    // function _redirectIfNotAuthenticated($q, $state, $auth) {
    //   var defer = $q.defer();
    //   if ($auth.authenticate()) {
    //     defer.resolve(); /* (3) */
    //   }
    //   else {
    //     $timeout(function() {
    //       $state.go(‘login’); /* (4) */
    //     });
    //     defer.reject();
    //   }
    //   return defer.promise;
    // }
    
    function getGuestState() {
      var url=window.location.href.replace('/edit','').replace('/create','');
      window.location.replace(url);
    }

    
    $stateProvider
      .state('main', {
        'abstract': true,
        controller: 'MainController',
        controllerAs: 'main',
        templateUrl: 'app/main/main.html',
        resolve:{
          'currentUser':function(Auth){
            return Auth.getUser();
          }
        }
      })
      .state('main.dashboard', {
        controller: 'DashboardController',
        controllerAs: 'dashboard',
        url: '/',
        templateUrl: 'app/dashboard/index.html'
      })
      .state('main.explore', {
        controller: 'ExploreController',
        controllerAs: 'explore',
        url: '/explore',
        templateUrl: 'app/explore/index.html'
      })
      
      /*  Citations  */
      .state('main.citations', {
        'abstract':true,
        templateUrl: 'app/citations/main.html',
        url: '/citations'
      })
      .state('main.citations.list', {
        controller: 'citationsController',
        controllerAs: 'citations',
        templateUrl: 'app/citations/list.html',
        url: ''
      })
      .state('main.citations.create', {
        templateUrl: 'app/citations/single/single.html',
        controller: 'citationsSingleController',
        controllerAs: 'citation',
        url: '/create',
        data: {
          permissions: {
            only: ['authenticated_user'],
            redirectTo: function(rejectedPromise) {
              getGuestState();
            }        
            
          }
        }
      })
      .state('main.citations.createWithId', {
        templateUrl: 'app/citations/single/single.html',
        controller: 'citationsSingleController',
        controllerAs: 'citation',
        url: '/create/:pubmedId',
        data: {
          permissions: {
            only: ['authenticated_user'],
            redirectTo: function(rejectedPromise) {
              getGuestState();
            }        
            
          }
        }
      })
      .state('main.citations.edit', {
        templateUrl: 'app/citations/single/single.html',
        controller: 'citationsSingleController',
        controllerAs: 'citation',
        url: '/:id/edit',
        data: {
          permissions: {
            only: ['authenticated_user'],
            redirectTo: function(rejectedPromise) {
              getGuestState();
            }        
            
          }
        }
      })
      .state('main.citations.view', {
        controller: 'citationsSingleController',
        templateUrl: 'app/citations/single/single.html',
        controllerAs: 'citation',
        url: '/:id'
      })
      
      /*  Observables  */
      .state('main.observables', {
        'abstract':true,
        templateUrl: 'app/observables/main.html',
        url: '/observables'
      })
      .state('main.observables.list', {
        controller: 'observablesController',
        controllerAs: 'observables',
        templateUrl: 'app/observables/list.html',
        url: ''
      })
      .state('main.observables.view', {
        controller: 'observablesSingleController',
        templateUrl: 'app/observables/single/single.html',
        controllerAs: 'observable',
        url: '/:id'
      })
      .state('main.observables.create', {
        templateUrl: 'app/observables/single/single.html',
        controller: 'observablesSingleController',
        controllerAs: 'observable',
        url: '/create',
        data: {
          permissions: {
            only: ['authenticated_user'],
            redirectTo: function(rejectedPromise) {
              getGuestState();
            }        
            
          }
        }
      })
      .state('main.observables.edit', {
        templateUrl: 'app/observables/single/single.html',
        controller: 'observablesSingleController',
        controllerAs: 'observable',
        url: '/:id/edit',
        data: {
          permissions: {
            only: ['authenticated_user'],
            redirectTo: function(rejectedPromise) {
              getGuestState();
            }        
            
          }
        }
        
      })
      
      /*  Risk Elements  */
      .state('main.risk_elements', {
        'abstract':true,
        templateUrl: 'app/risk_elements/main.html',
        controller: 'risk_elementsController',
        controllerAs: 'risk_elements',
        url: '/risk_elements'
      })
      .state('main.risk_elements.list', {
        templateUrl: 'app/risk_elements/list.html',
        controller: 'risk_elementsController',
        controllerAs: 'risk_elements',
        url: ''
      })
      .state('main.risk_elements.view', {
        templateUrl: 'app/risk_elements/single/single.html',
        controller: 'risk_elementsSingleController',
        controllerAs: 'risk_element',
        url: '/:id'
      })
      .state('main.risk_elements.create', {
        templateUrl: 'app/risk_elements/single/single.html',
        controller: 'risk_elementsSingleController',
        controllerAs: 'risk_element',
        url: '/create',
        data: {
          permissions: {
            only: ['authenticated_user'],
            redirectTo: function(rejectedPromise) {
              getGuestState();
            }        
            
          }
        }
      })
      .state('main.risk_elements.edit', {
        templateUrl: 'app/risk_elements/single/single.html',
        controller: 'risk_elementsSingleController',
        controllerAs: 'risk_element',
        url: '/:id/edit',
        data: {
          permissions: {
            only: ['authenticated_user'],
            redirectTo: function(rejectedPromise) {
              getGuestState();
            }
          }
        }
        
      })
      
      /*  risk_evidences  */
      .state('main.risk_evidences', {
        'abstract':true,
        templateUrl: 'app/risk_evidences/main.html',
        url: '/risk_evidences'
      })
      .state('main.risk_evidences.list', {
        controller: 'risk_evidencesController',
        controllerAs: 'risk_evidences',
        templateUrl: 'app/risk_evidences/list.html',
        url: ''
      })
      .state('main.risk_evidences.create', {
        templateUrl: 'app/risk_evidences/single/single.html',
        controller: 'risk_evidencesSingleController',
        controllerAs: 'risk_evidence',
        url: '/create',
        data: {
          permissions: {
            only: ['authenticated_user'],
            redirectTo: function(rejectedPromise) {
              getGuestState();
            }        
            
          }
        }
      })
      .state('main.risk_evidences.edit', {
        templateUrl: 'app/risk_evidences/single/single.html',
        controller: 'risk_evidencesSingleController',
        controllerAs: 'risk_evidence',
        url: '/:id/edit',
        data: {
          permissions: {
            only: ['authenticated_user'],
            redirectTo: function(rejectedPromise) {
              getGuestState();
            }            
          }
        }
        
      })
      .state('main.risk_evidences.view', {
        controller: 'risk_evidencesSingleController',
        templateUrl: 'app/risk_evidences/single/single.html',
        controllerAs: 'risk_evidence',
        url: '/:id'
      })
      
      /*  risk_factors  */
      .state('main.risk_factors', {
        'abstract':true,
        templateUrl: 'app/risk_factors/main.html',
        url: '/risk_factors'
      })
      .state('main.risk_factors.list', {
        controller: 'risk_factorsController',
        controllerAs: 'risk_factors',
        templateUrl: 'app/risk_factors/list.html',
        url: ''
      })
      .state('main.risk_factors.create', {
        templateUrl: 'app/risk_factors/single/single.html',
        controller: 'risk_factorsSingleController',
        controllerAs: 'risk_factor',
        url: '/create',
        data: {
          permissions: {
            only: ['authenticated_user'],
            redirectTo: function(rejectedPromise) {
              getGuestState();
            }        
            
          }
        }
      })
      .state('main.risk_factors.edit', {
        templateUrl: 'app/risk_factors/single/single.html',
        controller: 'risk_factorsSingleController',
        controllerAs: 'risk_factor',
        url: '/:id/edit',
        data: {
          permissions: {
            only: ['authenticated_user'],
            redirectTo: function(rejectedPromise) {
              getGuestState();
            }        
            
          }
        }
        
      })
      .state('main.risk_factors.view', {
        controller: 'risk_factorsSingleController',
        templateUrl: 'app/risk_factors/single/single.html',
        controllerAs: 'risk_factor',
        url: '/:id'
      })
      
      /*  Measurement Types  */
      .state('main.measurement_types', {
        'abstract':true,
        templateUrl: 'app/measurement_types/main.html',
        url: '/measurement_types'
      })
      .state('main.measurement_types.list', {
        controller: 'measurement_typesController',
        controllerAs: 'measurement_types',
        templateUrl: 'app/measurement_types/list.html',
        url: ''
      })
      .state('main.measurement_types.create', {
        templateUrl: 'app/measurement_types/single/single.html',
        controller: 'measurement_typesSingleController',
        controllerAs: 'measurement_type',
        url: '/create',
        data: {
          permissions: {
            only: ['authenticated_user'],
            redirectTo: function(rejectedPromise) {
              getGuestState();
            }        
            
          }
        }
      })
      .state('main.measurement_types.edit', {
        templateUrl: 'app/measurement_types/single/single.html',
        controller: 'measurement_typesSingleController',
        controllerAs: 'measurement_type',
        url: '/:id/edit',
        data: {
          permissions: {
            only: ['authenticated_user'],
            redirectTo: function(rejectedPromise) {
              getGuestState();
            }        
            
          }
        }
        
      })
      .state('main.measurement_types.view', {
        controller: 'measurement_typesSingleController',
        templateUrl: 'app/measurement_types/single/single.html',
        controllerAs: 'measurement_type',
        url: '/:id'
      })
      
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
      })
      
      /*  Reviews  */
      .state('main.risk_reviews', {
        'abstract':true,
        templateUrl: 'app/risk_reviews/main.html',
        url: '/reviews'
      })
      .state('main.risk_reviews.list', {
        controller: 'risk_reviewsController',
        controllerAs: 'risk_reviews',
        templateUrl: 'app/risk_reviews/list.html',
        url: ''
      })
      .state('main.risk_reviews.create', {
        templateUrl: 'app/risk_reviews/single/single.html',
        controller: 'risk_reviewsSingleController',
        controllerAs: 'risk_review',
        url: '/create',
        data: {
          permissions: {
            only: ['authenticated_user'],
            redirectTo: function(rejectedPromise) {
              getGuestState();
            }        
            
          }
        }
      })
      .state('main.risk_reviews.edit', {
        templateUrl: 'app/risk_reviews/single/single.html',
        controller: 'risk_reviewsSingleController',
        controllerAs: 'risk_review',
        url: '/:id/edit',
        data: {
          permissions: {
            only: ['authenticated_user'],
            redirectTo: function(rejectedPromise) {
              getGuestState();
            }        
            
          }
        }
        
      })
      .state('main.risk_reviews.view', {
        controller: 'risk_reviewsSingleController',
        templateUrl: 'app/risk_reviews/single/single.html',
        controllerAs: 'risk_review',
        url: '/:id'
      })
      /*Error routes*/
      .state('404_error', {
        templateUrl: '404.html',
        url: '/404_error'
      })
      .state('500_API_ERROR', {
        templateUrl: '500_API.html',
        url: '/500_api_error'
      });
  }

})();
