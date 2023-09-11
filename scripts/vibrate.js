var N = 3; // Change N to the desired size of the grid

var margin = { top: 20, right: 20, bottom: 20, left: 20 };
var width = 500;
var height = 350;
var chartWidth = width - margin.left - margin.right;
var chartHeight = height - margin.top - margin.bottom;

// Calculate the maximum number of circles that can fit within the available space
var maxCircles = Math.min(chartWidth, chartHeight) / Math.max(N, 1);

var circleRadius = maxCircles * 0.3; // Adjust the fraction to control the circle size
var circleSpacing = maxCircles * 1.1; // Adjust the fraction to control the spacing between circles

speedArray=[200, 400, 800, 1600, 3200, 3200,200,200,200] // Set the speed, Lower = faster

var data = [];

var chart;

var svg = d3.select("svg");

// Calculate the required dimensions for the SVG container based on the grid size
var containerWidth = N * circleSpacing + margin.left + margin.right;
var containerHeight = N * circleSpacing + margin.top + margin.bottom;

svg.attr("width", containerWidth).attr("height", containerHeight);

// Generate data for each cell in the grid
for (var i = 0; i < N; i++) {
  for (var j = 0; j < N; j++) {
    var id = i * N + j;
    var xVal = margin.left + (j +0.2) * circleSpacing; // X position of circle center
    var yVal = margin.top + (i + 0.5) * circleSpacing; // Y position of circle center
    var speed = speedArray[i*N+j]  ; // Get the speed value from the speedArray
    
    data.push({
      id: id.toString(),
      item: (id + 1).toString(),
      xVal: xVal.toString(),
      yVal: yVal.toString(),
      speed: speed
    });
  }
}

var circle = svg.selectAll("circle").data(data, function(d) {
  return d;
});

circle
  .enter()
  .append("circle")
  .attr("cy", function(d) {
    return d.yVal;
  })
  .attr("cx", function(d) {
    return d.xVal;
  })
  .attr("r", circleRadius)
  .attr("fill", "#008fb3")
  .attr("speed", function(d) {
    return d.speed;
  });

vibrate();

function vibrate() {
  circles = svg.selectAll("circle");
  circles.transition().on("start", function repeat() {
    d3.active(this)
      .attr("cx", function(d) {
        return (parseInt(d.xVal, 10) + circleRadius).toString();
      })
      .transition()
      .duration(function(d) {
        return d.speed;
      })
      .attr("cx", function(d) {
        return d.xVal;
      })
      .transition()
      .on("start", repeat);
  });
}

svg
  .selectAll(".text")
  .data(data)
  .enter()
  .append("text")
  .attr("y", function(d) {
    return parseInt(d.yVal, 10) + circleRadius + 4; // Adjust the offset to prevent overlapping
  })
  .attr("class", "label")
  .attr("x", function(d) {
    return d.xVal;
  })
  .attr("text-anchor", "middle")
  .text(function(d) {
    return d.item;
  });
