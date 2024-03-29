import { selectDistArray, shuffleArray, multiplyArrayElements, selectCorrectMatchAnswer } from "./core.js";

let speeds = [];
let count = 0; //SpaceKey count
let circles;
let box_2;

//Measures without header
//pre: 18 (with header)
const margin = {
  top: 30,
  left: 30,
  bottom: 30,
  right: 30
};

const chartWidth = document.getElementById("chartContainer").offsetWidth - margin.left - margin.right;
const chartHeight = document.getElementById("chartContainer").offsetHeight - margin.top - margin.bottom;
// let timer_ret_val = false;
let animationStopped = false;

let svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", chartWidth)
  .attr("height", chartHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let cell1_i = 0;
let cell1_j = 0;
let cell2_i = 0;
let cell2_j = 0;

const N = url_data["size"];
// const N = 3;
const task = url_data["task"];
// const task = "compare";
const ratio_value = url_data["ratio"];
// const ratio_value = 3.5;
const dist = url_data["dist"];
// const dist = "left-skewed";
let participantId = url_data["id"];
let participantAnswer;
let correctAnswer;
let error; // when error is 0, the correct answer has been selected
let clickCount = 0;
let selectedRect = null; // To keep track of the selected circle

const gridWidth = chartWidth - margin.left - margin.right; // Width of the grid area
const gridHeight = chartHeight - margin.top - margin.bottom; // Height of the grid area

const maxCellSize = Math.min(gridWidth, gridHeight) / 10; // Determine the maximum cell size for N = 10
let cellSize = maxCellSize; // Use this as the fixed cell size for all values of N

let num = 0;
let circle1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let m_s = circle1[num];
let m_s1 = m_s / Math.max(...circle1); // Calculate the vertical movement factor dynamically
console.log("m_s1: " + m_s1);

// Speed Min = 1
// Speed Max = 30
// var speeds = [1,2,4,8,16, 20 ,32,32,32,64,32,16,8,4,2,1,1,1,1,1,1,1,1,1,1,2,4,8,16,32,64,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,4,8,16,32,64,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,4,8,16,32,64,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,4,8,16,32,64,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,4,8,16,32,64,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]; // Speeds array for each cell
// var speeds = [1, 2, 4, 8, 16, 30, 40, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
speeds = selectDistArray(dist, N, ratio_value, "motion");
console.log("original array: " + speeds);

const outputs = shuffleArray(speeds,task,ratio_value,N,dist,"motion"); //shuffling the data array based on the given task

cell1_i = outputs[1];
cell1_j = outputs[2];
cell2_i = outputs[3];
cell2_j = outputs[4];

speeds = outputs[0];
console.log("after shuffling: " + speeds);

// Call the drawVerticalMotionGraph function with the desired parameter (num)
drawVerticalMotionGraph(0, N, speeds);

function drawVerticalMotionGraph(num, N, speeds) {
  let box_data_2 = [];

  const totalGridWidth = cellSize * N;
  const totalGridHeight = cellSize * N;

  const translateX = (chartWidth - totalGridWidth) / 2;
  const translateY = (chartHeight - totalGridHeight) / 2;
  svg.attr("transform", "translate(" + translateX + "," + translateY + ")");


  // var circle1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  // var m_s = circle1[num];
  // var m_s1 = m_s / Math.max(...circle1); // Calculate the vertical movement factor dynamically

  var radius = 10;  //Changed from 18 to 10 by Shae

  let circle_data = [];

  // Generate data for each cell in the grid
  for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      var id = i * N + j;
      var cx = j * cellSize + cellSize / 2;
      var cy = i * cellSize + cellSize / 2;
      var speed = speeds[id]; // Set the speed from the speeds array

      circle_data.push({
        cx: cx,
        cy: cy,
        id: id,
        dx: cellSize/2,
        x_diff: 0, // No horizontal movement
        y_diff: 1, // Vertical movement direction (always downward)
        speed: speed,
        move: 0
      });

      box_data_2.push({
        x: j * cellSize,
        y: i * cellSize,
        h: cellSize,
        w: cellSize,
        speed: speed
      });
    }
  }
  
  box_2 = svg
    .selectAll(".rect")
    .data(box_data_2)
    .enter()
    .append("rect")
    .attr("class", "rect clickable")
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
    .data(circle_data)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("r", radius)
    .attr("fill", "#008fb3")
    .attr("cx", function (d) {
      return d.cx;
    })
    .attr("cy", function (d) {
      return d.cy;
    });

  box_2.on("click", function(d, i) {
    // Check if the clicked cell is the one to be disabled (task: match)
    if ((task == "match" && i === cell1_i * N + cell1_j) || task == "compare" || circles.style("visibility") === "hidden") {
      return; // Do nothing for the disabled cell
    }
    let correspondingRectValue = d.speed;
    console.log("clicking on the box: correspondingRectValue: " + correspondingRectValue);
    handleHighlight(this, correspondingRectValue);
  });
    
  circles.on("click", function(d, i) {
    // Check if the clicked cell is the one to be disabled (task: match)
    if ((task == "match" && i === cell1_i * N + cell1_j) || task == "compare" || circles.style("visibility") === "hidden") {
      return; // Do nothing for the disabled cell
    }
    var cellIndex = d.id ; // Adjust the index to match the box_data_2 array
    var correspondingRect = box_2.nodes()[cellIndex];
    let correspondingRectValue = d.speed;
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

    // Calculate the arrow positions based on circle radius
    var circleRadius = radius; // Set the circle radius as the default

    if (row >= 0 && row < N && col >= 0 && col < N) {
      circleRadius = circle_data[row * N + col].dx;
    }

    // Define the endpoint for the arrow (the middle of the outside border)
    var arrowStartX, arrowStartY, arrowEndX, arrowEndY;

    if (col === 0) {
      arrowStartX = -cellSize / 2;
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

    // Add an arrow line
    if (task == "compare" || task == "match") {
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

  var t;
  t = d3.timer(animate);

  // svg.style("opacity", 1);

  // Add an event listener to the "STOP" button
  // var stopButton = document.getElementById("stop");
  // stopButton.onclick = function () {
  //   stopAnimation();
  // };

  // Function to stop the animation
  // function stopAnimation() {
  //   animationStopped = true;
  // }
}

function animate() {  
  if (animationStopped) {
    // Stop the animation if the flag is set to true
    // console.log("animate output:" + true);
    return true; // Returning true stops the timer
  }
  circles.attr("cy", function (d) {
    d.cy = d.cy + d.speed * m_s1 * d.y_diff ;

    // Adjust the condition for top and bottom boundary
    var row = Math.floor(d.id / N); // Calculate the row index
    var topBoundary = (row + 0.2) * cellSize; // Adjust these values for your desired range
    var bottomBoundary = (row + 0.8) * cellSize; // Adjust these values for your desired range

    if (d.cy <= topBoundary || d.cy >= bottomBoundary) {
      d.y_diff = d.y_diff * -1;
    }
    // console.log("animate output: " + d.cy);
    return d.cy;
  });

  // console.log("animate final output: " + timer_ret_val);
  // return timer_ret_val;
}

// var stopButton = document.getElementById("stop");

function toggleAnimation() {
  animationStopped = !animationStopped;
  if (animationStopped) {
    // stopButton.textContent = "Resume";
    // Hide circles
    circles.style("visibility", "hidden");
  } else {
    // stopButton.textContent = "Stop";
    count++;
    // Show circles
    circles.style("visibility", "visible");
    // No need to call drawVerticalMotionGraph again
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
    type_of_encoding: "vertical motion",
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
    window.location.href = `../start.html`;
  }
  
}