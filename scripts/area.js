import { selectDistArray, shuffleArray } from "./core.js";

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

var cell1_i = 0;
var cell1_j = 0;
var cell2_i = 0;
var cell2_j = 0;

// var N = 10; // Change N to the desired size of the grid
var N = url_data["size"];
var task = url_data["task"];
var ratio_value = url_data["ratio"];
var dist = url_data["dist"];

drawAreaGraph(N); // Pass the N value to the function

function drawAreaGraph(N) {
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

  console.log("cell size:");
  console.log(cellSize);
  console.log("max number of the area data: " + ((Math.pow((cellSize/2) - 0.1, 2)))/10);
  console.log("min number of the area data: " + (1/1600 * ((Math.pow((cellSize/2) - 0.1, 2)))));
  
  var Values = [];
  Values = selectDistArray(dist, N, ratio_value,"area");
  console.log(Values);
  
  var outputs = shuffleArray(Values,task,ratio_value,N,dist,"area"); //shuffling the data array based on the given task
  console.log("outputs:");
  console.log(outputs);

  cell1_i = outputs[1];
  cell1_j = outputs[2];
  cell2_i = outputs[3];
  cell2_j = outputs[4];

  Values = outputs[0];
  console.log("after shuffling");
  console.log(Values);
  
  // Generate circle and box data based on grid size N
  for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      var cx = (j + 0.5) * cellSize; // X position of circle center
      var cy = (i + 0.5) * cellSize; // Y position of circle center

      // var radius = cellSize * 1; // Adjust the radius based on cell size

      // var Values = [165,1,20,40,80,160,20,30,40,80,40,20,60,20,40,30,20,40,10,20,30,40,80,10,2,3,4,8,4,2,6,2,4,3,2,4,1,2,3,4,8,1,2,3,4,8,4,2,6,2,4,3,2,4,1,2,3,4,8,1,2,3,4,8,4,2,6,2,4,3,2,4,1,2,3,4,8,1,2,3,4,8,4,2,6,2,4,3,2,4,1,2,3,4,8,1,2,3,4,8,4,2,6,2,4,3,2,4]; // Set a constant value of 5 for all circles
      var value = Values[i * N + j]; // Get the value from the array based on the circle's index

      circle_data_2.push({
        x: cx,
        y: cy,
        id: i * N + j + 1,
        r_diff: 0.13,
        radius: Math.sqrt(value * 10), //sqrt to make sure that the "area" is "ratio"-times bigger, not the radius.
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
  if (task == "compare") {
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
}

  // Add arrows to cells
  addArrow(cell1_i, cell1_j);
  addArrow(cell2_i, cell2_j);
}
