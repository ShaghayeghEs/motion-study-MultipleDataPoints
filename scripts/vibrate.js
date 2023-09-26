var ID;
var Value;
var radio1;
var radio2;
var results_json = [];
var current_elem = 0;
var array_elem1 = 0;
var array_elem2 = 0;
var array_elem3 = 0;
var motion_type = [1, 2, 3];
var move_true;
var count;
var padding = 10;
var timer_ret_val = false;

var speeds = [100,200,300,400,1000,100,200,300,400,1000,100,200,300,400,1000,100,200,300,400,1000,100,200,300,400,1000,100,200,300,400,1000 ]; // Define the speeds array (you can adjust these values)

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

var display1 = d3.select("#chart");
var display2 = d3.select("#test");
var display3 = d3.select("#ranger");
var display4 = d3.select("#last");
var display5 = d3.select("#notice");
// Added by Shae
var display6 = d3.select("#test_difficulty");
var display7 = d3.select("#ranger_difficulty");

var N = 5; // Change N to the desired size of the grid

motion4(array_elem3, N); // Pass the N value to the function

var circles_2; // Declare circles_2 as a global variable
var borders; // Declare borders as a global variable to maintain cell borders

// Flag to control animation
var animationStopped = false;
var vibrateInterval;


function motion4(num, N) {
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
        speed: speeds[(i * N + j) ]  // Assigning speed to each circle
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
    .attr("class", "rect")
    .style("fill", "none")
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
    .attr("class", "circle")
    .attr("r", 25) // Set the fixed radius value to 8
    .attr("fill", function (d) {
      return d.color; // Use the stored color value
    })
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    });

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


  // Function to add an arrow to a specific cell
  function addArrow(row, col) {
    var cellSize = maxCellSize;
    var cx = (col + 0.5) * cellSize;
    var cy = (row + 0.5) * cellSize;
    var circleRadius = circle_data_2[row * N + col].currentRadius ; // Get the circle's current radius

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

  // Add arrows to cells [0, 2] and [2, 0]
  addArrow(0, 2);
  addArrow(1, 0);

  move_true = true;
  console.log("area");

  // Initialize the "expanding" property for circles
  circles_2.each(function (d) {
    d.expanding = true;
  });

  // Start the vibration animation
  vibrate();
}

// Handle the stop button click event
var stopButton = document.getElementById("stop");
stopButton.onclick = function () {
  stopAnimation();
};

// Function to start the vibration animation
function startVibration() {
  vibrateInterval = setInterval(function () {
      vibrate();
  }, Math.max(...speeds));
  vibrate();
}

function stopAnimation() {
  animationStopped = true; // Set the flag to true
  clearInterval(vibrateInterval); // Clear the interval to prevent more vibrations
  circles_2.interrupt().transition(); // Interrupt ongoing transitions on the circles
}

function vibrate() {
  if (animationStopped) {
    return; // Stop the animation if the flag is set
  }

  circles_2.transition().on("start", function repeat() {
    d3.active(this)
      .attr("cx", function (d) {
        return d.x + 10; // Move the circle 10 units right
      })
      .transition()
      .duration(function (d) {
        return d.speed;
      })
      .attr("cx", function (d) {
        return d.x - 10; // Move the circle back to its original position
      })
      .transition()
      .duration(function (d) {
        return d.speed;
      })
      .on("start", repeat);
  });
}




// Start the vibration animation when your visualization is ready
startVibration();