(function(){

  var gogogo = window.gogogo || (window.gogogo = {});

  gogogo.minimap = function(){

    var height = 600,
        width = 600,
        projection,
        minRadius = 2,
        maxRadius = 5,
        duration = 2000,
        dispatch = d3.dispatch("clicked");


    function minimap(selection){
      selection.each(function(data){
        var chart;

        if (selection.select('svg').empty()){
          chart = selection.append('svg')
          .attr('width', width)
          .attr('height', height)
        }
        else
        {
          chart = selection.select('svg')
          .attr('width', width)
          .attr('height', height)
        }

        var projection = d3.geo.mercator(),
            path = d3.geo.path().projection(projection),
            b = path.bounds(data),
            s = 100 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
            t = [width/ 2, height / 2],
            center = d3.geo.centroid(data);

        //console.log(data, b,s,t,center)

        projection.scale(s).translate(t).center(center)

        //var radiusDomain = d3.extent(data.features.map(function(d){return d.properties.social}))

        var radiusScale = d3.scale.linear()
                            .range([Math.pow(minRadius,2)*Math.PI, Math.pow(maxRadius,2)*Math.PI])
                            .domain([0, 100])

        var line = chart.selectAll(".line").data([data])

        // line
        // .transition()
        // .duration(duration)
        // .attr("d", path)

        line
          .enter()
          .append("path")
          .attr("class", "line")
          .attr("d", path)
          .attr("fill", "none")
          .attr("stroke", "black")

      }); //end selection
    } // end minimap


  minimap.height = function(x){
    if (!arguments.length) return height;
    height = x;
    return minimap;
  }

  minimap.width = function(x){
    if (!arguments.length) return width;
    width = x;
    return minimap;
  }

  minimap.projection = function(x){
    if (!arguments.length) return projection;
    projection = x;
    return minimap;
  }

  minimap.minRadius = function(x){
    if (!arguments.length) return minRadius;
    minRadius = x;
    return minimap;
  }

  minimap.maxRadius = function(x){
    if (!arguments.length) return maxRadius;
    maxRadius = x;
    return minimap;
  }

  minimap.duration = function(x){
    if (!arguments.length) return duration;
    duration = x;
    return minimap;
  }


  d3.rebind(minimap, dispatch, 'on');

  return minimap;

  }

})();