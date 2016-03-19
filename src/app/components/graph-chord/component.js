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
        
        //graph init configuration
        vm.limitNewConnections = $scope.limitNewConnections||4;
        vm.minConnections = 5;
        vm.height = vm.height || 600;
        vm.containerId = "chord";
        
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
            $timeout(function(){
              vm.renderChord();
            },50);
            
          }); 
        }
        

function chartCss(attr){
 var elem=document.getElementById(vm.containerId)
 if(elem) return Number(getComputedStyle(elem, null).getPropertyValue(attr).replace('px',''));
 else return null;
}
$(window).resize(function(){
  $('#'+vm.containerId+' svg').remove();
  vm.renderChord();
});
var rotation = 0;


vm.renderChord = function() {
  
        var options = {
            "rotation": rotation
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
          matrix[nodesIndex[e.from].i][nodesIndex[e.to].i]=e.value||1;
        });
        console.log("New Matrix,",vm.nodesArr,matrix,edgeMatrix);
        
        // initialize the chord configuration variables
        var config = {
            width: chartCss('width'),
            height: 700,
            rotation: 0,
            textgap: 10
        };
        
        // add options to the chord configuration object
        if (options) {
            extend(config, options);
        }
        
        // set chord visualization variables from the configuration object
        var offset = Math.PI * config.rotation,
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
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")rotate("+config.rotation+")")
        }
        var rotateRight = function(d,i) { 
            config.rotation+=45;
            rotate();
        }
        var rotateLeft = function(d,i) { 
            d3.event.preventDefault();
            config.rotation-=45;
            rotate();
        }
    
        var svg = d3.select("#"+vm.containerId).append("svg")
            .attr("viewBox", viewBoxDimensions)
            .attr("preserveAspectRatio", "xMinYMid")    // add viewBox and preserveAspectRatio
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
            .on("click", rotateRight)
            .on("contextmenu", rotateLeft);

        var g = svg.selectAll("g.group")
            .data(chord.groups)
          .enter().append("svg:g")
            .attr("class", "group");

        g.append("svg:path")
            .style("fill", function(d) { return fill(d.index); })
            .style("stroke", function(d) { return fill(d.index); })
            .attr("id", function(d, i) { return "group" + d.index; })
            .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius).startAngle(startAngle).endAngle(endAngle))
            .on("mouseover", fade(.1))
            .on("mouseout", fade(1));

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
            .on("mouseover", fade(.1))
            .on("mouseout", fade(1))
            .style("fill", function(d) { return fill(d.index); });

        svg.append("g")
            .attr("class", "chord")
          .selectAll("path")
            .data(chord.chords)
          .enter().append("path")
            .attr("d", d3.svg.chord().radius(innerRadius).startAngle(startAngle).endAngle(endAngle))
            .style("fill", function(d) { return fill(d.source.index); })
            .style("opacity", 1)
          .append("svg:title")
            .text(function(d) { 
                return  vm.nodesArr[d.source.index].label +" "+ edgeMatrix[d.source.index][d.target.index].label +" "+ vm.nodesArr[d.target.index].label; 
            });
    
        // helper functions start here
        
        function startAngle(d) {
            return d.startAngle + offset;
        }

        function endAngle(d) {
            return d.endAngle + offset;
        }
        
        function extend(a, b) {
            for( var i in b ) {
                a[ i ] = b[ i ];
            }
        }

        // Returns an event handler for fading a given chord group.
        function fade(opacity) {
            return function(g, i) {
                svg.selectAll(".chord path")
                    .filter(function(d) { return d.source.index != i && d.target.index != i; })
                    .transition()
                    .style("opacity", opacity);
            };
        }
        
        
        window.onresize = function() {
            var targetWidth = (window.innerWidth < width)? window.innerWidth : width;
            
            var svg = d3.select("#"+vm.containerId)
                .attr("width", targetWidth)
                .attr("height", targetWidth / aspect);
        }

      
    }


}
        
        //end of controller
      }
      
      
    
    });