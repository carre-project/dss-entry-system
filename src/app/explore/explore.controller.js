(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('ExploreController', ExploreController);

  /** @ngInject */
  function ExploreController($rootScope, $timeout, toastr, CARRE, $location, CONFIG, $scope, Risk_elements,$state) {
    var vm = this;
    
    //graph init
    vm.limitNewConnections = 4;
    vm.minConnections = 12;
    
    Risk_elements.associations().then(function(data){
      
      //perform manipulations
      vm.nodesArr=data.nodes.filter(function(obj){ return obj.value>vm.minConnections; });
      //filter edges
      vm.edgesArr=data.edges.filter(function(edge){
        var from=false;
        var to=false;
        for (var i=0,len=vm.nodesArr.length;i<len;i++){
          if(vm.nodesArr[i].id===edge.from) from=true;
          if(vm.nodesArr[i].id===edge.to) to=true
        }
        return from&&to;
      });
      
      //init network
      $timeout(function(){vm.startNetwork();},500);
      
    }); 
    
    /* Play with graph*/
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

    /* Network Graph testing */
    var nodeIds, shadowState, nodes, edges, network;

    vm.startNetwork = function() {
        // this list is kept to remove a random node.. we do not add node 1 here because it's used for changes
        shadowState = false;
        vm.nodes = new vis.DataSet(vm.nodesArr);
        vm.edges = new vis.DataSet(vm.edgesArr);

        // create a network
        var container = document.getElementById('mynetwork');
        var data = {
            nodes: vm.nodes,
            edges: vm.edges
        };
        var options = {
          height: '600px',
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
        
        
        network.on("doubleClick", function (params) {
            if(params.nodes.length===1) vm.addNodeRelations(params.nodes[0]);
            else if(params.edges.length===1) {
              //do something with the edge
              var rf_id=params.edges[0].substring(params.edges[0].lastIndexOf("/")+1)
              $state.go("main.risk_factors.view",{id:rf_id});
            }
        });
    
    }
    
  }
})();
