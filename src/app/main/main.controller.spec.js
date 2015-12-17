(function() {
  'use strict';

  describe('controllers', function(){
    var vm;
    var $timeout;
    var toastr;

    beforeEach(module('CarreEntrySystem'));
    beforeEach(module('ui.router'));
    // beforeEach(inject(function(_$controller_, _$timeout_,_$rootScope_,_toastr_,_$location_, _CONFIG_) {

    //   vm = _$controller_('MainController');
    //   $timeout = _$timeout_;
    //   vm.config=_CONFIG_;
    // }));

    it('dummy test', function() {
      expect(1 > 0).toBeTruthy();
    });
    
  });
})();