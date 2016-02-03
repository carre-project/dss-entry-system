/* global angular */
(function() {
    'use strict';

    angular
        .module('CarreEntrySystem')
        .filter('trustAsResourceUrl', trustResourceFilter)
        .filter('propsFilter', propsFilter);


    /** @ngInject */
    function trustResourceFilter($sce) {
        return function(val) {
            return $sce.trustAsResourceUrl(val);
        };
    }


    /** @ngInject */
    function propsFilter() {
        return function(items, props) {
            var out = [];

            if (angular.isArray(items)) {
                items.forEach(function(item) {
                    var itemMatches = false;

                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        try {
                            if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                                itemMatches = true;
                                break;
                            }
                        } catch(err) {
                            console.info(item,prop,item[prop]);
                            console.error('Error',err)
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            }
            else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };
    }

})();