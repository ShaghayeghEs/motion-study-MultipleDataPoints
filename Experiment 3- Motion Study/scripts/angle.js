var width = 116;
var height = 116;

var padding = 2;
var timer_ret_val = false;

var svg = d3
  .select("#chart")
  .attr("width", width)
  .attr("height", height);

var gridWidth = 10;
var gridHeight = 10;
var cellSize = 51.5;
var angleGap = 1; // Adjust the gap size as desired

var gridData = [];
for (var row = 0; row < gridHeight; row++) {
  for (var col = 0; col < gridWidth; col++) {
    gridData.push({
      x: col * cellSize,
      y: row * cellSize,
      id: row * gridWidth + col + 1,
      startAngle: Math.random() * 2 * Math.PI
    });
  }
}

var box = svg
  .selectAll(".rect")
  .data(gridData)
  .enter()
  .append("rect")
  .attr("class", "rect")
  .style("fill", "none")
  .attr("stroke", "black")
  .attr("stroke-width", 1)
  .attr("x", function(d) {
    return d.x;
  })
  .attr("y", function(d) {
    return d.y;
  })
  .attr("width", cellSize)
  .attr("height", cellSize);

var angles = svg
  .selectAll(".path")
  .data(gridData)
  .enter()
  .append("path")
  .attr("transform", function(d) {
    return "translate(" + (d.x + cellSize / 2) + "," + (d.y + cellSize / 2) + ")";
  })
  .attr("d", d3.arc()
    .innerRadius(0)
    .outerRadius(cellSize / 2 - angleGap) // Adjust the outerRadius to leave a gap
    .startAngle(0)
    .endAngle(function(d) {
      return d.startAngle; // Use the stored startAngle value for each angle
    })
  )
  .attr("fill", "none")
  .attr("stroke", "black");

var text_data = [];
for (var i = 1; i <= gridWidth * gridHeight; i++) {
  text_data.push({
    x: (Math.floor((i - 1) / gridWidth) + 0.5) * cellSize,
    y: (i % gridWidth === 0 ? gridWidth : i % gridWidth) * cellSize - cellSize / 2,
    id: i
  });
}

var texts = svg
  .selectAll(".text")
  .data(text_data)
  .enter()
  .append("text")
  .attr("class", "text")
  .attr("x", function(d) {
    return d.x;
  })
  .attr("y", function(d) {
    return d.y;
  })
  .text(function(d) {
    return d.id;
  })
  .attr("font-family", "sans-serif")
  .attr("font-size", "11px")
  .attr("text-anchor", "top")
  .attr("dominant-baseline", "middle")
  .attr("fill", "black");
