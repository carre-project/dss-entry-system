(function() {
    'use strict';

    angular
        .module('CarreEntrySystem')
        .run(runBlock)
        .run(setPermissionValidator);

    /** @ngInject */
    function setPermissionValidator(Permission, Auth, $q) {
        // Define anonymous role
        console.log('Role Definition called!');
        Permission.defineRole('authenticated_user', function(stateParams) {
            return Auth.isLoggedIn();
        });
    }

    /** @ngInject */
    function runBlock($rootScope,$state) {

        //handle ui-router errors
        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            // this is required if you want to prevent the $UrlRouter reverting the URL to the previous valid location
            event.preventDefault();
            console.error('Ui Router error:', event, toState, toParams, fromState, fromParams, error);
            console.log(error);
            // $state.go(toState.name,toParams.id);
        });

        window.hexToRgb = function(hex) {
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                return r + r + g + g + b + b;
            });

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }

    }

})();


/*JQUERY MetisMenu - external library for sidebar rendering */

$(function() {

    $('#side-menu').metisMenu();

});

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function() {
    $(window).bind("load resize", function() {
        topOffset = 50;
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        }
        else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var url = window.location;
    var element = $('ul.nav a').filter(function() {
        return this.href == url || url.href.indexOf(this.href) == 0;
    }).addClass('active').parent().parent().addClass('in').parent();
    if (element.is('li')) {
        element.addClass('active');
    }
});
