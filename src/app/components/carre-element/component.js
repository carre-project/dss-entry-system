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
      controller: function($rootScope, $state, $scope, $timeout, content, CONFIG, VisibleFields, Calculated_observables, Risk_alerts, DSS_messages,Measurement_types) {
        
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
          console.log("Element ID: ",id);
          console.log("Element sub: ", id.substring(0,2));
          
          //setup type
          switch (type) {
            case 'risk_alert':
              if(id.substring(0,2)!=="RA") $state.go("404_error");
              else getRisk_alert(id);
              break;
            case 'dss_message':
              if(id.substring(0,2)!=="DM") $state.go("404_error");
              else getDSS_message(id);
              break;
            case 'calculated_observable':
              if(id.substring(0,2)!=="CO") $state.go("404_error");
              else getCalculated_observable(id);
              break;
            case 'measurement_type':
              if(id.substring(0,2)!=="ME") $state.go("404_error");
              else getMeasurement_type(id);
              break;
            case 'medical_expert':
              // code
              break;
            
            default:
            console.log("Type not found :", type);
            $state.go("404_error");
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
            vm.rdf_source = rdfSource(vm.current.id);
          
        }
        
        
        // =========== Fetching functions for each element ==========
        
        function getRisk_alert(id) {
          var visibleFields=VisibleFields('risk_alert','single',vm.notFields.split(','));
          vm.loading=Risk_alerts.get([id]).then(function(res) {
            if (res.data) {
              vm.current = res.data[0];
              vm.fields = visibleFields.map(function(field) {
                return {
                  value: field,
                  label: content.labelOf(field)
                };
              });
              vm.rdf_source = rdfSource(vm.current.id);
          
            }
          });
        }        
        function getDSS_message(id) {
          var visibleFields=VisibleFields('dss_message','single',vm.notFields.split(','));
          vm.loading=DSS_messages.get([id]).then(function(res) {
            if (res.data) {
              vm.current = res.data[0];
              vm.fields = visibleFields.map(function(field) {
                return {
                  value: field,
                  label: content.labelOf(field)
                };
              });
              vm.rdf_source = rdfSource(vm.current.id);
          
            }
          });
        }        
        function getCalculated_observable(id) {
          var visibleFields=VisibleFields('calculated_observable','single',vm.notFields.split(','));
          vm.loading=Calculated_observables.get([id]).then(function(res) {
            if (res.data) {
              vm.current = res.data[0];
              vm.fields = visibleFields.map(function(field) {
                return {
                  value: field,
                  label: content.labelOf(field)
                };
              });
              vm.rdf_source = rdfSource(vm.current.id);
          
            }
          });
        }        
        // function getRisk_element(id) {
        //   var visibleFields=VisibleFields('risk_element','single',vm.notFields.split(','));
        //   vm.loading=Risk_elements.get([id]).then(function(res) {
        //     if (res.data) {
        //       vm.current = res.data[0];
        //       vm.fields = visibleFields.map(function(field) {
        //         return {
        //           value: field,
        //           label: content.labelOf(field)
        //         };
        //       });
        //       vm.rdf_source = rdfSource(vm.current.id);
          
        //     }
        //   });
        // }
        // function getRisk_factor(id) {
        //   var visibleFields=VisibleFields('risk_factor','single',vm.notFields.split(','));
        //   vm.loading=Risk_factors.get([id]).then(function(res) {
        //     if (res.data) {
        //       vm.current = res.data[0];
        //       vm.fields = visibleFields.map(function(field) {
        //         return {
        //           value: field,
        //           label: content.labelOf(field)
        //         };
        //       });
        //       vm.rdf_source = rdfSource(vm.current.id);
          
        //     }
        //   });
        // }
        // function getRisk_evidence(id) {
        //   var visibleFields=VisibleFields('risk_alert','single',vm.notFields.split(','));
        //   vm.loading=Risk_evidences.get([id]).then(function(res) {
        //     if (res.data) {
        //       vm.current = res.data[0];
        //       vm.current.pubmedId = $scope.hidePubmed?false:res.data[0].has_risk_alert_source_label;
        //       vm.fields = visibleFields.map(function(field) {
        //         return {
        //           value: field,
        //           label: content.labelOf(field)
        //         };
        //       });
        //       vm.rdf_source = rdfSource(vm.current.id);
          
        //     } else {
        //     console.log("No risk_alert with id:",id); 
        //     }
        //   });
        // }
        // function getCitation(id) {
        //   var visibleFields=VisibleFields('citation','single',vm.notFields.split(','));
        //   vm.loading=Citations.get([id]).then(function(res) {
        //     if (res.data) {
        //       vm.current = res.data[0];
        //       vm.current.pubmedId = $scope.hidePubmed?false:res.data[0].has_citation_pubmed_identifier_label;
        //       vm.fields = visibleFields.map(function(field) {
        //         return {
        //           value: field,
        //           label: content.labelOf(field)
        //         };
        //       });
        //       vm.rdf_source = rdfSource(vm.current.id);
          
        //     }
        //   });
        // }
        // function getObservable(id) {
        //   var visibleFields=VisibleFields('observable','single',vm.notFields.split(','));
        //   vm.loading=Calculated_observables.get([id]).then(function(res) {
        //     if (res.data) {
        //       vm.current = res.data[0];
        //       vm.fields = visibleFields.map(function(field) {
        //         return {
        //           value: field,
        //           label: content.labelOf(field)
        //         };
        //       });
        //       vm.rdf_source = rdfSource(vm.current.id);
          
        //     }
        //   });
        // }
        
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
              
              vm.rdf_source = rdfSource(vm.current.id);
          
            }
          });
        }
        
        function rdfSource(id){
          return "http://"+CONFIG.CARRE_API_URL.substring(CONFIG.CARRE_API_URL.indexOf("://")+3,CONFIG.CARRE_API_URL.indexOf("/ws"))+"/sparql?query=DESCRIBE <"+id+">&format=text/plain";
        }
        
      }
    };
  });
