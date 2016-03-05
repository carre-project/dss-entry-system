'use strict';

angular.module('CarreEntrySystem')
  .directive('carreGraphRisk', function() {
    return {
      template: '<div>'+
        '<button ng-click="startNetwork()" class="btn btn-primary">Reload</button>'+
        '<button ng-click="addSize()" class="btn btn-primary">Size +</button>'+
        '<button ng-click="removeSize()" class="btn btn-primary">Size -</button>'+
        '<div id="mynetwork"></div>'+
        '</div>',
      restrict: 'E',
      replace: true,
      scope: {
        'limitNewConnections':'@',
        'height': '@',
        'id': '='
      },
      controller: function($scope, $timeout, toastr, CARRE, $location, CONFIG, Risk_elements,$state,SweetAlert) {
      
        var vm = $scope;
        vm.height = vm.height || 600;
        //graph init configuration
        vm.limitNewConnections = $scope.limitNewConnections||4;
        vm.minConnections = 12;
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
        init(vm.id);
        
        
        function init(id) {
          Risk_elements.associations(id).then(function(data){ 
            //set initial nodes and edges
            vm.nodesArr=id?data.nodes:data.nodes.filter(function(obj){ return obj.value>vm.minConnections; });
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
            
            console.log(vm.minConnections,vm.nodesArr,vm.edgesArr);
            
            //init network after 50ms delay
            $timeout(function(){ 
              vm.startNetwork(); 
            },50);
            
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
        
        /* Graph manipulations */
        vm.addNodeRelations = function (id) {
          Risk_elements.associations(id).then(function(data){
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
        
        
        vm.removeOrphan = function(data){
          data.nodes.forEach(function(node){vm.nodes.remove(node);});
          var nodes=Object.keys(vm.nodes._data);
          data.edges.forEach(function(edge){
            // var edgeData=vm.edges._data[edge];
            // if(nodes.indexOf(edgeData.from)===-1) nodes.push(edgeData.from);
            // if(nodes.indexOf(edgeData.to)===-1) nodes.push(edgeData.to);
            vm.edges.remove(edge);
          });
          
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
                enabled:true,
                initiallyActive:true,
                addNode: false,
                addEdge: false,
                editNode:false,
                editEdge:false,
                deleteEdge: false,
                deleteNode: function(nodeData,callback) {
                  vm.removeOrphan(nodeData);
                  callback(nodeData);
                }
              },
              configure: {
                enabled:false
              },  
              edges:{
                arrows: 'to',
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
              nodes:{},
              physics:{
                enabled: true,
                barnesHut: {
                  gravitationalConstant: -2000,
                  centralGravity: 0.3,
                  springLength: 295,
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
                  avoidOverlap: 0
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
        }
        //end of controller
      }
    
    };
  });
