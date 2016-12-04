'use strict';

angular.module('CarreEntrySystem')

.directive('leEditor', ['$compile','$timeout','$q', function($compile,$timeout,$q) {
    return {
        restrict: 'E',
        scope: {
            group: '=',
            calculated_observables: '=',
            metypes: '='
        },
        templateUrl: 'app/components/le_editor/le_editor.html',
        compile: function(element, attrs) {
            var content, directive;
            content = element.contents().remove();
            return function(scope, element, attrs) {
                scope.operators = [{
                        name: 'AND'
                    },
                    // { name: 'AND NOT' },
                    {
                        name: 'OR'
                    }
                    // { name: 'OR NOT' }
                ];

                scope.field = {};

                scope.conditions = [
                    {
                        name: '=',  value: '=', types:'integer,float,enum,boolean'
                    },
                    {
                        name: '<',  value: '<', types:'integer,float'
                    }, 
                    {
                        name: '≤',  value: '<=', types:'integer,float'
                    }, 
                    {
                        name: '>',  value: '>', types:'integer,float'
                    }, 
                    {
                        name: '≥',  value: '>=', types:'integer,float'
                    }
                ];

                scope.getMeasurementType = function(item, model, rule) {
                    rule.hiddenData=true;
                    $timeout(function() { 
                        
                        var me_id = '';
                        if (!item) {
                            for (var i = 0; i < scope.calculated_observables.length; i++) {
                                if (scope.calculated_observables[i].value === model) {
                                    console.log(scope.calculated_observables[i])
                                    me_id = scope.calculated_observables[i].metype_id;
                                    break;
                                }
                            }
                            me_id = me_id.substring(me_id.indexOf('ME_'));
                            console.log('Get measurement type called!',me_id);
                        }
                        else {
                            me_id = item.metype_id;
                            me_id = me_id.substring(me_id.indexOf('ME_'));
                            console.log('Get measurement type called!',me_id);
                        }
                            
                        for (var i = 0; i < scope.metypes.length; i++) {
                            if (scope.metypes[i].id_label === me_id) {
                                //do stuff
                                rule.datatype = scope.metypes[i].has_datatype_label;
                                rule.unit = scope.metypes[i].has_label_label;
                                rule.unit_label = scope.metypes[i].has_measurement_type_name_label;
                                if (scope.metypes[i].has_enumeration_values_label) rule.dataoptions = scope.metypes[i].has_enumeration_values_label.split(';').map(function(obj) {
                                    return {
                                        value: obj,
                                        name: obj
                                    }
                                });
                                break;
                            }
                        }
                        
                        //make it like loading
                        $timeout(function(){rule.hiddenData=!rule.hiddenData;},400);
                        
                    }, 500);

                };

                scope.addCondition = function() {
                    scope.group.rules.push({
                        condition: '=',
                        field: {
                            selected: {
                                label: ''
                            }
                        },
                        data: ''
                    });
                };

                scope.removeCondition = function(index) {
                    scope.group.rules.splice(index, 1);
                };

                scope.addGroup = function() {
                    scope.group.rules.push({
                        group: {
                            operator: 'AND',
                            rules: []
                        }
                    });
                };

                scope.removeGroup = function() {
                    "group" in scope.$parent && scope.$parent.group.rules.splice(scope.$parent.$index, 1);
                };

                directive || (directive = $compile(content));

                element.append(directive(scope, function($compile) {
                    return $compile;
                }));
            }
        }


    }
}]);
