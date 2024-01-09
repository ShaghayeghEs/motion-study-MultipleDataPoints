import { selectDistArray, shuffleArray, multiplyArrayElements, selectCorrectMatchAnswer} from "./core.js";

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
var animationStopped = false;

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

let N = url_data["size"];
// let N = 3;
let task = url_data["task"];
// let task = "max";
let ratio_value = url_data["ratio"];
// let ratio_value = 1.5;
let dist = url_data["dist"];
// let dist = "uniform";
let participantId = url_data["id"];
// var speeds = [50, 25, 1]; // Define the speeds array (you can adjust these values)
let speeds = [];
let participantAnswer;
let correctAnswer;
let error; // when error is 0, the correct answer has been selected
let count = 0;
let clickCount = 0;
var selectedRect = null; // To keep track of the selected circle

var circles_2; // Declare circles_2 as a global variable
var borders; // Declare borders as a global variable to maintain cell borders

speeds = selectDistArray(dist, N, ratio_value, "expansion");
console.log("original array: " + speeds);

speeds = shuffleArray(speeds, task, ratio_value, N, dist, "expansion");

cell1_i = speeds[1];
cell1_j = speeds[2];
cell2_i = speeds[3];
cell2_j = speeds[4];
  
speeds = speeds[0];
console.log("after shuffling: " + speeds);

drawExpansionGraph(N, speeds); // Pass the N value to the function

function drawExpansionGraph(N, speeds) {
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
  
  // speeds = selectDistArray(dist, N, ratio_value, "expansion");
  // console.log(speeds);

  // speeds = shuffleArray(speeds, task, ratio_value, N, dist, "expansion");
  // console.log("speeds");
  // console.log(speeds);

  // cell1_i = speeds[1];
  // cell1_j = speeds[2];
  // cell2_i = speeds[3];
  // cell2_j = speeds[4];
  
  // speeds = speeds[0];
  // console.log("after shuffling");
  // console.log(speeds);

  // speeds = multiplyArrayElements(speeds, 4);

  // console.log("after multiplying");
  // console.log(speeds);

  // Flag to control animation
  // Generate circle data based on grid size N
  for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      var cx = (j + 0.5) * cellSize; // X position of circle center
      var cy = (i + 0.5) * cellSize; // Y position of circle center

      var colors = ["#008fb3"]; // Add more colors if needed
      var arrayValue = speeds[i * N + j]; // Added by Shae
      // console.log("array value: " + arrayValue);
      // console.log("speed: " + speeds[(i * N + j) % speeds.length]);

      circle_data_2.push({
        x: cx,
        y: cy,
        id: i * N + j + 1,
        r_diff: 0.13,
        currentRadius: cellSize / 5,
        move: 0,
        color: colors[i % colors.length], // Store the color for each circle
        speed: speeds[(i * N + j) % speeds.length],  // Assigning speed to each circle
        arrayValue: arrayValue //Added by Shae
      });

      box_data_2.push({
        x: j * cellSize,
        y: i * cellSize,
        h: cellSize,
        w: cellSize,
        arrayValue: arrayValue //Added by Shae
      });
    }
  }

  // Create borders for cells
  borders = svg
    .selectAll(".rect")
    .data(box_data_2)
    .enter()
    .append("rect")
    .attr("class", "rect clickable")
    .style("fill", "transparent")
    .attr("stroke", "black")
    .attr("stroke-width", 0)
    .attr("x", function (d) {
      return d.x;
    })
    .attr("y", function (d) {
      return d.y;
    })
    .attr("height", function (d) {
      return d.h;
    })
    .attr("width", function (d) {
      return d.w;
    });

  circles_2 = svg
    .selectAll(".circle") // Assign to the global variable
    .data(circle_data_2)
    .enter()
    .append("circle")
    .attr("class", "circle clickable")
    .attr("r", 8) // Set the fixed radius value to 8
    .attr("fill", function (d) {
      return d.color; // Use the stored color value
    })
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    });

  borders.on("click", function(d, i) {
    // Check if the clicked cell is the one to be disabled (task: match)
    if ((task == "match" && i === cell1_i * N + cell1_j) || task == "compare" || animationStopped) {
      return; // Do nothing for the disabled cell
    }
    let correspondingRectValue = d.arrayValue;
    console.log("clicking on the box: correspondingRectValue: " + correspondingRectValue);
    handleHighlight(this,correspondingRectValue);
  });
    
  circles_2.on("click", function(d, i) {
    // Check if the clicked cell is the one to be disabled (task: match)
    if ((task == "match" && i === cell1_i * N + cell1_j) || task == "compare" || animationStopped) {
      return; // Do nothing for the disabled cell
    }
    var cellIndex = d.id - 1; // Adjust the index to match the box_data_2 array
    var correspondingRect = borders.nodes()[cellIndex];
    let correspondingRectValue = d.arrayValue;
    console.log("clicking on the box: correspondingRectValue: " + correspondingRectValue);
    handleHighlight(correspondingRect, correspondingRectValue);
  });

  function handleHighlight(clickedElem, elemValue) {
    console.log("elem value: " + elemValue);
    if (selectedRect === clickedElem) {
      // If the same cell is clicked again, unselect it
      d3.select(clickedElem).attr("stroke", "black").attr("stroke-width", 0);
      selectedRect = null;
    } else {
      // Unselect the previously selected cell (if any)
      if (selectedRect) {
        d3.select(selectedRect).attr("stroke", "black").attr("stroke-width", 0);
      }
      // Highlight the corresponding cell border
      // d3.select(clickedElem).attr("stroke", "red").attr("stroke-width", 2);
      d3.select(clickedElem).attr("stroke", "#ff3232").attr("stroke-width", 4);
      selectedRect = clickedElem;

      //increasing the number of participant's click so far
      clickCount++;

      //participant's answer (value)
      participantAnswer = elemValue;
      // console.log("participant's answer: " + participantAnswer);
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

        //expansion version
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

        //expansion version
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
  }
  
  if (count == 0) {
    console.log("in the KAZAEI IF");
    // Add arrows to cells
    addArrow(cell1_i, cell1_j, "A", N, cellSize, svg);
    // addArrow(0, N - 1, "A");
    if (task == "compare") {
      addArrow(cell2_i, cell2_j, "B", N, cellSize, svg);
      // addArrow(N - 1, 0, "B");
    }
  }
  
  // Initialize the "expanding" property for circles
  circles_2.each(function (d) {
    d.expanding = true;
  });

  // Start the animation
  animate();  
}

var animationTimer; // Global variable to hold the animation timer reference

function animate() {
  var maxSpeed = Math.max(...speeds);
  console.log("max speed: " + maxSpeed);

  animationTimer = d3.timer(function (elapsed) {
    if (animationStopped) {
      animationTimer.stop(); // Stop the animation timer
      return;
    }

    circles_2.each(function (d) {
      var circle = d3.select(this);
      var speedFactor = d.speed; // Use the speed from the circle's data
      // console.log("speed factor: " + d.speed);

      // Calculate the adjusted duration based on speedFactor and the maximum speed
      var adjustedDuration = 500 / (speedFactor / maxSpeed); //By changing "500", we can control the overall speed of expansion, previpusly it was 1000.

      var progress = (elapsed % adjustedDuration) / adjustedDuration;

      if (progress <= 0.5) {
        circle.attr("r", d.currentRadius * (1 + progress * 2));
      } else {
        circle.attr("r", d.currentRadius * (3 - progress * 2));
      }
    });
  });
}

// // Start the animation when your visualization is ready
// animate(); //Commented by Shae since this function has already been called
  //in the drowExpansionGraph function


// var stopButton = document.getElementById("stop");

function toggleAnimation() {
  animationStopped = !animationStopped;
  if (animationStopped) {
    // Hide circles and stop the animation
    circles_2.style("visibility", "hidden");
    if (animationTimer) animationTimer.stop();
  } else {
    // Show circles and restart the animation
    circles_2.style("visibility", "visible");
    animate(); // Restart the animation
    count++;
  }
}

window.onload = function() {
  // Focus the window on load
  window.focus();

  // Function to check focus and attach event listener
  function check_focus() {
    if (!document.hasFocus()) {
      window.focus();
    }

    document.addEventListener('keydown', function(e) {
      if (e.code === "Space") {
        e.preventDefault();  // Prevent default space key actions
        console.log("PRESSED");
        toggleAnimation();
      }
    });
  }

  // Call the check_focus function to set up the event listener
  check_focus();
};

// Handle the stop/resume button click event
// stopButton.onclick = function () {
//   toggleAnimation();
//   if (animationStopped) {
//     // If animation is stopped, remove all circles
//     circles_2.remove();
//   } else {
//     // If animation is resumed, recreate circles and start animation
//     count++;
//     drawExpansionGraph(N, speeds);
//   }
// };

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
      correctAnswer = selectCorrectMatchAnswer(dist, N, ratio_value,"motion");
      console.log("correct answer: " + correctAnswer);
    } else if (task == "max") {
      console.log("in the if for calculating answer for max");
      participantAnswer = participantAnswer;
      correctAnswer = Math.max(...speeds);
    } else if (task == "min") {
      console.log("in the if for calculating answer for min");
      participantAnswer = participantAnswer;
      correctAnswer = Math.min(...speeds);
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
  var selectionCountValue = task === "compare" ? "N/A" : clickCount;

  var dataToSend = {
    participant_id: participantId,
    type_of_encoding: "expansion",
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
    spaceKey_count: count
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