'use strict';

angular.module('CarreEntrySystem')
  .directive('carreGraphChordRisk', function() {
    return {
      templateUrl: 'app/components/graph-chord/template.html',
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
        
        vm.renderChord = function(){
                      // http://blog.thomsonreuters.com/index.php/mobile-patent-suits-graphic-of-the-day/
            var links = [
              {source: "Microsoft", target: "Amazon", type: "licensing"},
              {source: "Microsoft", target: "HTC", type: "licensing"},
              {source: "Samsung", target: "Apple", type: "suit"},
              {source: "Motorola", target: "Apple", type: "suit"},
              {source: "Nokia", target: "Apple", type: "resolved"},
              {source: "HTC", target: "Apple", type: "suit"},
              {source: "Kodak", target: "Apple", type: "suit"},
              {source: "Microsoft", target: "Barnes & Noble", type: "suit"},
              {source: "Microsoft", target: "Foxconn", type: "suit"},
              {source: "Oracle", target: "Google", type: "suit"},
              {source: "Apple", target: "HTC", type: "suit"},
              {source: "Microsoft", target: "Inventec", type: "suit"},
              {source: "Samsung", target: "Kodak", type: "resolved"},
              {source: "LG", target: "Kodak", type: "resolved"},
              {source: "RIM", target: "Kodak", type: "suit"},
              {source: "Sony", target: "LG", type: "suit"},
              {source: "Kodak", target: "LG", type: "resolved"},
              {source: "Apple", target: "Nokia", type: "resolved"},
              {source: "Qualcomm", target: "Nokia", type: "resolved"},
              {source: "Apple", target: "Motorola", type: "suit"},
              {source: "Microsoft", target: "Motorola", type: "suit"},
              {source: "Motorola", target: "Microsoft", type: "suit"},
              {source: "Huawei", target: "ZTE", type: "suit"},
              {source: "Ericsson", target: "ZTE", type: "suit"},
              {source: "Kodak", target: "Samsung", type: "resolved"},
              {source: "Apple", target: "Samsung", type: "suit"},
              {source: "Kodak", target: "RIM", type: "suit"},
              {source: "Nokia", target: "Qualcomm", type: "suit"}
            ];
            
            var matrix = [],
                groups = [],
                nodeIndex = {},
                id = 0,
                nodes = {};
            
            // Compute the distinct nodes from the links.
            links.forEach(function(link) {
              nodes[link.source] || (nodes[link.source] = 1);
              nodes[link.target] || (nodes[link.target] = 1);
            });
            
            nodes = d3.keys(nodes);
            nodes.sort();
            nodes.forEach(function(node) {
              if (!(node in nodeIndex)) {
                nodeIndex[node] = id++;
              }
            });
            
            for (var node in nodeIndex) {
              var targets = matrix[nodeIndex[node]] = [];
              targets.name = node;
              for (var targetNode in nodeIndex) {
                targets[nodeIndex[targetNode]] = node === targetNode ? 1 : 0;
              }
            }
            
            links.forEach(function(link) {
              matrix[nodeIndex[link.source]][nodeIndex[link.target]] = 1;
              matrix[nodeIndex[link.target]][nodeIndex[link.source]] = 1;
            });
            
            var cluster = science.stats.hcluster();
            
            var rows = [];
            
            traverse(cluster(matrix), rows);
            
            rows.forEach(function(node, i) {
              nodeIndex[groups[i] = node.centroid.name] = i;
              matrix[i] = [];
              matrix[i].node = node;
              for (var j=0; j<rows.length; j++) matrix[i][j] = 0;
            });
            
            links.forEach(function(link) {
              matrix[nodeIndex[link.source]][nodeIndex[link.target]]++;
              matrix[nodeIndex[link.target]][nodeIndex[link.source]]++;
            });
            
            function traverse(tree, rows) {
              if (tree.left) traverse(tree.left, rows);
              if (tree.right) traverse(tree.right, rows);
              if (tree.centroid.name) rows.push(tree);
            }
            
            var distance = science.stats.distance.euclidean;
            
            var chord = d3.layout.chord()
              .padding(.05)
              .matrix(matrix);
            
            chord.matrix(matrix);
            
            var w = 960,
                h = 600,
                p = 40,
                r0 = Math.min(w, h) * .41,
                r1 = r0 * 1.1;
            
            var fill = d3.scale.category20b();
            
            var svg = d3.select("#vis")
              .append("svg")
                .attr("width", w + p + p)
                .attr("height", h + p + p)
              .append("g")
                .attr("transform", "translate(" + (w / 2 + p) + "," + (h / 2 + p) + ")");
            
            var g = svg.selectAll("g.group")
                .data(chord.groups)
              .enter().append("g")
                .attr("class", "group");
            
            g.append("path")
                .style("fill", function(d) { return fill(d.index); })
                .attr("d", d3.svg.arc().innerRadius(r0).outerRadius(r1))
                .on("mouseover", fade(.1))
                .on("mouseout", fade(1));
            
            g.append("text")
                .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
                .attr("dy", ".35em")
                .attr("text-anchor", function(d) {
                  return d.angle > Math.PI ? "end" : null;
                })
                .attr("transform", function(d) {
                  return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                      + "translate(" + (r0 + 32) + ")"
                      + (d.angle > Math.PI ? "rotate(180)" : "");
                })
                .text(function(d) { return groups[d.index]; });
            
            svg.append("g")
                .attr("class", "chord")
              .selectAll("path")
                .data(function() {
                  var chords = [];
                  chord.chords().forEach(function(chord) {
                    chords.push(chord);
                    if (chord.source.value === 2) {
                      var delta = (chord.source.endAngle - chord.source.startAngle) / 2,
                          delta2 = (chord.target.endAngle - chord.target.startAngle) / 2;
                      chords.push({source: {
                        startAngle: chord.target.startAngle,
                        endAngle: chord.target.endAngle - delta,
                        index: chord.target.index,
                        subindex: chord.target.subindex,
                        value: 1
                      }, target: {
                        startAngle: chord.source.startAngle + delta2,
                        endAngle: chord.source.endAngle,
                        index: chord.source.index,
                        subindex: chord.source.subindex,
                        value: 1
                      }});
                      chord.target.startAngle += delta;
                      chord.source.endAngle -= delta2;
                    }
                  });
                  return chords;
                })
              .enter().append("path")
                .style("fill", function(d) { return fill(d.source.subindex); })
                .attr("d", d3.svg.chord().radius(r0))
                .style("opacity", 1);
            
            /** Returns an event handler for fading a given chord group. */
            function fade(opacity) {
              return function(g) {
                svg.selectAll("g.chord path")
                    .filter(function(d) {
                      return d.source.index != g.index && d.target.index != g.index;
                    })
                  .transition()
                    .style("opacity", opacity);
              };
            }

          
          
        }
  
        
        //end of controller
      }
    
    };
  });
