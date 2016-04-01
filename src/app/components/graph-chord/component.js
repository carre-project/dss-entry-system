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
    controller: function($scope, $timeout, toastr, CARRE, $location, CONFIG, GRAPH,$state,SweetAlert,content) {
  
        var vm = $scope;
        vm.loading=false;
        vm.containerId = "chord";
        
        //graph init configuration
        vm.limitNewConnections = $scope.limitNewConnections||10;
        vm.minConnections = 5;
        vm.height = vm.height || 700;
        vm.customHeight=0;
        vm.rotation=0;
        
        vm.alwaysOnDetails=true;
        vm.showRiskEvidences=false;
        vm.onlyCore= false;
        
        //resize events
        
        //resize events
        $(window).resize(function(){ vm.renderChord(); });
        vm.addSize=function(){
          if(vm.customHeight>=800) return false;
          vm.customHeight+=100;
          $timeout(function() {
            vm.renderChord();
          });
        };
        vm.removeSize=function(){
          if(vm.customHeight<=-300) return false;
          vm.customHeight-=100;
          $timeout(function() {
            vm.renderChord();
          });
        };
        
        
        vm.init =function (id){
          
          id = id || vm.riskid;
          
          vm.loading = GRAPH.network(id,!vm.showRiskEvidences?'risk_factor':null).then(function(data) {

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
            });
            //init network after 50ms delay
            $timeout(function(){ vm.renderChord(); },0);
            
          }); 
        }
        
        //start the initialization
        vm.init(vm.riskid);
        
      
        /* Graph manipulations */
        vm.goToSelected = function () {
          var elem = vm.selectedItem.obj||{},
              id = elem.id.substring(elem.id.lastIndexOf("/")+1),
              label,
              type = vm.selectedItem.type;
          if(type==='node') label=elem.label;
          else if (type==='link'){
              label=vm.nodesArr[FindIndex(vm.nodesArr,elem.from)].label
              +" "+elem.label+" "+
              vm.nodesArr[FindIndex(vm.nodesArr,elem.to)].label;
          } else return false;
          content.goTo(id,label);
        };
        
        vm.addNodeRelations = function () {
          var id = vm.selectedId;
          vm.loading=GRAPH.network(id,!vm.showRiskEvidences?'risk_factor':null).then(function(data){
            var limit=vm.limitNewConnections;
            var nodes={};
            data.nodes.forEach(function(node){
              nodes[node.id]=node;
            });
            data.edges.forEach(function(edge){
              if(FindIndex(vm.edgesArr,edge.id)===-1&&limit>0) {
                if(FindIndex(vm.nodesArr,edge.from)===-1) vm.nodesArr.push(nodes[edge.from]);
                if(FindIndex(vm.nodesArr,edge.to)===-1) vm.nodesArr.push(nodes[edge.to]);
                vm.edgesArr.push(edge);
                limit--;
              }
            });
            //re-render graph
            $timeout(function() {vm.renderChord();}, 0);
          });
          
        };
        vm.deleteSelected = function(){
          if(!vm.selectedItem || vm.selectedItem.type!=='node') return false; 
          var elem = vm.selectedItem.obj||{};
          //remove connected edges
          vm.edgesArr=vm.edgesArr.filter(function(link, i) {
            return !(link.from===elem.id||link.to===elem.id);
          });          
          vm.nodesArr=vm.nodesArr.filter(function(node){ 
            return FindIndex(vm.edgesArr,node.id,'from')+FindIndex(vm.edgesArr,node.id,'to')>=-1;
          });
          //re-render graph
          $timeout(function() {vm.renderChord();}, 0);
        };
    
        vm.renderChord = function() {
            if(vm.rotationWatch) vm.rotationWatch();
      
            var options = {
                "rotation": vm.rotation
            };
            var nodesIndex={};
            var edgeMatrix = [];
            var matrix = [];
            vm.nodesArr.forEach(function(n,i){
              nodesIndex[n.id]={i:i,obj:n};
              edgeMatrix[i]=edgeMatrix[i]||[];
              matrix[i]=matrix[i]||[];
              vm.nodesArr.forEach(function(m,j){
                edgeMatrix[i][j]=0;
                matrix[i][j]=0;
              });
            });
            vm.edgesArr.forEach(function(e,i){
              edgeMatrix[nodesIndex[e.from].i][nodesIndex[e.to].i]=e;
              matrix[nodesIndex[e.from].i][nodesIndex[e.to].i]=1;
            });
            
            
            console.log("Chord graph data matrix",matrix,edgeMatrix);
            
            // initialize the chord configuration variables
            var config = {
                width: chartCss('width'),
                height: 700+vm.customHeight,
                rotation: 0,
                textgap: 10
            };
            
            // add options to the chord configuration object
            if (options) {
                extend(config, options);
            }
            
            // set chord visualization variables from the configuration object
            var offset = Math.PI * vm.rotation,
                width = config.width,
                height = config.height,
                textgap = config.textgap,
                colors = d3.scale.category20b();
            // set viewBox and aspect ratio to enable a resize of the visual dimensions 
            var viewBoxDimensions = "0 0 " + width + " " + height,
                aspect = width / height;
            
    
            // start the d3 magic
            var chord = d3.layout.chord()
                .padding(.05)
                .sortSubgroups(d3.descending)
                .matrix(matrix);
    
            var innerRadius = Math.min(width, height) * .31,
                outerRadius = innerRadius * 1.1;
    
            var fill = function(d, i) {
                    i = i||d;
                    return vm.riskid?(vm.nodesArr[i].color||'#aaaaaa'):colors(i) // = color(i);
            }
              
            var rotate=function(){
                d3.select("#"+vm.containerId+" svg g")
                .transition()
                .duration(1000)
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")rotate("+vm.rotation+")")
            }
            
            vm.rotationWatch=$scope.$watch('rotation',function(){
                $timeout(function(){ rotate(); },0);
            });
        
            
            angular.element("#"+vm.containerId+" svg").remove();
            var svg = d3.select("#"+vm.containerId).append("svg")
                .attr("viewBox", viewBoxDimensions)
                .attr("preserveAspectRatio", "xMinYMid")    // add viewBox and preserveAspectRatio
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    
            var g = svg.selectAll("g.group")
                .data(chord.groups)
                .enter().append("svg:g")
                .attr("class", "group");
    
                //group arc
                g.append("svg:path")
                .style("fill", function(d) { return fill(d.index); })
                .style("stroke", function(d) { return fill(d.index); })
                .attr("id", function(d, i) { return "group" + d.index; })
                .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius).startAngle(startAngle).endAngle(endAngle))
                //group text
                g.append("svg:text")
                .each(function(d) {d.angle = ((d.startAngle + d.endAngle) / 2) + offset; })
                .attr("dy", ".35em")
                .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
                .attr("transform", function(d) {
                    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                        + "translate(" + (outerRadius + textgap) + ")"
                        + (d.angle > Math.PI ? "rotate(180)" : "");
                  })
                .text(function(d) { return vm.nodesArr[d.index].label; })
                .style("fill", function(d) { return fill(d.index); });
    
            var link=svg.append("g")
                .attr("class", "chord")
                .selectAll("path")
                .data(chord.chords)
                .enter().append("path")
                .attr("d", d3.svg.chord().radius(innerRadius).startAngle(startAngle).endAngle(endAngle))
                .style("fill", function(d) { return fill(d.source.index); })
                .style("opacity", 1);
                
            //link text
            link.append("svg:title").text(function(d) { 
                return  vm.nodesArr[d.source.index].label +" "+ 
                edgeMatrix[d.source.index][d.target.index].label +" "+ 
                vm.nodesArr[d.target.index].label; 
            });
        
            // helper functions start here
            
            function startAngle(d) { return d.startAngle + offset; }
            function endAngle(d) { return d.endAngle + offset; }
            function extend(a, b) { for(var i in b) {a[i]=b[i];} }
            
            // Returns an event handler for fading a given chord group.
            function fade(opacity) {
                return function(g, i) {
                  svg.selectAll(".chord path")
                  .filter(function(d) { return d.source.index != i && d.target.index != i; })
                  .transition().style("opacity", opacity);
                };
            }
            
            //assign events
            g.on("mouseover", fade(.1))
                .on("mouseout", fade(1))
                .on('click',clickNode)
                .on('dblclick',vm.addNodeRelations)
                .on('contextmenu',vm.deleteSelected);
                
            link.on('click',clickLink)
                .on('dblclick',vm.goToSelected);
    
        }
        
        //register events==============================>
        
        function clickNode(obj,i){ 
          // console.debug("Node",this,obj,i);
          clearSelection();
          d3.select(this).classed("selected", !d3.select(this).classed("selected"));
          selectElement(vm.nodesArr[i],'node');
          d3.event.stopPropagation(); //events hack
        }
        function clickLink(obj,i){
          // console.debug("Link",this,obj,i);
          clearSelection();
          d3.select(this).classed("selected", !d3.select(this).classed("selected"));
          var link=vm.edgesArr.filter(function(link){
            return link.from===vm.nodesArr[obj.source.index].id && link.to===vm.nodesArr[obj.target.index].id;
          })[0];
          selectElement(link,'link');
          d3.event.stopPropagation(); //events hack
        }

        //clear selection event
        angular.element("#"+vm.containerId).on('click',clearSelection);
        
        //help functions
        function clearSelection(){
          $timeout(function(){vm.selectedId = null; },0);
          d3.select("#"+vm.containerId+" svg").selectAll(".chord path").classed("selected", false);
          d3.select("#"+vm.containerId+" svg").selectAll(".group").classed("selected", false);
        }
        function selectElement(obj,type){
          var id = obj?obj.id:null;
          if(!id) return;
          else {
            if(id.indexOf('/')!==-1) id = id.substr(id.lastIndexOf('/')+1);
            $timeout(function(){
              vm.selectedId = id; 
              vm.selectedItem={type:type,obj:obj};
            },0);
            if(vm.showDetails && vm.alwaysOnDetails) { //reload element hack
              $timeout(function(){vm.showDetails=false; },0);
              $timeout(function(){vm.showDetails = true;},100);
            }
          }
        }
        function chartCss(attr){
          var elem=document.getElementById(vm.containerId);
          if(elem) return Number(getComputedStyle(elem, null).getPropertyValue(attr).replace('px',''));
          else return null;
        }
        
        


    }

    
    //end of controller
}
      
      
    
});