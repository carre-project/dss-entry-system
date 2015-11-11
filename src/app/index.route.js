(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {


    $stateProvider
      .state('main', {
        abstract: true,
        controller: 'MainController',
        controllerAs: 'main',
        templateUrl: 'app/main/main.html',
        resolve: {
          'currentUser': function(Auth) {
            return Auth.getUser();
          },
          'citationsArray': function(CARRE) {
            return CARRE.instances('citation');
          },
          'risk_elementsArray': function(CARRE) {
            return CARRE.instances('risk_element');
          },
          'risk_factorsArray': function(CARRE) {
            return CARRE.instances('risk_factor');
          },
          'risk_evidencesArray': function(CARRE) {
            return CARRE.instances('risk_evidence');
          },
          'observablesArray': function(CARRE) {
            return CARRE.instances('observable');
          }
        }
      })
      .state('main.dashboard', {
        url: '/',
        templateUrl: 'app/main/dashboard.html',
      })
      .state('main.citations', {
        controller: 'citationsController',
        controllerAs: 'citations',
        templateUrl: 'app/citations/list.html',
        url: '/citations',
        resolve: {
          'citations': function(citationsArray) {
            
            //check and reload state if the data is not the correct type ----- dont know why is happening -- api fault
            if (citationsArray.data.some(function(obj) {
                return obj.type.indexOf('http://carre.kmi.open.ac.uk/ontology/risk.owl#citation') === -1;
              })) {
              console.log('TELL ALLAN about this! It confused and instead of citation returned this: ', citationsArray.data[0].type[0]);
              $state.reload();
            }
            else {
              return citationsArray.data.map(function(obj) {
                //console.info('Citations:',citationsArray);
                /* Citations template
                has_author: Array[2]
                has_citation_pubmed_identifier: Array[1]
                has_citation_source_level: Array[2]
                has_citation_source_type: Array[2]
                has_reviewer: Array[2]
                id: "http://carre.kmi.open.ac.uk/citations/23271790"
                type: Array[1]
                */

                //make label like this
                // val.substring(val.lastIndexOf('/')+1));
                return {
                  has_author: obj.has_author ? obj.has_author[0] : '',
                  has_author_label: obj.has_author ? obj.has_author[0].substring(obj.has_author[0].lastIndexOf('/') + 1) : '',
                  has_reviewer: obj.has_reviewer ? obj.has_reviewer.join(',') : '',
                  id: obj.has_citation_pubmed_identifier ? obj.has_citation_pubmed_identifier[0] : obj.id,
                  has_citation_source_type: obj.has_citation_source_type ? obj.has_citation_source_type[0] : '',
                  has_citation_source_level: obj.has_citation_source_level ? obj.has_citation_source_level[0] : '',
                };
              });
            }

          }
        }
      })
      .state('main.observables', {
        controller: 'observablesController',
        controllerAs: 'observables',
        templateUrl: 'app/observables/list.html',
        url: '/observables'
      })
      .state('main.risk_evidences', {
        controller: 'risk_evidencesController',
        controllerAs: 'risk_evidences',
        templateUrl: 'app/risk_evidences/list.html',
        url: '/risk_evidences'
      })
      .state('main.risk_elements', {
        controller: 'risk_elementsController',
        controllerAs: 'risk_elements',
        templateUrl: 'app/risk_elements/list.html',
        url: '/risk_elements'
      })
      .state('main.risk_factors', {
        controller: 'risk_factorsController',
        controllerAs: 'risk_factors',
        templateUrl: 'app/risk_factors/list.html',
        url: '/risk_factors'
      })
      // .state('main.observables', {
      //   controller: 'observablesController',
      //   controllerAs: 'observables',
      //   templateUrl: 'app/observables/listobservables.html',
      //   url: '/observables',
      //   resolve: {
      //     observablesList: function(CARRE){
      //         return CARRE.instances('observable');
      //     }
      //   }
      // })
      // .state('main.citations', {
      //   controller: 'CitationsController',
      //   controllerAs: 'citations',
      //   templateUrl: 'app/citations/listcitations.html',
      //   url: '/citations',
      //   resolve: {
      //     CitationsList: function(CARRE){
      //         return CARRE.instances('citation');
      //     }
      //   }
      // })
      // .state('main.citations', {
      //   controller: 'CitationsController',
      //   controllerAs: 'citations',
      //   templateUrl: 'app/citations/listcitations.html',
      //   url: '/citations',
      //   resolve: {
      //     CitationsList: function(CARRE){
      //         return CARRE.instances('citation');
      //     }
      //   }
      // })
      // .state('main.citations', {
      //   controller: 'CitationsController',
      //   controllerAs: 'citations',
      //   templateUrl: 'app/citations/listcitations.html',
      //   url: '/citations',
      //   resolve: {
      //     CitationsList: function(CARRE){
      //         return CARRE.instances('citation');
      //     }
      //   }
      // })
      .state('500_error', {
        templateUrl: '500.html',
        url: '/500_error'
      })
      .state('404_error', {
        templateUrl: '404.html',
        url: '/404_error'
      });
  }

})();
