var margin = { top: 40, right: 10, bottom: 100, left: 50 };
var width = 400;
var height = 325;

var dataXRange = { min: 0, max: 100 };
var dataYRange = { min: 0, max: 100 };
var xAxisLabelHeader = "X Header";
var yAxisLabelHeader = "Y Header";
var circleRadius = 40;

var data;
var chart;
var chartWidth;
var chartHeight;
init(drawDots);

function init(drawChart) {
  console.log("initiating!");
  chartWidth = width - margin.left - margin.right;
  chartHeight = height - margin.top - margin.bottom;
  data = [
    {
      id: "0",
      item: "1",
      xVal: "30",
      yVal: "50"
    },
    {
      id: "1",
      item: "2",
      xVal: "70",
      yVal: "50"
    }
  ];
  initializeChart();
  createAxes();
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

function LightenDarkenColor(col, amt) {
  var usePound = false;

  if (col[0] == "#") {
    col = col.slice(1);
    usePound = true;
  }

  var num = parseInt(col, 16);

  var r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  var b = ((num >> 8) & 0x00ff) + amt;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  var g = (num & 0x0000ff) + amt;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

function drawDots() {
  // do something with the data here!

  // plot dots
  var dots = chart.plotArea
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", function(d) {
      return chart.xScale(d.xVal);
    })
    .attr("cy", function(d) {
      return chart.yScale(d.yVal);
    })
    .attr("r", circleRadius)
    .attr("fill", function(d) {
      if (d.id == 0) {
        return LightenDarkenColor("#216fed", url_data["ratio"] * 20);
      } else {
        return LightenDarkenColor("#216fed", 20);
      }
    })
    .on("click", function(d) {
      console.log("circle: ", d.xVal, ", ", d.yVal);
      changeBox(d3.select(this).attr("cx"), chart);
    });
  console.log(url_data["ratio"]);
  chart.plotArea
    .selectAll(".text")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", function(d) {
      return chart.xScale(d.xVal) - 4;
    })
    .attr("y", function(d) {
      return chart.yScale(d.yVal);
    })
    .attr("dy", "4.75em")
    .text(function(d) {
      return d.item;
    });
}
