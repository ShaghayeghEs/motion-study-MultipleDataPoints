import { arrayToMatrix, shuffleArray, selectDistArray, selectCorrectMatchAnswer} from './core.js';

var iCell1 = 0;
var jCell1 = 0;
var iCell2 = 0;
var jCell2 = 0;

//Measures without header
//pre: 18 (with header)
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
// var N = 10; // test
var task = url_data["task"]; // type of task
let cellHeights = [];
let cellHeights1D = [];
let participantAnswer;
let correctAnswer;
let error; // when error is 0, the correct answer has been selected
let count = 0;
let selectedRect = null; // To keep track of the selected circle

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

  cellHeights = selectDistArray(dist,N,ratio_value,"gen");
  console.log("original array: " + cellHeights); //test
  
  var outputs = shuffleArray(cellHeights,task,ratio_value,N,dist,"gen"); //shuffling the data array based on the given task
  cellHeights = outputs[0];
  cellHeights1D = cellHeights;

  iCell1 = outputs[1];
  jCell1 = outputs[2];
  iCell2 = outputs[3];
  jCell2 = outputs[4];
  // iCell1 = 1;
  // jCell1 = 0;
  // iCell2 = 0;
  // jCell2 = 5;

  console.log("shuffled array: " + cellHeights); //test
  
  cellHeights = arrayToMatrix(cellHeights, N); //convert the data 1D array to a matrix
  console.log("array in a matrix: " + cellHeights); //test
  
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
      var arrayValue = cellHeights[i][j]; // Added by Shae
      // console.log("arrayValue is: " + arrayValue);
      
      box_data_2.push({
        x: j * cellSize,
        y: i * cellSize,
        h: cellSize,
        w: cellSize,
        cellHeights: cellHeights[i][j],
        arrayValue: arrayValue, //Added by Shae
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
      // .attr("fill", "#white");
  
    // Create a border rectangle for the cell
    cellGroup.append("rect")
      .attr("class", "cell-border")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", d.w)
      .attr("height", d.h)
      .attr("stroke", "black")
      .attr("stroke-width", 0.5)
      // .attr("stroke-width", 0) //removing cell borders
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

    cells.on("click", function(d, i) {
      // Check if the clicked cell is the one to be disabled (task: match)
      if ((task == "match" && i === iCell1 * N + jCell1) || task == "compare") {
        return; // Do nothing for the disabled cell
      }
      var parentCellGroup = d3.select(this).node();
      var borderRect = d3.select(parentCellGroup).select(".cell-border").node();
      let correspondingRectValue = d.arrayValue;
      console.log("clicking on the box: correspondingRectValue: " + correspondingRectValue);
      handleHighlight(borderRect, correspondingRectValue);
    });
    

    function handleHighlight(clickedElem, elemValue) {
      console.log("elem value: " + elemValue);
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

        //increasing the number of participant's click so far
        count++;
        // console.log("count: " + count);

        //participant's answer (value)
        participantAnswer = elemValue;
        // console.log("participant's answer: " + participantAnswer);
      }
    }

    
    function addArrow(row, col, label, N, cellSize, svg) {
      if (N == 3) {
        // Calculate the middle point of the cell
        var edgeMidX = (col + 0.5) * cellSize;
        var edgeMidY = (row + 0.5) * cellSize;
    
        // Initialize arrow start and end points
        var arrowStartX, arrowStartY, arrowEndX, arrowEndY;
    
        // Case 1: Top-left corner cell
        if (row === 0 && col === 0) {
          arrowStartX = -cellSize / 2 ;
          arrowStartY = -cellSize / 2 ;
          arrowEndX = -cellSize / 4 + 17 ;
          arrowEndY = -cellSize / 4 + 10;
        }
        // Case 2: Bottom-left corner cell
        else if (row === N - 1 && col === 0) {
          arrowStartX = -cellSize / 2 ;
          arrowStartY = -cellSize / 2 + 4 * cellSize ;
          arrowEndX = -cellSize / 2 + 40;
          arrowEndY = -cellSize/ 2 + 3.45 * cellSize + 17;
        }
        // Case 3: Bottom-right corner cell
        else if (row === N - 1 && col === N - 1) {
          arrowStartX = cellSize * 3.6 ;
          arrowStartY = -cellSize / 2 + 4 * cellSize ;
          arrowEndX = -cellSize / 4 + 45 + 3 * cellSize;
          arrowEndY = -cellSize/ 2 + 3.45 * cellSize + 17;
        }
        // Case 4: Top-right corner cell
        else if (row === 0 && col === N - 1) {
          arrowStartX = cellSize * 3.6 ;
          arrowStartY = -cellSize / 2 ;
          arrowEndX = -cellSize / 4 + 45 + 3 * cellSize;
          arrowEndY = -cellSize / 4 + 10;
        }

        // Default case: Straight arrow to the middle of the cell
        else {
          // Top edge
          if (row === 0) {
            arrowStartX = edgeMidX+10;
            arrowStartY = -cellSize +20;
            arrowEndX = edgeMidX+10;
            arrowEndY = -20;
          }
          // Bottom edge
          else if (row === N - 1) {
            arrowStartX = edgeMidX +10;
            arrowStartY = N * cellSize + cellSize -20;
            arrowEndX = edgeMidX +10;
            arrowEndY = N * cellSize + 20;
          }
          // Left edge
          else if (col === 0) {
            arrowStartX = -cellSize + 30;
            arrowStartY = edgeMidY ;
            arrowEndX = -10;
            arrowEndY = edgeMidY ;
          }
          // Right edge
          else if (col === N - 1) {
            arrowStartX = N * cellSize + cellSize -20;
            arrowStartY = edgeMidY;
            arrowEndX = N * cellSize +30;
            arrowEndY = edgeMidY;
          }
        }
        
        if (task == "compare" || task == "match") {
          // Add the arrow line
          svg.append("line")
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
    
          // Add the label for the arrow
          // svg.append("text")
          //   .attr("x", arrowEndX)
          //   .attr("y", arrowEndY - 13) // Adjust label position relative to the arrow end
          //   .attr("text-anchor", "middle")
          //   .attr("fill", "black")
          //   .text(label);

          svg
          .append("text")
          .attr("x", X)
          .attr("y", Y)
          .attr("text-anchor", textAnchor)
          .attr("fill", "black")
          .text(label);

        }
      }
      else if (N == 10) {
        // Calculate the middle point of the cell
        var edgeMidX = (col + 0.5) * cellSize;
        var edgeMidY = (row + 0.5) * cellSize;
    
        // Initialize arrow start and end points
        var arrowStartX, arrowStartY, arrowEndX, arrowEndY;
    
        // Case 1: Top-left corner cell
        if (row === 0 && col === 0) {
          arrowStartX = -cellSize / 2 ;
          arrowStartY = -cellSize / 2 ;
          arrowEndX = -cellSize / 4 + 17 ;
          arrowEndY = -cellSize / 4 + 10;
        }
        // Case 2: Bottom-left corner cell
        else if (row === N - 1 && col === 0) {
          arrowStartX = -cellSize / 2 ;
          arrowStartY = -cellSize / 2 + 4 * cellSize + 7 * cellSize;
          arrowEndX = -cellSize / 2 + 40;
          arrowEndY = -cellSize/ 2 + 3.45 * cellSize + 17 + 7 * cellSize;
        }
        // Case 3: Bottom-right corner cell
        else if (row === N - 1 && col === N - 1) {
          arrowStartX = cellSize * 3.6 + 7 * cellSize;
          arrowStartY = -cellSize / 2 + 4 * cellSize + 7 * cellSize;
          arrowEndX = -cellSize / 4 + 45 + 3 * cellSize+ 7 * cellSize;
          arrowEndY = -cellSize/ 2 + 3.45 * cellSize + 17+ 7 * cellSize;
        }
        // Case 4: Top-right corner cell
        else if (row === 0 && col === N - 1) {
          arrowStartX = cellSize * 3.6 + 7 * cellSize ;
          arrowStartY = -cellSize / 2 ;
          arrowEndX = -cellSize / 4 + 45 + 3 * cellSize + 7 * cellSize;
          arrowEndY = -cellSize / 4 + 10;
        }

        // Default case: Straight arrow to the middle of the cell
        else {
          // Top edge
          if (row === 0) {
            arrowStartX = edgeMidX+10;
            arrowStartY = -cellSize +20;
            arrowEndX = edgeMidX+10;
            arrowEndY = -20;
          }
          // Bottom edge
          else if (row === N - 1) {
            arrowStartX = edgeMidX +10;
            arrowStartY = N * cellSize + cellSize -20;
            arrowEndX = edgeMidX +10;
            arrowEndY = N * cellSize + 20;
          }
          // Left edge
          else if (col === 0) {
            arrowStartX = -cellSize + 30;
            arrowStartY = edgeMidY ;
            arrowEndX = -10;
            arrowEndY = edgeMidY ;
          }
          // Right edge
          else if (col === N - 1) {
            arrowStartX = N * cellSize + cellSize -20;
            arrowStartY = edgeMidY;
            arrowEndX = N * cellSize +30;
            arrowEndY = edgeMidY;
          }
        }

        if (task == "compare" || task == "match") {
          // Add the arrow line
          svg.append("line")
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
          
          // Add the label for the arrow
          // svg.append("text")
          // .attr("x", arrowEndX)
          // .attr("y", arrowEndY - 13) // Adjust label position relative to the arrow end
          // .attr("text-anchor", "middle")
          // .attr("fill", "black")
          // .text(label);

          svg
          .append("text")
          .attr("x", X)
          .attr("y", Y)
          .attr("text-anchor", textAnchor)
          .attr("fill", "black")
          .text(label);
        }
        
      }
    }

  // Create arrows for specific cells
  addArrow(iCell1, jCell1, "A", N, cellSize, svg);
  // addArrow(0, N - 1, "A");
  if (task == "compare") {
    addArrow(iCell2, jCell2, "B", N, cellSize, svg);
    // addArrow(N - 1, 0, "B");
  }
}

if (task == "compare") {
  var slider = document.getElementById("value2");
  var output = document.getElementById("demo");
  output.innerHTML = slider.value;

  slider.oninput = function() {
    output.innerHTML = this.value;
  };
}

var btn = document.getElementById("submit");

// Add an event listener to the submit button
btn.addEventListener("click", function() {
  btn.disabled = true;

  //preparing participant answer before logging
  if (task == "compare") {
    console.log("in the if for calculating answer for compare");
    // console.log("slider.value is: " + slider.value)
    participantAnswer = slider.value;
    correctAnswer = ratio_value; 
  } else if (task != "compare" && selectedRect === null) {
    alert("Please select an answer before proceeding.");
    btn.disabled = false; // Enable the button to allow the participant to select an answer
    return; // Stop further execution
  } else {
    if (task == "match") {
      console.log("in the if for calculating answer for match");
      participantAnswer = participantAnswer;
      console.log("participant answer: " + participantAnswer);
      correctAnswer = selectCorrectMatchAnswer(dist, N, ratio_value,"gen");
      console.log("correct answer: " + correctAnswer);
    } else if (task == "max") {
      console.log("in the if for calculating answer for max");
      participantAnswer = participantAnswer;
      correctAnswer = Math.max(...cellHeights1D);
    } else if (task == "min") {
      console.log("in the if for calculating answer for min");
      participantAnswer = participantAnswer;
      correctAnswer = Math.min(...cellHeights1D);
    }
  }
  

  // console.log("participant's answer: " + participantAnswer);

  error = correctAnswer - participantAnswer;
  let timeSpentOnPage = TimeMe.getTimeOnCurrentPageInSeconds();
  postMessage(timeSpentOnPage);
});

const participantId = localStorage.getItem('participantId');

function postMessage(timeSpentOnPage) {
  // Initialize selection_count with "N/A" if the task is "compare", otherwise use the value of count
  var selectionCountValue = task === "compare" ? "N/A" : count;

  var dataToSend = {
    participant_id: participantId,
    type_of_encoding: "length",
    grid_size: parseInt(N),
    task: task,
    distribution: dist,
    ratio: parseFloat(ratio_value),
    trial_number: parseInt(url_data["trial"]),
    time_spent: timeSpentOnPage,
    participant_answer: parseFloat(participantAnswer),
    correct_answer: parseFloat(correctAnswer),
    error: parseFloat(error),
    selection_count: selectionCountValue,
    spaceKey_count: "N/A"
  };

  $.ajax({
    type: "POST",
    url: "../json.php",
    data: JSON.stringify(dataToSend),
    contentType: "application/json",
    success: function(response) {
      console.log("Data sent successfully:", response);
      window.top.load_page();
    },
    error: function(error) {
      console.error("Error sending data:", error);
      // You may want to handle the error here, e.g., by displaying an error message to the user.
    },
  });
}