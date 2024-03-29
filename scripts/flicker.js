import { selectDistArray, shuffleArray, multiplyArrayElements, selectCorrectMatchAnswer } from "./core.js";

let speedArray = [];
let count = 0; //SpaceKey count
let circles;
let box_2;

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
var isAnimating = true;  // This flag will control whether the animation should run or not.
var animationTimer; // Global variable to hold the animation timer reference

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
let task = url_data["task"];
let ratio_value = url_data["ratio"];
let dist = url_data["dist"];
let participantId = url_data["id"];
let participantAnswer;
let correctAnswer;
let error; // when error is 0, the correct answer has been selected
let clickCount = 0;
let selectedRect = null; // To keep track of the selected circle

// Array of speeds for each circle
speedArray = selectDistArray(dist, N, ratio_value, "motion");
console.log("original array: " + speedArray);

var outputs = shuffleArray(speedArray,task,ratio_value,N,dist,"motion"); //shuffling the data array based on the given task

cell1_i = outputs[1];
cell1_j = outputs[2];
cell2_i = outputs[3];
cell2_j = outputs[4];

speedArray = outputs[0];
console.log("after shuffling: " + speedArray);

speedArray = multiplyArrayElements(speedArray, 4);
console.log("after multiplying: " + speedArray);

// N = 3;
// speedArray = [10000, 5, 7.5, 12.25, 15.3, 18.66, 20.71, 25.67, 28.55];
// speedArray = [3.34, 5, 7.5, 12.25, 15.3, 18.66, 20.71, 25.67, 28.55];
// speedArray = [10.02, 15, 22.5, 36.75, 45.9, 55.98, 62.13, 77.01, 85.65];
// speedArray = [13.36, 20, 30, 49, 61.2, 74.64, 82.84, 102.68, 114.2];

drawFlickerGraph(N, speedArray);

function drawFlickerGraph(N, speedArray) {
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

  circle_data_2.forEach(circle => {
    circle.timeout = null;  // Initialize with null
  });
  
  // Generate data for each cell in the grid
  for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      var cx = (j + 0.5) * cellSize; // X position of circle center
      var cy = (i + 0.5) * cellSize; // Y position of circle center

      let arrayValue = speedArray[i * N + j];
      var speed = (1 / speedArray[i * N + j]) * 50 * 150; // Get the speed value from the speedArray

      circle_data_2.push({
        id: i * N + j,
        cx: cx,
        cy: cy,
        radius: cellSize/3,
        flickering: true,
        color: "#008fb3",
        time: 0,
        speed: speed, // Different speed for each circle
        arrayValue: arrayValue
      });

      box_data_2.push({
        x: j * cellSize,
        y: i * cellSize,
        h: cellSize,
        w: cellSize,
        arrayValue: arrayValue
      });
    }
  }

  box_2 = svg
    .selectAll(".rect")
    .data(box_data_2)
    .enter()
    .append("rect")
    .attr("class", "rect")
    // .style("fill", "white")
    .style("fill", "transparent")
    .attr("stroke", "black")
    .attr("stroke-width", 0)
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

  circles = svg
    .selectAll(".circle")
    .data(circle_data_2)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("r", function(d) {
      return d.radius;
    })
    .attr("fill", function(d) {
      return d.color;
    })
    .attr("cx", function(d) {
      return d.cx;
    })
    .attr("cy", function(d) {
      return d.cy;
    });

  box_2.on("click", function(d, i) {
    // Check if the clicked cell is the one to be disabled (task: match)
    if ((task == "match" && i === cell1_i * N + cell1_j) || task == "compare" || !isAnimating) {
      return; // Do nothing for the disabled cell
    }
    let correspondingRectValue = d.arrayValue;
    console.log("clicking on the box: correspondingRectValue: " + correspondingRectValue);
    handleHighlight(this, correspondingRectValue);
  });

  circles.on("click", function(d, i) {
    // Check if the clicked cell is the one to be disabled (task: match)
    if ((task == "match" && i === cell1_i * N + cell1_j) || task == "compare" || !isAnimating) {
      return; // Do nothing for the disabled cell
    }
    var cellIndex = d.id ; // Adjust the index to match the box_data_2 array
    var correspondingRect = box_2.nodes()[cellIndex];
    let correspondingRectValue = d.arrayValue;
    console.log("clicking on the circle: correspondingRectValue: " + correspondingRectValue);
    handleHighlight(correspondingRect, correspondingRectValue);
  });

  function handleHighlight(clickedElem, elemValue) {
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
      // console.log("count: " + count);

      //participant's answer (value)
      participantAnswer = elemValue;
      console.log("participant's answer: " + participantAnswer);
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
    var cellSize = maxCellSize;
    var cx = (col + 0.5) * cellSize;
    var cy = (row + 0.5) * cellSize;
    var circleRadius = circle_data_2[row * N + col].radius; // Get the circle's current radius

    // Define the endpoint for the arrow (the middle of the outside border)
    var arrowStartX, arrowStartY, arrowEndX, arrowEndY;

    if (col === 0) {
      arrowStartX = -cellSize / 2;
      // console.log("cx is: " + cx);
      // console.log("circleRadius is: " + circleRadius);
      arrowEndX = cx - circleRadius - 15; // Adjusted to avoid overlap with circle
    } else if (col === N - 1) {
      arrowStartX = totalGridWidth + cellSize / 2;
      arrowEndX = cx + circleRadius + 15; // Adjusted to avoid overlap with circle
    } else {
      arrowStartX = arrowEndX = cx;
    }

    if (row === 0) {
      arrowStartY = -cellSize / 2;
      arrowEndY = cy - circleRadius - 15; // Adjusted to avoid overlap with circle
    } else if (row === N - 1) {
      arrowStartY = totalGridHeight + cellSize / 2;
      arrowEndY = cy + circleRadius + 15; // Adjusted to avoid overlap with circle
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

  if (count == 0) {
    // Add arrows to cells
    addArrow(cell1_i, cell1_j, "A");
    if (task == "compare") {
      addArrow(cell2_i, cell2_j, "B");
    }
  }

  animate();
}

function animate() {
  if (!isAnimating) return;  // If animation should not run, simply return
  circles.each(function(d) {
    var circle = d3.select(this);
    var flickering = d.flickering;

    if (flickering) {
      // Circle is on, make it disappear
      circle.style("opacity", 0);
      d.flickering = false;
    } else {
      // Circle is off, make it appear
      circle.style("opacity", 1);
      d.flickering = true;
    }
  });

  // document.getElementById("stop").addEventListener("click", function() {
  //   isAnimating = false;  // Set the flag to false to stop animation
  // });

  // Recursive call after a delay based on the speed of each circle
  circles.each(function(d) {
    var circle = d3.select(this);
    var speed = d.speed;
    setTimeout(function() {
      animateCircle(circle, speed);
    }, speed);
  });
}

function animateCircle(circle, speed) {
  if (!isAnimating) return;  // If animation should not run, simply return
// Clear the existing timeout if any
var currentData = circle.datum();
if (currentData.timeout) {
    clearTimeout(currentData.timeout);
}
  var flickering = circle.datum().flickering;

  if (flickering) {
    // Circle is on, make it disappear
    circle.style("opacity", 0);
    circle.datum().flickering = false;
  } else {
    // Circle is off, make it appear
    circle.style("opacity", 1);
    circle.datum().flickering = true;
  }

  // Set a new timeout and store its reference
  currentData.timeout = setTimeout(function() {
    animateCircle(circle, speed);
}, speed);
}

// var stopButton = document.getElementById("stop");
var animationStopped = false;

function toggleAnimation() {
  animationStopped = !animationStopped;
  if (animationStopped) {
      // Stop the animation and clear all timeouts
      circles.each(function() {
          var circle = d3.select(this);
          var currentData = circle.datum();
          if (currentData.timeout) {
              clearTimeout(currentData.timeout);
          }
      });
      circles.style("visibility", "hidden");
      if (animationTimer) animationTimer.stop();
  } else {
      // Restart the animation
      circles.style("visibility", "visible");
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
//   console.log("after toggling: isAnimating: " + isAnimating);
//   if (!isAnimating) {
//     console.log("STOP clicked!!!!");
//     // If animation is stopped, remove all circles
//     circles.remove();
//   } else {
//     console.log("resume clicked!!!!");
//     // If animation is resumed, recreate circles and start animation
//     count++;
//     drawFlickerGraph(N, speedArray);
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
      correctAnswer = selectCorrectMatchAnswer(dist, N, ratio_value,"motion") * 4;
      console.log("correct answer: " + correctAnswer);
    } else if (task == "max") {
      console.log("in the if for calculating answer for max");
      participantAnswer = participantAnswer;
      correctAnswer = Math.max(...speedArray);
    } else if (task == "min") {
      console.log("in the if for calculating answer for min");
      participantAnswer = participantAnswer;
      correctAnswer = Math.min(...speedArray);
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
    type_of_encoding: "flicker",
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