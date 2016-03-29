'use strict';

angular.module('CarreEntrySystem')
  .directive('carreGraphRisk', function() {
    return {
      templateUrl: 'app/components/graph-network-vis/template.html',
      restrict: 'E',
      scope: {
        'limitNewConnections':'@',
        'height': '@',
        'riskid': '='
      },
      controller: function($scope, $timeout, toastr, $location, CONFIG, GRAPH ,content,$q) {
      
        var vm = $scope;
        vm.loading=false;
        vm.onlyCore=false;
        //graph init configuration
        vm.limitNewConnections = $scope.limitNewConnections||4;
        vm.minConnections = 10;
        vm.height = vm.height || 600;
        vm.customHeight=0;
        var network;
        vm.options = {
          showRiskEvidences:false,
          onlyCore: false
        }
        
      
        vm.toggleOnlyCore=function(){
            $timeout(function(){
              vm.options.onlyCore = !vm.options.onlyCore;
              vm.init(vm.riskid); 
            },0);
        };
        
        vm.toggleRiskEvidences=function(){
            $timeout(function(){
              vm.options.showRiskEvidences = !vm.options.showRiskEvidences;
              vm.init(vm.riskid); 
            },0);
        };
        
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
        
        
        
        vm.init=function(id) {
          
          
          //check if loading promise exists and act accordingly
          $timeout(function(){vm.loading=$q.defer();},0);
          
          GRAPH.network(id,!vm.options.showRiskEvidences?'risk_factor':null).then(function(data){ 
            
            //set initial nodes and edges
            vm.nodesArr=id?data.nodes.map(function(obj){
                var obj_pos=-1;
                //handle colors
                if(id instanceof Array) obj_pos=id.indexOf(obj.id);
                else obj_pos=id.substring(id.lastIndexOf("/")+1)===obj.id.substring(obj.id.lastIndexOf("/")+1)?0:-1;
                if(obj_pos>=0) obj.color=CONFIG.COLORS[obj_pos];
                return obj;
              }):data.nodes.filter(function(obj){ return obj.connections>vm.minConnections;});
              
            //filter edges
            vm.edgesArr=data.edges.filter(function(edge){
              var from=false;
              var to=false;
              for (var i=0,len=vm.nodesArr.length;i<len;i++){
                if(vm.nodesArr[i].id===edge.from) from=true;
                if(vm.nodesArr[i].id===edge.to) to=true;
              }
              return from&&to;
            }).map(function(edge){
              var pos=(id instanceof Array)?id.indexOf(edge.from):null;
              edge.color = pos>=0?CONFIG.COLORS[pos]:"#aaaaaa";
              return edge;
            });
            
            //init network after 50ms delay
            $timeout(function(){
              if(vm.options.onlyCore && vm.riskid instanceof Array && vm.riskid.length>1) {
                  var nodeIds=[];
                  vm.startNetwork({
                    nodes:vm.nodesArr.filter(function(node){
                    if(network.getConnectedEdges(node.id).length>1 || node.color ){
                      if(nodeIds.indexOf(node.id)===-1) nodeIds.push(node.id);
                      return true;
                    } else return false;
                  }),
                    edges:vm.edgesArr.filter(function(edge){
                    return nodeIds.indexOf(edge.from)>=0 && nodeIds.indexOf(edge.to)>=0;
                  })
                    
                  });
              } else vm.startNetwork();
            },50);
            
          }); 
        }
        
        //start the initialization
        vm.init(vm.riskid);
        
        /* Graph manipulations */
        vm.addNodeRelations = function (id) {
          vm.loading=GRAPH.network(id,!vm.options.showRiskEvidences?'risk_factor':null).then(function(data){
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
        
        vm.selectElement = function(id){
          if(!id) $timeout(function(){vm.showDetails=false; vm.selectedId = false; },0);
          else {
            if(id.indexOf('/')!==-1) id = id.substr(id.lastIndexOf('/')+1);
            $timeout(function(){vm.selectedId = id; },0);
            if(vm.showDetails) { //reload element hack
              $timeout(function(){vm.showDetails=false; },0);
              $timeout(function(){vm.showDetails = true;},100);
            }
          }
          
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
          var id,label;
          
          if(nodes.length===1) {
             //then it is a risk element
            id=nodes[0].substring(nodes[0].lastIndexOf("/")+1);
            label=vm.nodes._data[nodes[0]].label;
          
          } else if (edges.length===1){
              var edge=vm.edges._data[edges[0]];
              id=edges[0].substring(edges[0].lastIndexOf("/")+1);
              label=vm.nodes._data[edge.from].label+" "+edge.label+" "+vm.nodes._data[edge.to].label;
              
          } else return false;
          content.goTo(id,label);
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
        vm.startNetwork = function(externalData) {
            if(!vm.loading || !vm.loading.promise || vm.loading.promise.$$state.status===1) $timeout(function(){vm.loading=$q.defer();},0);
          
            externalData = externalData || {}
            vm.customHeight=0;
            vm.edges = new vis.DataSet(externalData.edges||vm.edgesArr);
            vm.nodes = new vis.DataSet(externalData.nodes||vm.nodesArr);
            
            // create a network
            var container = document.getElementById('network');
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
                smooth:{enabled:true,type:'dynamic'},
                arrows: 'to',
                color:'#aaaaaa',
                font: {
                  color: '#343434',
                  size: 11, // px
                  face: 'arial',
                  background: 'none',
                  strokeWidth: 1, // px
                  strokeColor: '#ffffff',
                  // align:'middle'
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
                  gravitationalConstant: -1000,
                  centralGravity: 0.1,
                  springLength: 200,
                  springConstant: 0.001,
                  damping: 0.09,
                  avoidOverlap: 0
                },
                forceAtlas2Based: {
                  gravitationalConstant: -70,
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
                  
                  // vm.addRiskEvidences(vm.edges._data[params.edges[0]]);
                  
                  // do something with the edge
                  var edge=vm.edges._data[params.edges[0]];
                  var rf_id=params.edges[0].substring(params.edges[0].lastIndexOf("/")+1);
                  var rf_label=vm.nodes._data[edge.from].label+" "+edge.label+" "+vm.nodes._data[edge.to].label;
                  content.goTo(rf_id,rf_label);
                }
            });
            //left click
            network.on("click", function (params) {
              if(params.nodes.length===1) {
                vm.selectElement(params.nodes[0]);
              } else if(params.edges.length===1) {
                vm.selectElement(params.edges[0]);
              } else {
                vm.selectElement();
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
            
            //after render
            network.on("afterDrawing", function (params) {
              if(vm.loading && vm.loading.promise && vm.loading.promise.$$state.status===0) $timeout(function(){vm.loading.resolve();},50);
            });
        };
        //end of controller
      }
    
    };
  });
