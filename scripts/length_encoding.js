var margin = {
  top: 10,
  left: 10,
  bottom: 10,
  right: 10
};

var chartWidth = window.innerWidth * 0.37; // Set the width to 35% of the window width
var chartHeight = window.innerHeight * 0.5; // Set the height to 35% of the window height

var svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", chartWidth)
  .attr("height", chartHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%d-%b-%y");

var N = 3; // Change N to the desired size of the grid

var cellWidth = chartWidth / N; // Width of each grid cell
var cellHeight = chartHeight / N; // Height of each grid cell

var x = d3
  .scaleBand()
  .rangeRound([0, cellWidth])
  .padding(0);

var y = d3.scaleLinear().rangeRound([cellHeight, 0]);

var data = [];

// Generate data for each cell in the grid
for (var i = 0; i < N; i++) {
  for (var j = 0; j < N; j++) {
    var xVal = j * cellWidth + (cellWidth - x.bandwidth()) / 2; // X position of the bar graph (aligned within each cell)
    var yVal = (i + 0.5) * cellHeight ; // Y position of the bar graph

    var barValues = [1, 2, 3, 4, 3, 6, 7, 2, 3, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var index = i * N + j;

    var barValue = barValues[index];

    data.push({
      id: index,
      xVal: xVal,
      yVal: yVal,
      barValue: barValue
    });
  }
}

x.domain(
  data.map(function(d) {
    return d.id.toString();
  })
);

var maxBarValue = d3.max(barValues);
y.domain([0, maxBarValue]);

var minBarHeight = 1; // Minimum height for the bars

svg.selectAll(".bar")
  .data(data)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", function(d) {
    return d.xVal;
  })
  .attr("y", function(d) {
    var barHeight = (d.barValue / maxBarValue) * cellHeight;
    if (barHeight < minBarHeight) {
      // Adjust the y position to ensure a minimum height for the bars
      return d.yVal - minBarHeight;
    }
    return d.yVal - barHeight ;
  })
  .attr("width", x.bandwidth())
  .attr("height", function(d) {
    var barHeight = (d.barValue / maxBarValue) * cellHeight;
    if (barHeight < minBarHeight) {
      // Set the minimum height for the bars
      return minBarHeight;
    }
    return barHeight/ 1;
  })
  .attr("fill", "#008fb3");
