import { selectDistArray, shuffleArray, selectCorrectMatchAnswer } from "./core.js";

//Measures without header
//pre: 18
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

var cell1_i = 0;
var cell1_j = 0;
var cell2_i = 0;
var cell2_j = 0;

// const N = 3; // Change N to the desired size of the grid
const N = url_data["size"];
// const task = "compare";
const task = url_data["task"];
// const ratio_value = 3.5;
const ratio_value = url_data["ratio"];
// const dist = "left-skewed";
const dist = url_data["dist"];
let Values = [];
let participantAnswer;
let correctAnswer;
let error; // when error is 0, the correct answer has been selected
let count = 0;
let selectedRect = null; // To keep track of the selected circle

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

  //DEBUG
  // console.log("DEBUG: cell size:" + cellSize);
  // console.log("DEBUG: max number of the area data: " + ((Math.pow((cellSize/2) - 0.1, 2)))/10);
  // console.log("DEBUG: min number of the area data: " + (1/1600 * ((Math.pow((cellSize/2) - 0.1, 2)))));
  
  Values = selectDistArray(dist, N, ratio_value,"area");
  
  //DEBUG
  // console.log("DEBUG: length of array is: " + Values.length);
  console.log("DEBUG: selectDistArray: " + Values);
  // console.log(Values);
  
  const outputs = shuffleArray(Values,task,ratio_value,N,dist,"area"); //shuffling the data array based on the given task
  
  //DEBUG
  // console.log("DEBUG: outputs:");
  // console.log(outputs);

  cell1_i = outputs[1];
  cell1_j = outputs[2];
  cell2_i = outputs[3];
  cell2_j = outputs[4];

  Values = outputs[0];

  //DEBUG
  console.log("DEBUG: after shuffling: " + Values);
  
  // Generate circle and box data based on grid size N
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      var cx = (j + 0.5) * cellSize; // X position of circle center
      var cy = (i + 0.5) * cellSize; // Y position of circle center
      var value = Values[i * N + j]; // Get the value from the array based on the circle's index
      var arrayValue = Values[i * N + j]; // Added by Shae

      circle_data_2.push({
        x: cx,
        y: cy,
        id: i * N + j + 1,
        radius: Math.sqrt(value * 10), //sqrt to make sure that the "area" is "ratio"-times bigger, not the radius.
        value: value,
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
      // .style("fill", "#f0f0f0")
      .style("fill", "transparent")
      .attr("stroke", "#f9f9f9")
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
      if ((task == "match" && i === cell1_i * N + cell1_j) || task == "compare") {
        return; // Do nothing for the disabled cell
      }
      
      let correspondingRectValue = d.arrayValue;
      console.log("clicking on the box: correspondingRectValue: " + correspondingRectValue);
      handleHighlight(this, correspondingRectValue);
    });
  
    circles_2.on("click", function(d, i) {
      // Check if the clicked cell is the one to be disabled (task: match)
      if ((task == "match" && i === cell1_i * N + cell1_j) || task == "compare") {
        return; // Do nothing for the disabled cell
      }
      var cellIndex = d.id - 1; // Adjust the index to match the box_data_2 array
      var correspondingRect = box_2.nodes()[cellIndex];
      // let correspondingRectValue = box_2.nodes()[cellIndex].arrayValue;
      let correspondingRectValue = d.arrayValue;
      console.log("clicking on the circle: correspondingRectValue: " + correspondingRectValue);
      handleHighlight(correspondingRect, correspondingRectValue);
    });

    function handleHighlight(clickedElem, elemValue) {
      console.log("elem value: " + elemValue);
      if (selectedRect === clickedElem) {
        // If the same cell is clicked again, unselect it
        // d3.select(clickedElem).attr("stroke", "black").attr("stroke-width", 0.5);
        d3.select(clickedElem).attr("stroke", "#f9f9f9").attr("stroke-width", 0);
        selectedRect = null;
      } else {
        // Unselect the previously selected cell (if any)
        if (selectedRect) {
          // d3.select(selectedRect).attr("stroke", "black").attr("stroke-width", 0.5);
          d3.select(selectedRect).attr("stroke", "#f9f9f9").attr("stroke-width", 0);
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

  // Add arrows to cells
  addArrow(cell1_i, cell1_j, "A");
  // addArrow(0, N - 1, "A");
  if (task == "compare") {
    addArrow(cell2_i, cell2_j, "B");
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
  // var timeSpentOnPage = TimeMe.getTimeOnCurrentPageInSeconds();
  let timeSpentOnPage;

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
      correctAnswer = selectCorrectMatchAnswer(dist, N, ratio_value,"area");
      console.log("correct answer: " + correctAnswer);
    } else if (task == "max") {
      console.log("in the if for calculating answer for max");
      participantAnswer = participantAnswer;
      correctAnswer = Math.max(...Values);
    } else if (task == "min") {
      console.log("in the if for calculating answer for min");
      participantAnswer = participantAnswer;
      correctAnswer = Math.min(...Values);
    }
  }

  // else if (task == "match") {
  //   console.log("in the if for calculating answer for match");
  //   participantAnswer = participantAnswer;
  //   console.log("participant answer: " + participantAnswer);
  //   correctAnswer = selectCorrectMatchAnswer(dist, N, ratio_value,"area");
  //   console.log("correct answer: " + correctAnswer);
  // } else if (task == "max") {
  //   console.log("in the if for calculating answer for max");
  //   participantAnswer = participantAnswer;
  //   correctAnswer = Math.max(...Values);
  // } else if (task == "min") {
  //   console.log("in the if for calculating answer for min");
  //   participantAnswer = participantAnswer;
  //   correctAnswer = Math.min(...Values);
  // }

  // console.log("participant's answer: " + participantAnswer);

  error = correctAnswer - participantAnswer;
  timeSpentOnPage = TimeMe.getTimeOnCurrentPageInSeconds();
  postMessage(timeSpentOnPage);
});

const participantId = localStorage.getItem('participantId');

function postMessage(timeSpentOnPage) {
  // Initialize selection_count with "N/A" if the task is "compare", otherwise use the value of count
  var selectionCountValue = task === "compare" ? "N/A" : count;

  var dataToSend = {
    participant_id: participantId,
    type_of_encoding: "area",
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
