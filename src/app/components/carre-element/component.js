'use strict';

angular.module('CarreEntrySystem')
  .directive('carreElement', function(CONFIG) {
    return {
      templateUrl: 'app/components/carre-element/template.html',
      restrict: 'E',
      replace: true,
      controllerAs:'element',
      bindToController: {
        'type': '@',
        'mode': '@',
        'elemId': '@',
        'notFields': '@'
      },
      scope: true,
      controller: function($rootScope, $scope, $state, $stateParams, content, CONFIG, VisibleFields, Observables, Risk_elements, Risk_factors, Measurement_types, Citations, Medical_experts, Risk_evidences) {
        
        var vm = this;
        vm.current = {};
        vm.notFields = vm.notFields || '';
        if(vm.elemId) {
          //init
          renderElement(vm.type,vm.elemId);
          
          //setup watcher
          // WATCHER delete before restart;
          if($rootScope.elementViewerWatcher) $rootScope.elementViewerWatcher();
          $rootScope.elementViewerWatcher=$scope.$watch(angular.bind(this, function () { return this.elemId; }),
            function(newId,oldId){ if(newId && newId.length>=2 && newId !== oldId) { renderElement(vm.type,newId);  }
          });
          
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
              // code
              break;
            case 'citation':
              // code
              break;
            case 'measurement_type':
              // code
              break;
            case 'medical_expert':
              // code
              break;
            
            default:
              // code
          }
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
