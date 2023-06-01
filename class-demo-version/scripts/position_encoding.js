var margin = { top: 10, right: 10, bottom: 100, left: 50 };
var width = 600;
var height = 400;

var dataXRange = { min: 0, max: 100 };
var dataYRange = { min: 0, max: 100 };
var xAxisLabelHeader = "X Header";
var yAxisLabelHeader = "Y Header";
var circleRadius = 10;

var data;
var chart;
var chartWidth;
var chartHeight;
init(drawDots);

function init(drawChart) {
	console.log("initiating!")
	chartWidth = width - margin.left - margin.right;
	chartHeight = height - margin.top - margin.bottom;
	data = [
		{
			"id": "0",
			"xVal": "20",
			"yVal": "20"
			},
			{
			"id": "1",
			"xVal": "80",
			"yVal": "80"
			}
	];
	initializeChart();
	createAxes();
	drawChart();
}//end init

function initializeChart() {
	chart = d3.select("#chartDiv").append("svg")
		.attr("width", width)
		.attr("height", height);

	chart.plotArea = chart.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

function createAxes() {

	// x axis
	chart.xScale = d3.scaleLinear()
		.domain([dataXRange.min, dataXRange.max])
		.range([0, chartWidth]);

	chart.xAxis = d3.axisBottom()
		.tickSize(0)
		.scale(chart.xScale);

	chart.xAxisContainer = chart.append("g")
		.attr("class", "x axis scatter-xaxis")
		.attr("transform", "translate(" + (margin.left) + ", " + (chartHeight + margin.top) + ")")
		.call(chart.xAxis)
		.selectAll("text").remove();

	// x axis header label
	chart.append("text")
		.attr("class", "x axis scatter-xaxis")
		.style("font-size", "12px")
		.attr("text-anchor", "middle")
		.attr("transform", "translate(" + (margin.left + chartWidth / 2.0) + ", " + (chartHeight + (margin.bottom / 2.0)) + ")")
		.text(xAxisLabelHeader);

	// y axis labels
	chart.yScale = d3.scaleLinear()
		.domain([dataYRange.min, dataYRange.max])
		.range([chartHeight, 0]);

	chart.yAxis = d3.axisLeft()
		.tickSize(0)
		.scale(chart.yScale);

	chart.yAxisContainer = chart.append("g")
		.attr("class", "y axis scatter-yaxis")
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
		.call(chart.yAxis)
		.selectAll("text").remove();

	// y axis header label
	chart.append('text')
		.style("font-size", "12px")
		.attr("class", "heatmap-yaxis")
		.attr("text-anchor", "middle")
		.attr("transform", "translate(" + (margin.left / 2.0) + ", " + (chartHeight / 2.0) + ") rotate(-90)")
		.text(yAxisLabelHeader);
}

function drawDots() {
	// do something with the data here!

	// plot dots
	var dots = chart.plotArea.selectAll(".dot")
		.data(data)
		.enter().append("circle")
			.attr("class", "dot")
			.attr("cx", function(d) { return chart.xScale(d.xVal); })
			.attr("cy", function(d) { return chart.yScale(d.yVal); })
			.attr("r", circleRadius)
			.attr("fill", "blue")
			.on("click", function(d) {
				console.log("circle: ", d.xVal, ", ", d.yVal);
				changeBox(d3.select(this).attr("cx"),chart);
			})
			.on("mouseover", function(d) {
				d3.select(this).attr("fill","red");
			})
			.on("mouseout", function(d) {
				d3.select(this).attr("fill","blue");
			});
}

function drawBoxes(){
	var box = chart.plotArea.selectAll(".box")
		.data(data)
		.enter().append("rect")
			.attr("class", "rect")
			.attr("x", function(d) { return chart.xScale(d.xVal); })
			.attr("y", function(d) { return chart.yScale(d.yVal); })
			.attr("width", 5)
			.attr("height", 5)
			.attr("fill", "green")
			.on("click", function(d) {
				console.log("circle: ", d.xVal, ", ", d.yVal);
				changeDot(d3.select(this).attr("x"),chart)
			})
			.on("mouseover", function(d) {
				d3.select(this).attr("fill","red");
			})
			.on("mouseout", function(d) {
				d3.select(this).attr("fill","green");
			});
}
function changeDot(x, chart){
	chart.plotArea.selectAll(".dot").each(function(point){
		if(d3.select(this).attr("cx")==x){
			d3.select(this.attr("fill","yellow"))
		}
	});
}

function changeBox(x,chart){
	chart.plotArea.selectAll("rect").each(function(point){
		if(d3.select(this).attr("x")==x){
			d3.select(this).attr("fill","yellow")
		}
	});
}

