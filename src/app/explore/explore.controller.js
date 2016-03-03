(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('ExploreController', ExploreController);

  /** @ngInject */
  function ExploreController($rootScope, $timeout, toastr, CARRE, $location, CONFIG, $scope) {
    var vm = this;
    
    //graph init
    vm.countAllInit = 0;
    vm.countAll = 0;
  
    vm.colors=CONFIG.COLORS;
    
    
    /* Network Graph testing */
     var nodeIds, shadowState, nodesArray, nodes, edgesArray, edges, network;

    vm.startNetwork = function() {
        // this list is kept to remove a random node.. we do not add node 1 here because it's used for changes
        nodeIds = [2, 3, 4, 5];
        shadowState = false;


        // create an array with nodes
        nodesArray = [
            {id: 1, label: 'Node 1'},
            {id: 2, label: 'Node 2'},
            {id: 3, label: 'Node 3'},
            {id: 4, label: 'Node 4'},
            {id: 5, label: 'Node 5'}
        ];
        nodes = new vis.DataSet(nodesArray);

        // create an array with edges
        edgesArray = [
            {from: 1, to: 3},
            {from: 1, to: 2},
            {from: 2, to: 4},
            {from: 2, to: 5}
        ];
        edges = new vis.DataSet(edgesArray);

        // create a network
        var container = document.getElementById('mynetwork');
        var data = {
            nodes: nodes,
            edges: edges
        };
        var options = {
          height: '600px',
          width: '100%'
        };
        network = new vis.Network(container, data, options);
    }

    vm.addNode = function() {
        var newId = (Math.random() * 1e7).toString(32);
        nodes.add({id:newId, label:"I'm new!"});
        nodeIds.push(newId);
    }

    vm.changeNode1 = function() {
        var newColor = '#' + Math.floor((Math.random() * 255 * 255 * 255)).toString(16);
        nodes.update([{id:1, color:{background:newColor}}]);
    }

    vm.removeRandomNode = function() {
        var randomNodeId = nodeIds[Math.floor(Math.random() * nodeIds.length)];
        nodes.remove({id:randomNodeId});

        var index = nodeIds.indexOf(randomNodeId);
        nodeIds.splice(index,1);
    }

    vm.changeOptions = function() {
        shadowState = !shadowState;
        network.setOptions({nodes:{shadow:shadowState},edges:{shadow:shadowState}});
    }

    vm.resetAllNodes = function() {
        nodes.clear();
        edges.clear();
        nodes.add(nodesArray);
        edges.add(edgesArray);
    }

    vm.resetAllNodesStabilize = function() {
        vm.resetAllNodes();
        network.stabilize();
    }

    vm.setTheData = function() {
        nodes = new vis.DataSet(nodesArray);
        edges = new vis.DataSet(edgesArray);
        network.setData({nodes:nodes, edges:edges})
    }

    vm.resetAll = function() {
        if (network !== null) {
            network.destroy();
            network = null;
        }
        vm.startNetwork();
    }

    vm.startNetwork();
    
    
    
  }
})();
