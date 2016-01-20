'use strict';

angular.module('CarreEntrySystem')

.directive('leEditor', ['$compile','Bioportal','$http','Measurement_types', function ($compile,Bioportal,$http,Measurement_types) {
    return {
        restrict: 'E',
        scope: {
            group: '=',
            observables: '='
        },
        templateUrl: 'app/components/le_editor/le_editor.html',
        compile: function (element, attrs) {
            var content, directive;
            content = element.contents().remove();
            return function (scope, element, attrs) {
                scope.operators = [
                    { name: 'AND' },
                    // { name: 'AND NOT' },
                    { name: 'OR' }
                    // { name: 'OR NOT' }
                ];

                scope.field = {};

                scope.conditions = [
                    { name: '=',value:'=' },
                    // { name: '≠',value:'!=' },
                    // { name: '~',value:'&asymp;'},
                    { name: '<',value:'<' },
                    { name: '≤',value:'<=' },
                    { name: '>',value:'>' },
                    { name: '≥',value:'>=' }
                ];

                scope.getMeasurementType = function (item,model,rule) {
                  console.log(item,model)
                  var me_id = item.metype_id.substring(item.metype_id.indexOf('ME_'));
                  console.log(me_id);
                  Measurement_types.get([me_id]).then(function(res){
                      console.log(res);
                      rule.datatype=res.data[0].has_datatype_label;
                      rule.unit=res.data[0].has_label_label;
                      rule.unit_label=res.data[0].has_measurement_type_name_label;
                      rule.dataoptions=res.data[0].has_enumeration_values_label.split(';').map(function(me){return {value:me,name:me}});
                      console.log(rule.dataoptions);
                  })
                };
                
                scope.addCondition = function () {
                    scope.group.rules.push({
                        condition: '=',
                        field: {
                            selected:{label:''}
                        },
                        data: ''
                    });
                };

                scope.removeCondition = function (index) {
                    scope.group.rules.splice(index, 1);
                };

                scope.addGroup = function () {
                    scope.group.rules.push({
                        group: {
                            operator: 'AND',
                            rules: []
                        }
                    });
                };

                scope.removeGroup = function () {
                    "group" in scope.$parent && scope.$parent.group.rules.splice(scope.$parent.$index, 1);
                };

                directive || (directive = $compile(content));

                element.append(directive(scope, function ($compile) {
                    return $compile;
                }));
            }
        }

                    
                }
}]);


