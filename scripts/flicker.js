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

var speeds = [1,2,3,4,5,6,8,10,12,14,16]; // Define the speeds array (you can adjust these values)

var margin = {
  top: 18,
  left: 18,
  bottom: 18,
  right: 18
};

var chartWidth = document.getElementById("chartContainer").offsetWidth - margin.left - margin.right;
var chartHeight = document.getElementById("chartContainer").offsetHeight - margin.top - margin.bottom;
var isAnimating = true;  // This flag will control whether the animation should run or not.

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

var speedArray = [1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000, 1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000,1000, 2000,4000]; // Array of speeds for each circle
var box_data_2 = [];

motion3(array_elem2);

function motion3(num) {
  var N = 5 ;
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

  // Generate data for each cell in the grid
  for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      var cx = (j + 0.5) * cellSize; // X position of circle center
      var cy = (i + 0.5) * cellSize; // Y position of circle center

      var speed = speedArray[i * N + j]; // Get the speed value from the speedArray

      circle_data_2.push({
        id: i * N + j,
        cx: cx,
        cy: cy,
        radius: cellSize/3,
        flickering: true,
        color: "#008fb3",
        time: 0,
        speed: speed // Different speed for each circle
      });

      box_data_2.push({
        x: j * cellSize,
        y: i * cellSize,
        h: cellSize,
        w: cellSize
      });
    }
  }

  var box_2 = svg
    .selectAll(".rect")
    .data(box_data_2)
    .enter()
    .append("rect")
    .attr("class", "rect")
    .style("fill", "white")
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

  var circles = svg
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



    var selectedRect = null; // To keep track of the selected circle

    box_2.on("click", function(d, i) {
      handleHighlight(this);
    });
    
    circles.on("click", function(d, i) {
      var cellIndex = d.id ; // Adjust the index to match the box_data_2 array
      var correspondingRect = box_2.nodes()[cellIndex];
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
addArrow(2, 0);

  animate();

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
  
    document.getElementById("stop").addEventListener("click", function() {
      isAnimating = false;  // Set the flag to false to stop animation
  });

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
  
    // Recursive call after a delay based on the speed of the circle
    setTimeout(function() {
      animateCircle(circle, speed);
    }, speed);
  
  }
  }


