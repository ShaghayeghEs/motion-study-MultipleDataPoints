var margin = { top: 20, right: 20, bottom: 20, left: 20 };
var width = 500;
var height = 350;

var data;
var chart;
var chartWidth;
var chartHeight;

init(drawDots);

function init(drawChart) {
  console.log("initiating!");
  chartWidth = width - margin.left - margin.right;
  chartHeight = height - margin.top - margin.bottom;

  var N = 4; // Change N to the desired size of the grid

  data = [];

  var cellSize = Math.min(chartWidth, chartHeight) / N; // Size of each grid cell
  var circleRadius = cellSize / 4.7; // Adjust the fraction to control the circle size

  // Generate data for each cell in the grid
  for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      var cx = (j + 0.5) * cellSize; // X position of circle center
      var cy = (i + 0.5) * cellSize; // Y position of circle center

      data.push({
        id: i * N + j + 1,
        cx: cx,
        cy: cy,
        radius: circleRadius,
        expanding: true,
      });
    }
  }

  initializeChart();
  drawChart();
} //end init

function initializeChart() {
  chart = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  chart.plotArea = chart
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

function drawDots() {

  var speeds = [200];

  // plot dots
  var dots = chart.plotArea
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", function(d) {
      return d.cx;
    })
    .attr("cy", function(d) {
      return d.cy;
    })
    .attr("r", function(d) {
      return d.radius;
    })
    .attr("fill", "#008fb3")
    .on("click", function(d) {
      console.log("circle: ", d.id, ", ", d.cx, ", ", d.cy);
      // Perform action on circle click
    });

  chart.plotArea
    .selectAll(".text")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", function(d) {
      return d.cx;
    })
    .attr("y", function(d) {
      return d.cy;
    })
    .attr("text-anchor", "middle") // Set the text anchor to the middle
    .attr("dy", "0.35em") // Adjust the dy value for vertical alignment
    .text(function(d) {
      return d.id;
    });

  animate();

  function animate() {
    dots.each(function(d, i) {
      var circle = d3.select(this);
      var expanding = d.expanding;
      var speed = speeds[i % speeds.length]; // Get the speed based on the index

      if (expanding) {
        // Expand circle
        circle
          .transition()
          .duration(speed)
          .attr("r", d.radius * 2)
          .on("end", function() {
            d.expanding = false;
            animate();
          });
      } else {
        // Shrink circle
        circle
          .transition()
          .duration(speed)
          .attr("r", d.radius)
          .on("end", function() {
            d.expanding = true;
            animate();
          });
      }
    });
  }
}