import { selectDistArray, shuffleArray } from "./core.js";

// var speeds = [50, 25, 1]; // Define the speeds array (you can adjust these values)
var speeds;

var margin = {
  top: 18,
  left: 18,
  bottom: 18,
  right: 18
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

var N = url_data["size"];
var task = url_data["task"];
var ratio_value = url_data["ratio"];
var dist = url_data["dist"];

var circles_2; // Declare circles_2 as a global variable
var borders; // Declare borders as a global variable to maintain cell borders

drawExpansionGraph(N); // Pass the N value to the function

function drawExpansionGraph(N) {
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
  
  speeds = selectDistArray(dist, N, ratio_value, "expansion");
  console.log(speeds);

  speeds = shuffleArray(speeds, task, ratio_value, N, dist, "expansion");
  console.log("speeds");
  console.log(speeds);

  cell1_i = speeds[1];
  cell1_j = speeds[2];
  cell2_i = speeds[3];
  cell2_j = speeds[4];
  
  speeds = speeds[0];
  console.log("after shuffling");
  console.log(speeds);

  // Flag to control animation
  // Generate circle data based on grid size N
  for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      var cx = (j + 0.5) * cellSize; // X position of circle center
      var cy = (i + 0.5) * cellSize; // Y position of circle center

      var colors = ["#008fb3"]; // Add more colors if needed

      circle_data_2.push({
        x: cx,
        y: cy,
        id: i * N + j + 1,
        r_diff: 0.13,
        currentRadius: cellSize / 5,
        move: 0,
        color: colors[i % colors.length], // Store the color for each circle
        speed: speeds[(i * N + j) % speeds.length]  // Assigning speed to each circle

      });

      box_data_2.push({
        x: j * cellSize,
        y: i * cellSize,
        h: cellSize,
        w: cellSize
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
    .attr("stroke-width", 0.5)
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

    var selectedRect = null; // To keep track of the selected circle

    borders.on("click", function(d, i) {
      handleHighlight(this);
    });
    
    circles_2.on("click", function(d, i) {
      var cellIndex = d.id - 1; // Adjust the index to match the box_data_2 array
      var correspondingRect = borders.nodes()[cellIndex];
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
        d3.select(clickedElem).attr("stroke", "red").attr("stroke-width", 2);
        selectedRect = clickedElem;
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
  function addArrow(row, col) {
    var cellSize = maxCellSize;
    var cx = (col + 0.5) * cellSize;
    var cy = (row + 0.5) * cellSize;
    var circleRadius = circle_data_2[row * N + col].currentRadius; // Get the circle's current radius

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
  }
}
  
  // Add arrows to cells
  addArrow(cell1_i, cell1_j);
  if (task == "compare") {
    console.log("DEBUG: in the if that should not be");
    addArrow(cell2_i, cell2_j);
  }

  // Initialize the "expanding" property for circles
  circles_2.each(function (d) {
    d.expanding = true;
  });

  // Start the animation
  animate();  
}

// Function to animate the circles
function animate() {
  // console.log("in animate function");
  var maxSpeed = Math.max(...speeds); // Find the maximum speed in the array

  var circleData = circles_2.data();

  var timer = d3.timer(function (elapsed) {
    if (animationStopped) {
      timer.stop(); // Stop the animation timer
      return;
    }

    circles_2.each(function (d) {
      var circle = d3.select(this);
      var speedFactor = d.speed; // Use the speed from the circle's data

      // Calculate the adjusted duration based on speedFactor and the maximum speed
      var adjustedDuration = 1000 / (speedFactor / maxSpeed);

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


var stopButton = document.getElementById("stop");

// Function to stop or resume the animation
function toggleAnimation() {
  animationStopped = !animationStopped;
  if (animationStopped) {
    stopButton.textContent = "Resume";
  } else {
    stopButton.textContent = "Stop";
    animate(); // Resume animation
  }
}

// Handle the stop/resume button click event
stopButton.onclick = function () {
  toggleAnimation();
  if (animationStopped) {
    // If animation is stopped, remove all circles
    circles_2.remove();
  } else {
    // If animation is resumed, recreate circles and start animation
    drawExpansionGraph(N);
  }
};