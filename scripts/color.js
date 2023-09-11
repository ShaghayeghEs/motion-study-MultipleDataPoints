var margin = { top: 20, right: 20, bottom: 20, left: 20 };
var width = 400;
var height = 350;

var dataXRange = { min: 0, max: 100 };
var dataYRange = { min: 0, max: 100 };
var xAxisLabelHeader = "X Header";
var yAxisLabelHeader = "Y Header";

var data;
var chart;
var chartWidth;
var chartHeight;
var colors = ["#ff0000", "#00ff00", "#0000ff","#808080"];

init(drawDots);

function init(drawChart) {
  console.log("initiating!");
  chartWidth = width - margin.left - margin.right;
  chartHeight = height - margin.top - margin.bottom;

  var N = 2; // Change N to the desired size of the grid

  data = [];

  initializeChart();
  createAxes();
  drawChart(N);
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

function createAxes() {
  // x axis
  chart.xScale = d3
    .scaleLinear()
    .domain([dataXRange.min, dataXRange.max])
    .range([0, chartWidth]);

  chart.xAxis = d3
    .axisBottom()
    .tickSize(0)
    .scale(chart.xScale);

  // y axis labels
  chart.yScale = d3
    .scaleLinear()
    .domain([dataYRange.min, dataYRange.max])
    .range([chartHeight, 0]);

  chart.yAxis = d3
    .axisLeft()
    .tickSize(0)
    .scale(chart.yScale);
}

function drawDots(N) {
  var cellSize = Math.min(chartWidth, chartHeight) / N; // Size of each grid cell
  var circleRadius = cellSize / 2.5; // Adjust the fraction to control the circle size

  // Generate data for each cell in the grid
  for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      var cx = (j + 0.5) * cellSize; // X position of circle center
      var cy = (i + 0.5) * cellSize; // Y position of circle center

      var color = colors[(i * N + j) % colors.length]; // Assign color from the array based on the cell index

      chart.plotArea
        .append("circle")
        .attr("class", "dot")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", circleRadius)
        .attr("fill", color)
        .on("click", function() {
          var circle = d3.select(this);
          var id = circle.data()[0].id;
          var cx = circle.attr("cx");
          var cy = circle.attr("cy");
          console.log("circle: ", id, ", ", cx, ", ", cy);
          // Perform action on circle click
        });

      chart.plotArea
        .append("text")
        .attr("class", "label")
        .attr("x", cx)
        .attr("y", cy)
        .attr("text-anchor", "middle") // Set the text anchor to the middle
        .attr("dy", "0.35em") // Adjust the dy value for vertical alignment
        .text(i * N + j);
    }
  }
}
