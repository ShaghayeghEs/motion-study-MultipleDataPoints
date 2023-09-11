var ID;
var Value;
var radio1;
var radio2;
var results_json = [];
var current_elem = 0;
var array_elem1 = 0;
var array_elem2 = 0;
var array_elem3 = 0;
var motion_type = [1, 2, 3];
var move_true;
var count;
var padding = 10;
var timer_ret_val = false;

var margin = {
  top: 18,
  left: 18,
  bottom: 18,
  right: 18
};

var chartWidth = document.getElementById("chartContainer").offsetWidth - margin.left - margin.right;
var chartHeight = document.getElementById("chartContainer").offsetHeight - margin.top - margin.bottom;

var svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", chartWidth)
  .attr("height", chartHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var display1 = d3.select("#chart");
var display2 = d3.select("#test");
var display3 = d3.select("#ranger");
var display4 = d3.select("#last");
var display5 = d3.select("#notice");
// Added by Shae
var display6 = d3.select("#test_difficulty");
var display7 = d3.select("#ranger_difficulty");

var N = 10; // Change N to the desired size of the grid

motion4(array_elem3, N); // Pass the N value to the function

function motion4(num, N) {
  var circle1_2 = [0.9, 0.1, 0.2, 0.4, 0.2, 1.6, 1.4, 1.0, 0.3, 0.2];
  var circle2_2 = circle1_2;

  var count1_2 = 1;
  var count2_2 = 1;
  var m_s_2 = circle1_2[num];
  var m_s0_2 = circle2_2[num];
  var m_s1_2 = m_s_2 / 0.2;
  var m_s2_2 = m_s0_2 / 0.2;

  count = 0;
  move_true = false;

  var gridWidth = chartWidth - margin.left - margin.right; // Width of the grid area
  var gridHeight = chartHeight - margin.top - margin.bottom; // Height of the grid area

  var maxCellSize = Math.min(gridWidth, gridHeight) / 10; // Determine the maximum cell size for N = 10
  var cellSize = maxCellSize; // Use this as the fixed cell size for all values of N

  var totalGridWidth = cellSize * N;
  var totalGridHeight = cellSize * N;

  var translateX = (chartWidth - totalGridWidth) / 2;
  var translateY = (chartHeight - totalGridHeight) / 2;
  svg.attr("transform", "translate(" + translateX + "," + translateY + ")");

  var circle_data_2 = [];
  var angle_data_2 = [];
  var box_data_2 = [];

  // Generate circle, angle, and box data based on grid size N
  for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      var cx = (j + 0.5) * cellSize; // X position of circle center
      var cy = (i + 0.5) * cellSize; // Y position of circle center
      var Values = [1,2,4,1,1,1,1,1,,1,1,1,1,1,1,1,1,1,1]
      var value = Values[i * N + j]; // Get the value from the array based on the circle's index


      circle_data_2.push({
        x: cx,
        y: cy,
        id: i * N + j + 1,
        r_diff: 0.13,
        radius: (cellSize / 2) * (value / 5), // Adjust the radius based on cell size
        move: 0,
        value: value
      });


      
      angle_data_2.push({
        x: cx,
        y: cy,
        id: i * N + j + 1,
        startAngle: Values[value] // Convert angle to radians, Add this "* (Math.PI / 180")
      });

      box_data_2.push({
        x: j * cellSize,
        y: i * cellSize,
        h: cellSize,
        w: cellSize
      });
    }
  }

  

// Create arrow markers
svg
.append("defs")
.append("marker")
.attr("id", "arrowhead")
.attr("refX", 0) // Set refX to half of the cell size
.attr("refY", 3)
.attr("markerWidth", 30)
.attr("markerHeight", 30)
.attr("orient", "auto")
.append("path")
.attr("d", "M 0,0 V 6 L9,3 Z")
.attr("fill", "black");

// Function to add an arrow to a specific cell
function addArrow(row, col) {
var cellSize = maxCellSize ;
var cx = (col + 0.5) * cellSize;
var cy = (row + 0.5) * cellSize;
var circleRadius = circle_data_2[row * N + col].radius; // Get the circle's radius

// Define the endpoint for the arrow (the middle of the outside border)
var arrowStartX, arrowStartY, arrowEndX, arrowEndY;

if (col === 0) {
  arrowStartX = -cellSize / 2;
  arrowEndX = cx - circleRadius - 20; // Adjusted to avoid overlap with circle
} else if (col === N - 1) {
  arrowStartX = totalGridWidth + cellSize / 2;
  arrowEndX = cx + circleRadius + 20; // Adjusted to avoid overlap with circle
} else {
  arrowStartX = arrowEndX = cx;
}

if (row === 0) {
  arrowStartY = -cellSize / 2;
  arrowEndY = cy - circleRadius - 20; // Adjusted to avoid overlap with circle
} else if (row === N - 1) {
  arrowStartY = totalGridHeight + cellSize / 2;
  arrowEndY = cy + circleRadius + 20; // Adjusted to avoid overlap with circle
} else {
  arrowStartY = arrowEndY = cy;
}



  var box_2 = svg
    .selectAll(".rect")
    .data(box_data_2)
    .enter()
    .append("rect")
    .attr("class", "rect")
    .style("fill", "white")
    .attr("stroke", "black")
    .attr("stroke-width", 0.5)
    .attr("x", function(d) {
      return d.x;
    })
    .attr("y", function(d) {
      return d.y;
    })
    .attr("height", function(d) {
      return d.h;
    })
    .attr("width", function(d) {
      return d.w;
    });

  var angles_2 = svg
    .selectAll(".path")
    .data(angle_data_2)
    .enter()
    .append("path")
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    })
    .attr("d", d3.arc()
      .innerRadius(0)
      .outerRadius(cellSize / 2 - 10) // Adjust the outerRadius based on cell size
      .startAngle(function(d) {
        return d.startAngle;
      })
      .endAngle(1.5708)
    )
    .attr("fill", "none")
    .attr('stroke', 'black');





  // Add an arrow line
  svg
  .append("line")
  .attr("x1", arrowStartX)
  .attr("y1", arrowStartY)
  .attr("x2", arrowEndX)
  .attr("y2", arrowEndY)
  .attr("stroke", "black")
  .attr("stroke-width", 1.5)
  .attr("marker-end", "url(#arrowhead)");
  }

  // Add arrows to cells [0, 2] and [2, 2]
  addArrow(2, 0);
  addArrow(0, 1);



  move_true = true;
  console.log("angle");
  console.log(chartWidth);
  console.log(chartHeight);

  texts_2.attr("x", function(d) {
    return d.x;
  })
  .attr("y", function(d) {
    return d.y;
  });


  

  function animate_2(elapsed) {
    circles_2
      .attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      })
      .attr("r", function(d) {
        return d.radius;
      });
    return timer_ret_val;
  }
}