'use strict';

angular.module('CarreEntrySystem')
	.directive('carreGraphControls',function(){
		return {
            templateUrl:'app/components/graph-controls/template.html',
            restrict: 'E',
            replace: true,
            bindToController: {
                'carreId': '@'
            },
            controllerAs:'controls',
            scope: true,
            controller:function(CONFIG){
                this.dev = CONFIG.ENV==='DEV';
                this.user = CONFIG.currentUser.username;
            }
    	}
	});


