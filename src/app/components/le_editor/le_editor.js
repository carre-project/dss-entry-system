'use strict';

angular.module('CarreEntrySystem')

.directive('leEditor', ['$compile','Bioportal','$http','CARRE', function ($compile,Bioportal,$http,CARRE) {
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
                    { name: '≠',value:'!=' },
                    { name: '~',value:'&asymp;'},
                    { name: '<',value:'<' },
                    { name: '≤',value:'<=' },
                    { name: '>',value:'>' },
                    { name: '≥',value:'>=' }
                ];

                
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


