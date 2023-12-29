import { arrayToMatrix, shuffleArray, selectDistArray, selectCorrectMatchAnswer} from './core.js';

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
let participantId = url_data["id"];
let xPositions = [];
let xPositions1D = [];
let participantAnswer;
let correctAnswer;
let error; // when error is 0, the correct answer has been selected
let count = 0;
let selectedRect = null; // To keep track of the selected circle

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
  xPositions = selectDistArray(dist,N,ratio_value,"position");
  
  //DEBUG
  console.log("DEBUG: original array: " + xPositions);
  
  const outputs = shuffleArray(xPositions,task,ratio_value,N,dist,"position"); //shuffling the data array based on the given task
  
  iCell1 = outputs[1];
  jCell1 = outputs[2];
  iCell2 = outputs[3];
  jCell2 = outputs[4];

  xPositions = outputs[0];
  xPositions1D = xPositions;

  //DEBUG
  console.log("DEBUG: shuffled array: " + xPositions);

  xPositions = arrayToMatrix(xPositions, N); //convert the data 1D array to a matrix
  
  //DEBUG
  console.log("DEBUG: array in a matrix");
  console.log(xPositions);

  // Generate circle and box data based on grid size N
  for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      var cx = xPositions[i][j] + (cellSize * j)
      // console.log("cx is: " + cx);
      var cy = (i + 0.5) * cellSize; // Y position of circle center
      var arrayValue = xPositions[i][j]; // Added by Shae
      // console.log("arrayValue is: " + arrayValue);
      var radius = cellSize * 0.1; // Adjust the radius based on cell size

      var Values = [1]; // Set a constant value of 1 for all circles
      var value = Values[0]; // Get the value from the array (constant for all circles)

      circle_data_2.push({
        x: cx, // Use the specified x position
        y: cy,
        id: i * N + j + 1,
        radius: radius,
        value: value,
        arrayValue: arrayValue, //Added by Shae
      });

      box_data_2.push({
        x: j * cellSize,
        y: i * cellSize,
        h: cellSize,
        w: cellSize,
        arrayValue: arrayValue, //Added by Shae
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

        //color label version
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

        //color label version
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

        svg
        .append("text")
        .attr("x", X)
        .attr("y", Y)
        .attr("text-anchor", textAnchor)
        .attr("fill", "black")
        .text(label);
      }
      
    }

    var box_2 = svg
      .selectAll(".rect")
      .data(box_data_2)
      .enter()
      .append("rect")
      .attr("class", "rect clickable") // Add 'clickable' class
      .style("fill", "transparent")
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

    box_2.on("click", function(d, i) {
      // Check if the clicked cell is the one to be disabled (task: match)
      if ((task == "match" && i === iCell1 * N + jCell1) || task == "compare") {
        return; // Do nothing for the disabled cell
      }
      let correspondingRectValue = d.arrayValue;
      console.log("clicking on the box: correspondingRectValue: " + correspondingRectValue);
      handleHighlight(this, correspondingRectValue);
    });
  
    circles_2.on("click", function(d, i) {
      // Check if the clicked cell is the one to be disabled (task: match)
      if ((task == "match" && i === iCell1 * N + jCell1) || task == "compare") {
        return; // Do nothing for the disabled cell
      }
      var cellIndex = d.id - 1; // Adjust the index to match the box_data_2 array
      var correspondingRect = box_2.nodes()[cellIndex];
      let correspondingRectValue = d.arrayValue;
      console.log("clicking on the circle: correspondingRectValue: " + correspondingRectValue);
      handleHighlight(correspondingRect, correspondingRectValue);
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
  }

  // Add arrows to cells
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
  }  else if (task != "compare" && selectedRect === null) {
    alert("Please select an answer before proceeding.");
    btn.disabled = false; // Enable the button to allow the participant to select an answer
    return; // Stop further execution
} else {
  if (task == "match") {
    console.log("in the if for calculating answer for match");
    participantAnswer = participantAnswer;
    console.log("participant answer: " + participantAnswer);
    correctAnswer = selectCorrectMatchAnswer(dist, N, ratio_value,"position");
    console.log("correct answer: " + correctAnswer);
  } else if (task == "max") {
    console.log("in the if for calculating answer for max");
    participantAnswer = participantAnswer;
    correctAnswer = Math.max(...xPositions1D);
  } else if (task == "min") {
    console.log("in the if for calculating answer for min");
    participantAnswer = participantAnswer;
    correctAnswer = Math.min(...xPositions1D);
  }
}

  // console.log("participant's answer: " + participantAnswer);

  error = correctAnswer - participantAnswer;
  let timeSpentOnPage = TimeMe.getTimeOnCurrentPageInSeconds();
  postMessage(timeSpentOnPage);
});

// const participantId = localStorage.getItem('participantId');

function postMessage(timeSpentOnPage) {
  // Initialize selection_count with "N/A" if the task is "compare", otherwise use the value of count
  var selectionCountValue = task === "compare" ? "N/A" : count;

  var dataToSend = {
    participant_id: participantId,
    type_of_encoding: "position",
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

  if(participantId != 0) {
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
  } else {
    window.location.href = `./practice_compare_vertical_motion.html`;
  }
}