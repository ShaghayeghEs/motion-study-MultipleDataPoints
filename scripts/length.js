import { arrayToMatrix, shuffleArray, selectDistArray} from './core.js';

var iCell1 = 0;
var jCell1 = 0;
var iCell2 = 0;
var jCell2 = 0;

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

var N = url_data["size"]; // size of the grid
var dist = url_data["dist"]; // distribution of data points
var ratio_value = url_data["ratio"]; // ratio for compare task, value for max/min
// var N = 3; // test
var task = url_data["task"]; // type of task

//TEST
console.log(N, task, dist, ratio_value);
drawLengthGraph(N); // Pass the N value to the function


function drawLengthGraph(N) {
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

  var cellHeights = selectDistArray(dist,N,ratio_value,"gen");
  console.log("original array"); //test
  console.log(cellHeights); //test
  
  var outputs = shuffleArray(cellHeights,task,ratio_value,N,dist,"gen"); //shuffling the data array based on the given task
  cellHeights = outputs[0];
  iCell1 = outputs[1];
  jCell1 = outputs[2];
  iCell2 = outputs[3];
  jCell2 = outputs[4];
  console.log("shuffled array"); //test
  console.log(cellHeights); //test
  // cellHeights = mapValues(cellHeights, Math.min(...cellHeights), Math.max(...cellHeights),5,(maxCellSize - 4.7)); //map the data array to the encoding max and min
  //console.log("max cell size" + (maxCellSize));
  // cellHeights = mapValues(cellHeights, 5, (maxCellSize - 4.7));
  // console.log("mapped array is: " + cellHeights);
  cellHeights = arrayToMatrix(cellHeights, N); //convert the data 1D array to a matrix
  console.log("array in a matrix"); //test
  console.log(cellHeights); //test
  
  // Specify the height values for each bar chart in the format [h1, h2, h3, ...]
  // var cellHeights = [
  //   [5, 85, 15, 20, 25, 30, 40, 50, 60, 70],
  //   [5, 10, 15, 20, 25, 30, 40, 50, 60, 70],
  //   [5, 10, 15, 20, 25, 30, 40, 50, 60, 70],
  //   [5, 10, 15, 20, 25, 30, 40, 50, 60, 70],
  //   [5, 10, 15, 20, 25, 30, 40, 50, 60, 70],
  //   [5, 10, 15, 20, 25, 30, 40, 50, 60, 70],
  //   [5, 10, 15, 20, 25, 30, 40, 50, 60, 70],
  //   [5, 10, 15, 20, 25, 30, 40, 50, 60, 70],
  //   [5, 10, 15, 20, 25, 30, 40, 50, 60, 70],
  //   [5, 10, 15, 20, 25, 30, 40, 50, 60, 70],
  //   // Add more rows of heights here...
  // ];
  // Generate box data based on grid size N
  for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      box_data_2.push({
        x: j * cellSize,
        y: i * cellSize,
        h: cellSize,
        w: cellSize,
        cellHeights: cellHeights[i][j]
      });
    }
  }
  var paddingLR = 10; // Define paddingLR at a higher scope to make it accessible

  // Function to draw a cell with a vertical bar chart
  function drawCellWithBarChart(d) {
    var cell = d3.select(this);
  
    // Calculate the adjusted width of the bar chart within the cell
    var barWidth = d.w - 7 * paddingLR; //changed by Shae from 2 to 7 to make the bar width narrower
  
    // Create a group element for the cell
    var cellGroup = cell.append("g")
      .attr("class", "cell-group")
      .attr("transform", "translate(" + (d.x + paddingLR) + "," + d.y + ")"); // Adjusted x-coordinate
  
    // Create a single rectangle for the bar chart
    cellGroup.append("rect")
      .attr("class", "bar")
      .attr("x", 3.5 * paddingLR) // Adjusted x-coordinate   //Shae: Added 3.5 to make the bar charts centered
      .attr("y", d.h - d.cellHeights) // Adjusted y-coordinate
      .attr("width", barWidth)
      .attr("height", d.cellHeights) // Adjusted height
      .attr("fill", "#008fb3");
  
    // Create a border rectangle for the cell
    cellGroup.append("rect")
      .attr("class", "cell-border")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", d.w)
      .attr("height", d.h)
      .attr("stroke", "black")
      .attr("stroke-width", 0.5)
      .attr("fill", "transparent");
  }
  
  // Create a cell for each item in box_data_2 with a vertical bar chart
  var cells = svg.selectAll(".cell")
    .data(box_data_2)
    .enter()
    .append("g")
    .attr("class", "cell")
    .each(drawCellWithBarChart);
    
  // Create arrow markers
  // if (task == "compare") {
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
  // }

    var selectedRect = null; // To keep track of the selected circle

    cells.on("click", function(d, i) {
      var parentCellGroup = d3.select(this).node();
      var borderRect = d3.select(parentCellGroup).select(".cell-border").node();
      handleHighlight(borderRect);
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

    
  // Function to add an arrow to a specific cell
  function addArrow(row, col, label) {
    var cellSize = maxCellSize;
    var cx = (col + 0.5) * cellSize;
    var cy = (row + 0.5) * cellSize;
  
    // Define a fixed arrow length
    var arrowLength = cellSize / 2; // Adjust this value for arrow length
  
    // Calculate arrow endpoints based on the center of the cell
    var arrowStartX, arrowStartY, arrowEndX, arrowEndY;

    if (col === 0) {
      arrowStartX = -cellSize / 2;
      arrowEndX = cx - arrowLength;
    } else if (col === N - 1) {
      arrowStartX = totalGridWidth + cellSize / 2;
      arrowEndX = cx + arrowLength;
    } else {
      arrowStartX = arrowEndX = cx;
    }
  
    if (row === 0) {
      arrowStartY = -cellSize / 2;
      arrowEndY = cy - arrowLength ;
    } else if (row === N - 1) {
      arrowStartY = totalGridHeight + cellSize / 2;
      arrowEndY = cy + arrowLength;
    } else {
      arrowStartY = arrowEndY = cy;
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
  // Create arrows for specific cells
  addArrow(iCell1, jCell1, "A");
  // addArrow(0, N - 1, "A");
  if (task == "compare") {
    addArrow(iCell2, jCell2, "B");
    // addArrow(N - 1, 0, "B");
  }
}