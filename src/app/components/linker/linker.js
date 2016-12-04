'use strict';

angular.module('CarreEntrySystem')
  .directive('carreLinker', function(CONFIG) {
    return {
      templateUrl: 'app/components/linker/linker.html',
      restrict: 'E',
      replace: true,
      scope: {
        'property': '@',
        'model': '='
      },
      controller: function($scope, CONFIG, Medical_experts) {
        
        $scope.show = 'label';
        $scope.items = [];
        var label_arr = [];
        var avoidExpressions = ['has_risk_alert_condition'];
        var arr = $scope.model[$scope.property];
        $scope.label = $scope.model[$scope.property + '_label'];
        
        //handle medical experts
        if ($scope.property === 'has_author' || $scope.property === 'has_reviewer') {
            Medical_experts.get().then(function(res) {
              var USERS={}
              res.data.forEach(function(user){
                USERS[user.has_graph_uri_label]=user;
              });
              
              label_arr = $scope.model[$scope.property + '_label_arr'];
              $scope.show = 'links';
              label_arr.forEach(function(username){
                var user = USERS[username];
                  $scope.items.push({
                    link: (CONFIG.ENV === 'PROD' ? '' : '#/') + "medical_experts/" + user.id_label,
                    label: user.has_firstname_label+' '+user.has_lastname_label
                  });
              })
            });
        } else //handle condition
            if ($scope.property === 'has_risk_alert_condition') {
          $scope.show='condition';
          
          $scope.model['has_risk_alert_calculated_observable'].forEach(function(obj,index){
            var id=obj.substr(obj.lastIndexOf('/')+1);
            var link=(CONFIG.ENV === 'PROD' ? '' : '#/') + 'calculated_observables/' + id;
            var label=$scope.model['has_risk_alert_calculated_observable_label_arr'][index];
            //construct <a> tag
            var atag="<a href="+link+">"+label+"</a>";
            //replace all OB_* in the expression
            $scope.label=$scope.label.replace(new RegExp(id, 'g'), atag)
            .replace(new RegExp(">=", 'g'), '&ge;').replace(new RegExp("<=", 'g'), '&le;'); //replace greater than and lower than symbols
          });
          
        }  else //handle external annotations
            if ($scope.property === 'has_external_type' || $scope.property === 'has_external_unit'|| $scope.property === 'has_external_predicate')  {
                $scope.show='external_link';
                $scope.external_link = "<a target='_blank' href='"+$scope.model[$scope.property]+"'>"+$scope.model[$scope.property+'_label']+"</a>";
        }
        else {
          // handle links
          if (arr instanceof Array && avoidExpressions.indexOf($scope.property) === -1) {
              
            label_arr = $scope.model[$scope.property + '_label_arr'];

            arr.forEach(function(str, index) {
              var id = str.substr(str.lastIndexOf('/') + 1);
              var cat = id.substr(0, 2);
              var type = false;
              switch (cat) {
                case 'CO':
                  // make label for observables
                  type = 'calculated_observables/';
                  break;
                case 'M.':
                  // make label for risk element
                  type = 'dss_messages/';
                  break;
                case 'RA':
                  // make label for risk evidence
                  type = 'risk_alerts/';
                  break;
                default:
              }
              if (type) {
                $scope.show = 'links';
                $scope.items.push({
                  link: (CONFIG.ENV === 'PROD' ? '' : '#/') + type + id,
                  label: label_arr[index]
                });
              }

            });
          }
        }
        //debug
        // console.log('Label:',$scope.label,($scope.showlink?'link':'text'));
      }
    };
  });
