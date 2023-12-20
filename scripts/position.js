import { arrayToMatrix, shuffleArray, selectDistArray} from './core.js';

//Previous version measures (with header)
// var margin = {
//   top: 18,
//   left: 18,
//   bottom: 18,
//   right: 18
// };

//Measures without header
var margin = {
  top: 30,
  left: 30,
  bottom: 30,
  right: 30
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

var iCell1 = 0;
var jCell1 = 0;
var iCell2 = 0;
var jCell2 = 0;

// const N = 3; // Change N to the desired size of the grid
const N = url_data["size"]; // size of the grid
// const task = "compare";
const task = url_data["task"]; // type of task
// const ratio_value = 3;
const ratio_value = url_data["ratio"]; // ratio for compare task, value for max/min
// const dist = "right-skewed";
const dist = url_data["dist"]; // distribution of data points

drawPositionGraph(N); // Pass the N value to the function

function drawPositionGraph(N) {
  var circle_data_2 = [];
  var box_data_2 = [];

  var gridWidth = chartWidth - margin.left - margin.right; // Width of the grid area
  var gridHeight = chartHeight - margin.top - margin.bottom; // Height of the grid area

  var maxCellSize = Math.min(gridWidth, gridHeight) / 10; // Determine the maximum cell size for N = 10
  var cellSize = maxCellSize; // Use this as the fixed cell size for all values of N

  //DEBUG
  console.log("DEBUG: cell size is: " + cellSize);

  var totalGridWidth = cellSize * N;
  var totalGridHeight = cellSize * N;

  var translateX = (chartWidth - totalGridWidth) / 2;
  var translateY = (chartHeight - totalGridHeight) / 2;
  svg.attr("transform", "translate(" + translateX + "," + translateY + ")");

  // Define an array of arrays to store x positions for each row of cells
  let xPositions = selectDistArray(dist,N,ratio_value,"position");
  
  //DEBUG
  console.log("DEBUG: original array");
  console.log(xPositions);
  
  const outputs = shuffleArray(xPositions,task,ratio_value,N,dist,"position"); //shuffling the data array based on the given task
  
  iCell1 = outputs[1];
  jCell1 = outputs[2];
  iCell2 = outputs[3];
  jCell2 = outputs[4];

  xPositions = outputs[0];

  //DEBUG
  console.log("DEBUG: shuffled array");
  console.log(xPositions);

  xPositions = arrayToMatrix(xPositions, N); //convert the data 1D array to a matrix
  
  //DEBUG
  console.log("DEBUG: array in a matrix");
  console.log(xPositions);

  // Generate circle and box data based on grid size N
  for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      var cx = xPositions[i][j] + (cellSize * j)
      var cy = (i + 0.5) * cellSize; // Y position of circle center

      var radius = cellSize * 0.1; // Adjust the radius based on cell size

      var Values = [1]; // Set a constant value of 1 for all circles
      var value = Values[0]; // Get the value from the array (constant for all circles)

      circle_data_2.push({
        x: cx, // Use the specified x position
        y: cy,
        id: i * N + j + 1,
        radius: radius,
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
  function addArrow(row, col, label) {
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
        // d3.select(clickedElem).attr("stroke", "red").attr("stroke-width", 2);
        d3.select(clickedElem).attr("stroke", "#ff3232").attr("stroke-width", 4);
        selectedRect = clickedElem;
      }
    }

    if (task == "compare" || task == "match") {  
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

      // Determine text-anchor based on the value of row
      const textAnchor = row === 0 || row === N - 1 ? "end" : "middle";

      let X = row === 0 || row === N - 1 ? (arrowStartX + arrowEndX) / 2 - 7 : (arrowStartX + arrowEndX) / 2;
      if (col == N - 1 && (row == 0 || row == N -1)) {
        X = (arrowStartX + arrowEndX) / 2 + 12;
      } else if (col == 0 && (row == 0 || row == N -1)) {
        X = (arrowStartX + arrowEndX) / 2 + 8;        
      }

      let Y = row === 0 || row === N - 1 ? arrowEndY + 5 : (arrowStartY + arrowEndY) / 2 - 3;
      if (col == 0 && row == N - 1 ) {
        Y = (arrowStartY + arrowEndY) / 2 - 10;
      } else if (col == N - 1 && row == 0) {
        Y = (arrowStartY + arrowEndY) / 2 + 23;
      }
      // console.log ("X: " + X, "Y: " + Y);

      // Add a label
      svg
      .append("text")
      .attr("x", X)
      .attr("y", Y)
      .attr("text-anchor", textAnchor)
      .attr("fill", "black")
      .text(label);
    }
  }

  // Add arrows to cells
  addArrow(iCell1, jCell1, "A");
  // addArrow(0, N - 1, "A");
  if (task == "compare") {
    addArrow(iCell2, jCell2, "B");
    // addArrow(N - 1, 0, "B");
  }
}