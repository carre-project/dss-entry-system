'use strict';

angular.module('CarreEntrySystem')
  .directive('carreElement', function(CONFIG) {
    return {
      templateUrl: 'app/components/carre-element/template.html',
      restrict: 'E',
      replace: true,
      scope:{
        'type': '@',
        'mode': '@',
        'elemId': '@',
        'elem': '=',
        'notFields': '@',
        'hidePubmed': '@'
      },
      controller: function($rootScope, $scope, $timeout, content, CONFIG, VisibleFields, Observables, Risk_reviews, Risk_elements, Risk_factors, Measurement_types, Citations, Medical_experts, Risk_evidences) {
        
        var vm = $scope;
        vm.current = vm.elem || {};
          
        vm.notFields = vm.notFields || '';
        if(vm.elemId) {
          //init
          renderElement(vm.type,vm.elemId);
          
          //setup watcher
          // WATCHER delete before restart;
          if($rootScope.elementViewerWatcher) $rootScope.elementViewerWatcher();
          $rootScope.elementViewerWatcher=$scope.$watch('elemId',
            function(newId,oldId){ if(newId && newId.length>=2 && newId !== oldId) { renderElement(vm.type,newId);  }
          });
          
        } else if(vm.type&&vm.elem) {
            renderTempElement(vm.type,vm.elem);
        }
        
        // =========MAIN function==============
        
        function renderElement(type,id) {
          type = type || content.typeFromId(id).raw;
          vm.type=type;
          //setup type
          switch (type) {
            case 'risk_element':
              getRisk_element(id);
              break;
            case 'risk_factor':
              getRisk_factor(id);
              break;
            case 'risk_evidence':
              getRisk_evidence(id);
              break;
            case 'observable':
              getObservable(id);
              break;
            case 'citation':
              getCitation(id);
              break;
            case 'measurement_type':
              getMeasurement_type(id);
              break;
            case 'risk_review':
              getReview(id);
              break;
            case 'medical_expert':
              // code
              break;
            
            default:
              // code
          }
        }
        
        
        // =========== Fetching functions for each element ==========
        
        function renderTempElement(type,data) {
          var visibleFields=VisibleFields(type,'single',vm.notFields.split(','));
            vm.current = data;
            vm.fields = visibleFields.map(function(field) {
              return {
                value: field,
                label: content.labelOf(field)
              };
            });
        }
        
        
        // =========== Fetching functions for each element ==========
        
        function getRisk_element(id) {
          var visibleFields=VisibleFields('risk_element','single',vm.notFields.split(','));
          vm.loading=Risk_elements.get([id]).then(function(res) {
            if (res.data) {
              vm.current = res.data[0];
              vm.fields = visibleFields.map(function(field) {
                return {
                  value: field,
                  label: content.labelOf(field)
                };
              });
            }
          });
        }
        function getRisk_factor(id) {
          var visibleFields=VisibleFields('risk_factor','single',vm.notFields.split(','));
          vm.loading=Risk_factors.get([id]).then(function(res) {
            if (res.data) {
              vm.current = res.data[0];
              vm.fields = visibleFields.map(function(field) {
                return {
                  value: field,
                  label: content.labelOf(field)
                };
              });
            }
          });
        }
        function getRisk_evidence(id) {
          var visibleFields=VisibleFields('risk_evidence','single',vm.notFields.split(','));
          vm.loading=Risk_evidences.get([id]).then(function(res) {
            if (res.data) {
              vm.current = res.data[0];
              vm.current.pubmedId = $scope.hidePubmed?false:res.data[0].has_risk_evidence_source_label;
              vm.fields = visibleFields.map(function(field) {
                return {
                  value: field,
                  label: content.labelOf(field)
                };
              });
            }
          });
        }
        function getCitation(id) {
          var visibleFields=VisibleFields('citation','single',vm.notFields.split(','));
          vm.loading=Citations.get([id]).then(function(res) {
            if (res.data) {
              vm.current = res.data[0];
              vm.current.pubmedId = $scope.hidePubmed?false:res.data[0].has_citation_pubmed_identifier_label;
              vm.fields = visibleFields.map(function(field) {
                return {
                  value: field,
                  label: content.labelOf(field)
                };
              });
            }
          });
        }
        function getObservable(id) {
          var visibleFields=VisibleFields('observable','single',vm.notFields.split(','));
          vm.loading=Observables.get([id]).then(function(res) {
            if (res.data) {
              vm.current = res.data[0];
              vm.fields = visibleFields.map(function(field) {
                return {
                  value: field,
                  label: content.labelOf(field)
                };
              });
            }
          });
        }
        function getReview(id) {
          var visibleFields=VisibleFields('risk_review','single',vm.notFields.split(','));
          vm.loading=Risk_reviews.get([id]).then(function(res) {
            if (res.data) {
              vm.current = res.data[0];
              vm.fields = visibleFields.map(function(field) {
                return {
                  value: field,
                  label: content.labelOf(field)
                };
              });
            }
          });
        }
        function getMeasurement_type(id) {
          var visibleFields=VisibleFields('measurement_type','single',vm.notFields.split(','));
          vm.loading=Measurement_types.get([id]).then(function(res) {
            if (res.data) {
              vm.current = res.data[0];
              vm.fields = visibleFields.map(function(field) {
                return {
                  value: field,
                  label: content.labelOf(field)
                };
              });
            }
          });
        }
        
      }
    };
  });
