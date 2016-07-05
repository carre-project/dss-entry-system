/* global angular */
(function() {
    'use strict';

    angular
        .module('CarreEntrySystem')
        .filter('trustAsResourceUrl', trustResourceFilter)
        .filter('hideSelected', hideSelected)
        .filter('sliceLast', sliceLast)
        .filter('prettySigns', prettySigns)
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
    function sliceLast() {
        return function(item, char) {
            if(!item||item.length<=0||!char||char.length<=0) return ''; 
            return item.substring(item.lastIndexOf(char)+1);
        };
    }
    /** @ngInject */
    function prettySigns() {
        return function(val) {
            if(!val||val.length<=0) return ''; 
            else return val.replace(new RegExp(">=", 'g'), '≥').replace(new RegExp("<=", 'g'), '≤')
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