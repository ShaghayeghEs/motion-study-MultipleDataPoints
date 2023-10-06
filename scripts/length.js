// var ID;
// var Value;
// var radio1;
// var radio2;
// var results_json = [];
// var current_elem = 0;
// var array_elem1 = 0;
// var array_elem2 = 0;
// var array_elem3 = 0;
// var motion_type = [1, 2, 3];
// var move_true;
// var count;
// var padding = 10;
// var timer_ret_val = false;

// // Generating a sample of data with a uniform distribution
// function generateUniformData(min, max, count) {
//   var data = [];
//   var step = (max - min) / (count - 1);
//   for (var i = 0; i < count; i++) {
//     data.push(min + step * i);
//   }
//   return data;
// }

// // Example usage:
// var min = 1;     // Minimum value
// var max = 100;   // Maximum value
// var count = 100;  // Number of data points
// var uniformData = generateUniformData(min, max, count);

// console.log(uniformData);

var uniform_3 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var uniform_10 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
   19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
    38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
     57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75,
      76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94,
       95, 96, 97, 98, 99, 100];

var leftSkewed_3 = [1.00, 1.00, 1.00, 1.01, 1.39, 2.43, 3.01, 6.03, 8.50];
// var leftSkewed_3 = [1.00, 1.20, 1.46, 1.95, 2.58, 3.99, 5.75, 7.32, 8.84]; //version 2
var leftSkewed_10 = [1.00, 1.00, 1.00, 1.00, 1.00, 1.01, 1.01, 1.01, 1.03, 1.04, 1.05, 1.09, 1.17, 1.21,
   1.23, 1.24, 1.26, 1.54, 1.57, 1.66, 1.69, 1.77, 1.78, 1.81, 1.90, 2.11, 2.31, 2.60, 3.12, 3.24, 3.48,
    3.94, 4.44, 4.50, 4.51, 4.98, 5.07, 5.77, 6.53, 6.78, 6.79, 7.08, 7.19, 7.34, 7.66, 9.91, 10.04,
     10.23, 10.91, 11.21, 11.88, 12.61, 14.46, 14.51, 14.78, 16.22, 17.04, 17.66, 19.15, 19.57, 20.46,
      25.80, 28.23, 28.48, 30.42, 31.36, 32.24, 32.73, 32.75, 33.83, 33.91, 35.09, 36.16, 38.62, 40.10,
       40.31, 41.60, 45.97, 46.50, 46.81, 47.65, 47.74, 48.67, 49.33, 50.43, 50.89, 53.68, 54.91, 59.60,
        62.48, 65.04, 65.28, 67.31, 70.65, 84.11, 92.31, 94.05, 97.25, 98.93, 99.28];

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

// var display1 = d3.select("#chart");
// var display2 = d3.select("#test");
// var display3 = d3.select("#ranger");
// var display4 = d3.select("#last");
// var display5 = d3.select("#notice");
// Added by Shae
// var display6 = d3.select("#test_difficulty");
// var display7 = d3.select("#ranger_difficulty");

var N = url_data["size"]; // Change N to the desired size of the grid

// drawLengthGraph(array_elem3, N); 
drawLengthGraph(N) // Pass the N value to the function

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

  // Specify the height values for each bar chart in the format [h1, h2, h3, ...]
  var cellHeights = [
    [5, 85, 15, 20, 25, 30, 40, 50, 60, 70],
    [5, 10, 15, 20, 25, 30, 40, 50, 60, 70],
    [5, 10, 15, 20, 25, 30, 40, 50, 60, 70],
    [5, 10, 15, 20, 25, 30, 40, 50, 60, 70],
    [5, 10, 15, 20, 25, 30, 40, 50, 60, 70],
    [5, 10, 15, 20, 25, 30, 40, 50, 60, 70],
    [5, 10, 15, 20, 25, 30, 40, 50, 60, 70],
    [5, 10, 15, 20, 25, 30, 40, 50, 60, 70],
    [5, 10, 15, 20, 25, 30, 40, 50, 60, 70],
    [5, 10, 15, 20, 25, 30, 40, 50, 60, 70],
    // Add more rows of heights here...
  ];
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
      .attr("fill", "none");
  }
  
  // Create a cell for each item in box_data_2 with a vertical bar chart
  var cells = svg.selectAll(".cell")
    .data(box_data_2)
    .enter()
    .append("g")
    .attr("class", "cell")
    .each(drawCellWithBarChart);
    
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
  function addArrow(row, col) {
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
  

// Create arrows for specific cells
addArrow(2, 0);
addArrow(0, 1);
  
  move_true = true;
  console.log("area");
}