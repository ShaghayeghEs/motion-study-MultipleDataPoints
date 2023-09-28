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
  var circle_data_2 = [];
  var box_data_2 = [];

  var gridWidth = chartWidth - margin.left - margin.right; // Width of the grid area
  var gridHeight = chartHeight - margin.top - margin.bottom; // Height of the grid area

  var maxCellSize = Math.min(gridWidth, gridHeight) / 10; // Determine the maximum cell size for N = 10
  var cellSize = maxCellSize; // Use this as the fixed cell size for all values of N

  var totalGridWidth = cellSize * N;
  var totalGridHeight = cellSize * N;

  var translateX = (chartWidth - totalGridWidth) / 2;
  var translateY = (chartHeight - totalGridHeight) / 2;
  svg.attr("transform", "translate(" + translateX + "," + translateY + ")");

  // Define an array of arrays to store x positions for each row of cells
  var xPositions = [
    [50, 100, 200, 300, 350, 450, 500, 600, 680, 750], // Row 1
    [50, 100, 200, 300, 350, 450, 500, 600, 680, 750], // Row 2
    [50, 100, 200, 300, 350, 450, 500, 600, 680, 750], // Row 3
    [50, 100, 200, 300, 350, 450, 500, 600, 680, 750], // Row 4
    [50, 100, 200, 300, 350, 450, 500, 600, 680, 750], // Row 5
    [50, 100, 200, 300, 350, 450, 500, 600, 680, 750], // Row 6
    [50, 100, 200, 300, 350, 450, 500, 600, 680, 750], // Row 7
    [50, 100, 200, 300, 350, 450, 500, 600, 680, 750], // Row 8
    [50, 100, 200, 300, 350, 450, 500, 600, 680, 750], // Row 9
    [50, 100, 200, 300, 350, 450, 500, 600, 680, 750]  // Row 10
  ];

  // Generate circle and box data based on grid size N
  for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      var cx = xPositions[i][j]; // X position of circle center
      var cy = (i + 0.5) * cellSize; // Y position of circle center

      var radius = cellSize * 0.1; // Adjust the radius based on cell size

      var Values = [1]; // Set a constant value of 1 for all circles
      var value = Values[0]; // Get the value from the array (constant for all circles)

      circle_data_2.push({
        x: cx, // Use the specified x position
        y: cy,
        id: i * N + j + 1,
        r_diff: 0.13,
        radius: radius,
        move: 0,
        value: value
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
  .attr("class", "rect clickable") // Add 'clickable' class
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


// Add a class to the circles to make them clickable
var circles_2 = svg
  .selectAll(".circle")
  .data(circle_data_2)
  .enter()
  .append("circle")
  .attr("class", "circle clickable") // Add 'clickable' class
  .attr("r", function(d) {
    return d.radius; // Use the adjusted radius
  })
  .attr("fill", "#008fb3")
  .attr("cx", function(d) {
    return d.x;
  })
  .attr("cy", function(d) {
    return d.y;
  });

  var selectedRect = null; // To keep track of the selected circle

  box_2.on("click", function(d, i) {
    handleHighlight(this);
  });
  
  circles_2.on("click", function(d, i) {
    var cellIndex = d.id - 1; // Adjust the index to match the box_data_2 array
    var correspondingRect = box_2.nodes()[cellIndex];
    handleHighlight(correspondingRect);
  });

  function handleHighlight(clickedElem) {
    if (selectedRect === clickedElem) {
      // If the same cell is clicked again, unselect it
      d3.select(clickedElem).attr("stroke", "black").attr("stroke-width", 0.5);
      selectedRect = null;
    } else {
      // Unselect the previously selected cell (if any)
      if (selectedRect) {
        d3.select(selectedRect).attr("stroke", "black").attr("stroke-width", 0.5);
      }
      // Highlight the corresponding cell border
      d3.select(clickedElem).attr("stroke", "red").attr("stroke-width", 2);
      selectedRect = clickedElem;
    }
  }

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
  console.log("area");
}