/* global angular */
(function() {
    'use strict';

    angular
        .module('CarreEntrySystem')
        .filter('trustAsResourceUrl', trustResourceFilter)
        .filter('hideSelected', hideSelected)
        .filter('propsFilter', propsFilter)
        .filter('exclude', excludeItems);


    /** @ngInject */
    function trustResourceFilter($sce) {
        return function(val) {
            return $sce.trustAsResourceUrl(val);
        };
    }

    /** @ngInject */
    function hideSelected() {
        return function(item, selectedItems) {
            if(selectedItems.length===0) return false; 
            selectedItems.forEach(function(obj){
                if(item.value===obj) return true;
            });
            return false;
        };
    }


    /** @ngInject */
    function excludeItems() {
        return function(items, selectedItems) {
            var out=[];
            if(selectedItems.length===0) return items; 
            //you want to remove the selected items from items
            items.forEach(function(item){
                if(selectedItems.indexOf(item.value)===-1) out.push(item);
            });
            return out;
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