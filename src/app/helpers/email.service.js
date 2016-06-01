angular.module('CarreEntrySystem').service('Email', function($http, CONFIG, toastr) {
  
  this.exports = {
    'example': recommendExample,
    'bug': reportBug,
    'send': sendEmail
  }
  
  function recommendExample (data) {
    var user=CONFIG.currentUser?CONFIG.currentUser.username:'guest';
    $http.post(CONFIG.CARRE_CACHE_URL+'sendemail',{
      action: 'recommend_examples',
      user:user,
      reqdata:JSON.stringify(data)
    }).then(function(data){
      toastr.success('<b>Example sent!</b>', '<h4>Thank you!</h4>');
    },function(err){
      toastr.error('<b>Example not sent</b>' + err, '<h4>Example error</h4>');
    });
  }  
    
  function reportBug (data) {
    var user=CONFIG.currentUser?CONFIG.currentUser.username:'guest';
    $http.post(CONFIG.CARRE_CACHE_URL+'sendemail',{
      action: 'report_bug',
      user:user,
      reqdata:JSON.stringify(data)
    });
  }  
    
  function sendEmail (data,action){
    var user=CONFIG.currentUser?CONFIG.currentUser.username:'guest';
    $http.post(CONFIG.CARRE_CACHE_URL+'sendemail',{
      action: action, //'recommend_examples',
      user:user,
      reqdata:JSON.stringify(data)
    }).then(function(data){
      toastr.success('<b>Message sent!</b>', '<h4>Thank you!</h4>');
    },function(err){
      toastr.error('<b>Message not sent</b>' + err, '<h4>Message error</h4>');
    });
  }
  
  
  
  
  
  return this.exports;
});