'use strict';

angular.module('CarreEntrySystem')
  .directive('carreGraphRisk', function() {
    return {
      template: '<div cg-busy="loading">'+
        '<button ng-click="startNetwork()" class="btn btn-sm btn-primary pull-right"><i class="fa fa-refresh"></i></button>'+
        '<button ng-click="removeSize()" class="btn btn-sm btn-default pull-right"><i class="fa fa-search-minus"></i></button>'+
        '<button ng-click="addSize()" class="btn btn-sm btn-default pull-right"><i class="fa fa-search-plus"></i></button>'+
        '<button ng-click="deleteSelected()" id="explore_deleteButton" style="display:none" class="btn btn-sm btn-danger pull-left">Delete</button>'+
        '<button ng-click="goToSelected()" id="explore_goButton" style="display:none" class="btn btn-sm btn-success pull-left">Open</button>'+
        '<div id="mynetwork"></div>'+
        '</div>',
      restrict: 'E',
      scope: {
        'limitNewConnections':'@',
        'height': '@',
        'riskid': '='
      },
      controller: function($scope, $timeout, toastr, CARRE, $location, CONFIG, Risk_elements,$state,SweetAlert) {
      
        var vm = $scope;
        vm.loading=false;
        //graph init configuration
        vm.limitNewConnections = $scope.limitNewConnections||4;
        vm.minConnections = 12;
        vm.height = vm.height || 600;
        vm.customHeight=0;
        var network;
        
        vm.addSize=function(){
          vm.customHeight+=100;
          network.setSize('100%',Number(vm.height)+vm.customHeight+'px');
          network.redraw();
          network.fit();
        }
        
        vm.removeSize=function(){
          if(vm.customHeight<=0) return false;
          vm.customHeight-=100;
          network.setSize('100%',Number(vm.height)+vm.customHeight+'px');
          network.redraw();
          network.fit();
        }
        
        //start the initialization
        init(vm.riskid);
        
        
        function init(id) {
          vm.loading=Risk_elements.associations(id).then(function(data){ 
            
            //set initial nodes and edges
            vm.nodesArr=id?data.nodes.map(function(obj){
                var obj_pos=-1;
                //handle colors
                if(id instanceof Array) obj_pos=id.indexOf(obj.id);
                else obj_pos=id.indexOf(obj.id.substring(obj.id.lastIndexOf("/")+1));
                if(obj_pos>=0) obj.color=CONFIG.COLORS[obj_pos];
                
                return obj;
              }):data.nodes.filter(function(obj){ return obj.value>vm.minConnections;});
              
            //filter edges
            vm.edgesArr=data.edges.filter(function(edge){
              
              
              var from=false;
              var to=false;
              for (var i=0,len=vm.nodesArr.length;i<len;i++){
                if(vm.nodesArr[i].id===edge.from) from=true;
                if(vm.nodesArr[i].id===edge.to) to=true;
              }
              return from&&to;
            });
            //init network after 50ms delay
            $timeout(function(){vm.startNetwork();},50);
            
          }); 
        }
        vm.showRiskFactor=function(id,label){
          //implement a basic confirm popup
          SweetAlert.swal({
              title: "Show the Risk factor?",
              text: "This will redirect you to the \""+label+"\" risk factor's detail page.",
              type: "info",
              showCancelButton: true,
              confirmButtonColor: "#2E8B57",
              confirmButtonText: "Yes, show me!",
              closeOnConfirm: true,
              closeOnCancel: true
            },
            function(isConfirm) {
              if (isConfirm) {
                $state.go("main.risk_factors.view",{id:id});
              }
            });
          
        };
        
        vm.showRiskElement=function(id,label){
          //implement a basic confirm popup
          SweetAlert.swal({
              title: "Show the Risk element?",
              text: "This will redirect you to the \""+label+"\" risk element's detail page.",
              type: "info",
              showCancelButton: true,
              confirmButtonColor: "#2E8B57",
              confirmButtonText: "Yes, show me!",
              closeOnConfirm: true,
              closeOnCancel: true
            },
            function(isConfirm) {
              if (isConfirm) {
                $state.go("main.risk_elements.view",{id:id});
              }
            });
          
        };
        
        /* Graph manipulations */
        vm.addNodeRelations = function (id) {
          vm.loading=Risk_elements.associations(id).then(function(data){
            var limit=vm.limitNewConnections;
            var nodes={};
            data.nodes.forEach(function(node){
              nodes[node.id]=node;
            });
            data.edges.forEach(function(edge){
              if(!vm.edges._data[edge.id]&&limit>0) {
                if(!vm.nodes._data[edge.from]) vm.nodes.add(nodes[edge.from]);
                if(!vm.nodes._data[edge.to]) vm.nodes.add(nodes[edge.to]);
                vm.edges.add(edge);
                limit--;
              }
            });
          });
        };
        
        vm.deleteSelected = function(id){
          var node=id||network.getSelectedNodes()[0];
          if(!node) return false; 
          var nodeData={
            nodes:[node],
            edges:network.getConnectedEdges(node)
          }
          vm.removeOrphan(nodeData);
        }
        
        vm.goToSelected = function(){
          var nodes=network.getSelectedNodes();
          var edges=network.getSelectedEdges();
          
          if(nodes.length===1) {
             //then it is a risk element
             var rl_id=nodes[0].substring(nodes[0].lastIndexOf("/")+1);
             var rl_label=vm.nodes._data[nodes[0]].label;
             vm.showRiskElement(rl_id,rl_label);
          } else if (edges.length===1){
            //then it is a risk factor
            var edge=vm.edges._data[edges[0]];
            var rf_id=edges[0].substring(edges[0].lastIndexOf("/")+1);
            var rf_label=vm.nodes._data[edge.from].label+" "+edge.label+" "+vm.nodes._data[edge.to].label;
            vm.showRiskFactor(rf_id,rf_label);
          } else return false;
        }
        
        vm.removeOrphan = function(data){
          data.nodes.forEach(function(node){vm.nodes.remove(node);});
          data.edges.forEach(function(edge){ vm.edges.remove(edge);});
          var nodes=Object.keys(vm.nodes._data);
          nodes.forEach(function(node){
            var edges=network.getConnectedEdges(node);
            if(edges.length<=0) {
              vm.nodes.remove(node);
            }
          });
        };
    
        /* Network Graph native configuration */
        vm.startNetwork = function() {
            vm.customHeight=0;
            vm.nodes = new vis.DataSet(vm.nodesArr);
            vm.edges = new vis.DataSet(vm.edgesArr);
    
            // create a network
            var container = document.getElementById('mynetwork');
            var data = {
                nodes: vm.nodes,
                edges: vm.edges
            };
            var options = {
              autoResize:true,
              height: vm.height+'px',
              width: '100%',
              manipulation: {
                enabled:false,
              },
              configure: {
                enabled:false
              },  
              edges:{
                smooth:{enabled:false,type:'continuous',roundness:0.4},
                arrows: 'to',
                color:'#F7464A',
                font: {
                  color: '#343434',
                  size: 14, // px
                  face: 'arial',
                  background: 'none',
                  strokeWidth: 2, // px
                  strokeColor: '#ffffff',
                  align:'middle'
                }
              },
              nodes:{
                color:{
                  border:'#aaaaaa',
                  background:'#ffffff'
                }
                
              },
              physics:{
                enabled: true,
                barnesHut: {
                  gravitationalConstant: -2000,
                  centralGravity: 0.2,
                  springLength: 200,
                  springConstant: 0.04,
                  damping: 0.09,
                  avoidOverlap: 0
                },
                forceAtlas2Based: {
                  gravitationalConstant: -50,
                  centralGravity: 0.01,
                  springConstant: 0.08,
                  springLength: 100,
                  damping: 0.4,
                  avoidOverlap: 1
                },
                maxVelocity: 50,
                minVelocity: 0.1,
                solver: 'barnesHut',
                stabilization: {
                  enabled: true,
                  iterations: 300,
                  updateInterval: 100,
                  onlyDynamicEdges: false,
                  fit: true
                },
                timestep: 0.5,
                adaptiveTimestep: true
              }
            };
            network = new vis.Network(container, data, options);
            //register events
            network.on("doubleClick", function (params) {
                if(params.nodes.length===1) vm.addNodeRelations(params.nodes[0]);
                else if(params.edges.length===1) {
                  //do something with the edge
                  var edge=vm.edges._data[params.edges[0]];
                  var rf_id=params.edges[0].substring(params.edges[0].lastIndexOf("/")+1);
                  var rf_label=vm.nodes._data[edge.from].label+" "+edge.label+" "+vm.nodes._data[edge.to].label;
                  vm.showRiskFactor(rf_id,rf_label);
                }
            });
            //left click
            network.on("click", function (params) {
              var deleteButton=angular.element('#explore_deleteButton');
              var goButton=angular.element('#explore_goButton');
              if(params.nodes.length===1) {
                deleteButton.css("display","inline"); 
                goButton.css("display","inline"); 
              } else if(params.edges.length===1) {
                goButton.css("display","inline"); 
              } else {
                goButton.css("display","none"); 
                deleteButton.css("display","none"); 
              }
            });
            //right click
            network.on("oncontext", function (params) {
              var nodeId=network.getNodeAt(params.pointer.DOM);
              if(nodeId) {
                params.event.preventDefault();
                vm.deleteSelected(nodeId);
              }
            });
        }
        //end of controller
      }
    
    };
  });
