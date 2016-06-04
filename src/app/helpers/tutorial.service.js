angular.module('CarreEntrySystem').service('Tutorial', function($http, CONFIG, toastr,$state) {
  
  this.exports = {
    'startGuest': startGuest,
    'startUser': startUser,
    'options': defaultOptions
  }
  
  function startGuest (fn) {
    var user=CONFIG.currentUser&&CONFIG.currentUser.username?CONFIG.currentUser.username:'guest';
    fn();
  }  
    
  function startUser (data) {
    var user=CONFIG.currentUser?CONFIG.currentUser.username:'guest';
    $http.post(CONFIG.CARRE_CACHE_URL+'sendemail',{
      action: 'report_bug',
      user:user,
      reqdata:JSON.stringify(data)
    });
  }  
  
    
    
    
    
  function defaultOptions(){
    return {
        steps:[
          {
              element: '#intro-risk-model',
              intro: "Here you can see the CARRE risk model overview",      
              position: 'right'
          }
          ,{
              element: '#intro-stats',
              intro: "This chart represents all the current CARRE elements in the database",
              position: 'left'
          }  ,{
              element: '#intro-box-risk-factors',
              intro: "This box is a counter for all the CARRE risk factors",
              position: 'top'
          },{
              element: '#intro-box-risk-evidences',
              intro: "This box is a counter for all the CARRE risk evidences",
              position: 'top'
          }
          // ,{
          //     element: '#intro-menu',
          //     intro: "This is the menu......",
          //     position: 'right'
          // }
          // ,{
          //     element: '#intro-login',
          //     intro: "Login to start editing the data",
          //     position: 'bottom'
          // }
          ],        
            showStepNumbers: false,
                showBullets: false,
                exitOnOverlayClick: true,
                exitOnEsc:true,
                nextLabel: '<strong>Next</strong>',
                prevLabel: '<strong>Previous</strong>',
                skipLabel: 'Exit',
                doneLabel: 'OK that\'s enough!'
        };

  }
  
  
  
  
  return this.exports;
});