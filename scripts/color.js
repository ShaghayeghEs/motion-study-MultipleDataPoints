import { selectDistArray, shuffleArray, selectCorrectMatchAnswer } from "./core.js";

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

var cell1_i = 0;
var cell1_j = 0;
var cell2_i = 0;
var cell2_j = 0;

var N = url_data["size"];
var task = url_data["task"];
var ratio_value = url_data["ratio"];
var dist = url_data["dist"];
let Values = [];
let participantAnswer;
let correctAnswer;
let error; // when error is 0, the correct answer has been selected
let count = 0;
let selectedRect = null; // To keep track of the selected circle

drawColorGraph(N); // Pass the N value to the function

function drawColorGraph(N) {
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

  // let Values = [];
  Values = selectDistArray(dist, N, ratio_value, "color");
  console.log("original array: " + Values);

  var outputs = shuffleArray(Values,task,ratio_value,N,dist,"color"); //shuffling the data array based on the given task
  // console.log("outputs:");
  // console.log(outputs);

  cell1_i = outputs[1];
  cell1_j = outputs[2];
  cell2_i = outputs[3];
  cell2_j = outputs[4];

  Values = outputs[0];
  console.log("after shuffling: " + Values);
  
  // Generate circle and box data based on grid size N
  for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      var cx = (j + 0.5) * cellSize; // X position of circle center
      var cy = (i + 0.5) * cellSize; // Y position of circle center
      
      // 5 shades
      // var colors = ["#fafafa", "#bfbfbf", "#7f7f7f", "#404040", "#000000"]; // Add more colors if needed

      var value = Values[i * N + j]; // Get the value from the array based on the circle's index
      var arrayValue = Values[i * N + j]; // Added by Shae
      let color = shadeColor("#ffffff", value * -1);
      // console.log("color is: " + color);

      circle_data_2.push({
        x: cx,
        y: cy,
        id: i * N + j + 1,
        r_diff: 0.13,
        radius: cellSize / 2,  // Set a constant value
        move: 0,
        value: value,
        arrayValue: arrayValue, //Added by Shae
        color: color
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
      arrowEndX = cx - circleRadius - 5; // Adjusted to avoid overlap with circle
    } else if (col === N - 1) {
        arrowStartX = totalGridWidth + cellSize / 2;
        arrowEndX = cx + circleRadius + 5; // Adjusted to avoid overlap with circle
    } else {
        arrowStartX = arrowEndX = cx;
    }

    if (row === 0) {
        arrowStartY = -cellSize / 2;
        arrowEndY = cy - circleRadius - 5; // Adjusted to avoid overlap with circle
    } else if (row === N - 1) {
        arrowStartY = totalGridHeight + cellSize / 2;
        arrowEndY = cy + circleRadius + 5; // Adjusted to avoid overlap with circle
    } else {
        arrowStartY = arrowEndY = cy;
    }


    var box_2 = svg
      .selectAll(".rect")
      .data(box_data_2)
      .enter()
      .append("rect")
      .attr("class", "rect clickable")
      .style("fill", "white")
      .attr("stroke", "white")
      // .attr("stroke-width", 0.5)
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

    var circles_2 = svg
      .selectAll(".circle")
      .data(circle_data_2)
      .enter()
      .append("circle")
      .attr("class", "circle clickable")
      .attr("r", 30) // Set the fixed radius value to 8
      .attr("fill", function(d) {
        return d.color; // Use the adjusted radius
      })
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
      let correspondingRectValue = d.arrayValue;
      console.log("clicking on the circle: correspondingRectValue: " + correspondingRectValue);
      handleHighlight(correspondingRect, correspondingRectValue);
    });

    function handleHighlight(clickedElem, elemValue) {
      console.log("elem value: " + elemValue);
      if (selectedRect === clickedElem) {
        // If the same cell is clicked again, unselect it
        d3.select(clickedElem).attr("stroke", "white").attr("stroke-width", 0);
        selectedRect = null;
      } else {
        // Unselect the previously selected cell (if any)
        if (selectedRect) {
          d3.select(selectedRect).attr("stroke", "white").attr("stroke-width", 0);
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

    if(task == "compare" || task == "match") {
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
  addArrow(cell1_i, cell1_j, "A");
  // addArrow(0, N - 1, "A");
  if (task == "compare") {
    addArrow(cell2_i, cell2_j, "B");
    // addArrow(N - 1, 0, "B");
  }
}

function shadeColor(color, percent) {

  var R = parseInt(color.substring(1, 3), 16);
  var G = parseInt(color.substring(3, 5), 16);
  var B = parseInt(color.substring(5, 7), 16);  
  
  if (R == 0) {
    R = 32;
  }
  if (G == 0) {
    G = 32;   
  }
  if (B == 0) {
    B = 32;
  }

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R<255)?R:255;  
  G = (G<255)?G:255;  
  B = (B<255)?B:255;  

  R = Math.round(R)
  G = Math.round(G)
  B = Math.round(B)

  var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
  var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
  var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

  return "#"+RR+GG+BB;
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
      correctAnswer = selectCorrectMatchAnswer(dist, N, ratio_value,"color");
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
    type_of_encoding: "color",
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