'use strict';

angular.module('CarreEntrySystem')
  .directive('carreGraphFlareRisk', function() {
    return {
      templateUrl: 'app/components/graph-flare/template.html',
      restrict: 'E',
      scope: {
        'limitNewConnections':'@',
        'height': '@',
        'riskid': '='
      },
      controller: function($scope, $timeout, toastr, CARRE, $location, CONFIG, Risk_elements,$state,SweetAlert) {
      
        var vm = $scope;
        vm.loading=false;
        vm.onlyCore=false
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
                else obj_pos=id.substring(id.lastIndexOf("/")+1)===obj.id.substring(obj.id.lastIndexOf("/")+1)?0:-1;
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
        
        
        vm.deleteSelected = function(id){
          var node=id||network.getSelectedNodes()[0];
          if(!node) return false; 
          var nodeData={
            nodes:[node],
            edges:network.getConnectedEdges(node)
          }
          vm.removeOrphan(nodeData);
        }
        
        
          // Some setup stuff.
  var margin = {top: 1, right: 1, bottom: 6, left: 1};
  var width = 960 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;
  var color = d3.scale.category20();
  
  // SVG (group) to draw in.
  var svg = d3.select("#chart").append("svg")
          .attr({
            width: width + margin.left + margin.right,
            height: height + margin.top + margin.bottom
          })
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // Set up Sankey object.
  var sankey = d3.sankey()
          .nodeWidth(30)
          .nodePadding(10)
          .size([width, height])
          .nodes(data.nodes)
          .links(data.links)
          .layout(32);
  // Path data generator.
  var path = sankey.link();
  // Draw the links.
  var links = svg.append("g").selectAll(".link")
          .data(data.links)
          .enter()
          .append("path")
          .attr({
            "class": "link",
            d: path
          })
          .style("stroke-width", function (d) {
            return Math.max(1, d.dy);
          })
  links.append("title")
          .text(function (d) {
            return d.source.name + " to " + d.target.name + " = " + d.value;
          });
  // Draw the nodes.
  var nodes = svg.append("g").selectAll(".node")
          .data(data.nodes)
          .enter()
          .append("g")
          .attr({
            "class": "node",
            transform: function (d) {
              return "translate(" + d.x + "," + d.y + ")";
            }
          });
  nodes.append("rect")
          .attr({
            height: function (d) {
              return d.dy;
            },
            width: sankey.nodeWidth()
          })
          .style({
            fill: function (d) {
              return d.color = color(d.name.replace(/ .*/, ""));
            },
            stroke: function (d) {
              return d3.rgb(d.color).darker(2);
            }
          })
          .append("title")
          .text(function (d) {
            return d.name;
          });
  nodes.append("text")
          .attr({
            x: sankey.nodeWidth() / 2,
            y: function (d) {
              return d.dy / 2;
            },
            dy: ".35em",
            "text-anchor": "middle",
            transform: null
          })
          .text(function (d) {
            return d.name;
          });
        
        //end of controller
      }
    
    };
  });
