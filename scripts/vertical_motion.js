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

motion2(array_elem1);

function motion2(num) {
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


  var circle1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  var circle2 = circle1;
  var m_s = circle1[num];
  var m_s0 = circle2[num];
  var m_s1 = m_s / Math.max(...circle1); // Calculate the vertical movement factor dynamically
  var m_s2 = m_s0 / Math.max(...circle2); // Calculate the vertical movement factor dynamically

  var radius = 18;
  move_true = false;
  count = 0;

  var speeds = [1,2,4,8,16,32,64,128,64,32,16,8,4,2,1,1,1,1,1,1,1,1,1,1,2,4,8,16,32,64,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,4,8,16,32,64,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,4,8,16,32,64,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,4,8,16,32,64,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,4,8,16,32,64,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]; // Speeds array for each cell



  var circle_data = [];
  var line_data = [];


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
        w: cellSize
      });

      //Vertical Axis
     /* if (j === 0) {
        line_data.push({
          x1: j * cellSize,
          x2: j * cellSize,
        });
      }

      line_data.push({
        x1: cx,
        y1: i * cellSize + 10,
        x2: cx,
        y2: (i + 0.92) * cellSize
      });

    
    }
  
*/
  }
}
  var box_2 = svg
    .selectAll(".rect")
    .data(box_data_2)
    .enter()
    .append("rect")
    .attr("class", "rect clickable")
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

  var lines = svg
    .selectAll(".line")
    .data(line_data)
    .enter()
    .append("line")
    .attr("class", "line")
    .style("stroke", "black")
    .attr("stroke-width", 2)
    .attr("x1", function (d) {
      return d.x1;
    })
    .attr("y1", function (d) {
      return d.y1;
    })
    .attr("x2", function (d) {
      return d.x2;
    })
    .attr("y2", function (d) {
      return d.y2;
    });

  var circles = svg
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


    var selectedCircle = null; // To keep track of the selected circle


    // Event listener for cell clicks to highlight the corresponding circle
box_2.on("click", function(d, i) {
  var clickedCircle = circles_2.nodes()[i];
  if (selectedCircle === clickedCircle) {
    // If the same circle is clicked again, unselect it
    d3.select(clickedCircle).attr("stroke", "none");
    selectedCircle = null;
  } else {
    // Unselect the previously selected circle (if any)
    if (selectedCircle) {
      d3.select(selectedCircle).attr("stroke", "none");
    }
    // Highlight the corresponding circle
    d3.select(clickedCircle).attr("stroke", "black").attr("stroke-width", 2);
    selectedCircle = clickedCircle;
  }
});
// Event listener for left-click to highlight the cell
circles.on("click", function(d) {
  if (selectedCircle === d) {
    // If the same circle is clicked again, unselect it
    d3.select(this).attr("stroke", "none");
    selectedCircle = null;
  } else {
    // Unselect the previously selected circle (if any)
    if (selectedCircle) {
      d3.select(selectedCircle).attr("stroke", "none");
    }
    // Highlight the clicked circle
    d3.select(this).attr("stroke", "black").attr("stroke-width", 2);
    selectedCircle = this;
  }
});

// Event listener for right-click anywhere to unselect the cell
d3.select("body").on("contextmenu", function() {
  if (selectedCircle) {
    d3.select(selectedCircle).attr("stroke", "none");
    selectedCircle = null;
  }
  d3.event.preventDefault(); // Prevent the default right-click context menu
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

// Function to add an arrow to a specific cell
// Function to add an arrow to a specific cell
function addArrow(row, col) {
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



  var t;
  t = d3.timer(animate);
  move_true = true;
  count = 1;
  svg.style("opacity", 1);


  function animate(elapsed) {
    circles.attr("cy", function (d) {
      d.cy = d.cy + d.speed * m_s1 * d.y_diff ;

      // Adjust the condition for top and bottom boundary
      var row = Math.floor(d.id / N); // Calculate the row index
      var topBoundary = (row + 0.25) * cellSize; // Adjust these values for your desired range
      var bottomBoundary = (row + 0.75) * cellSize; // Adjust these values for your desired range

      if (d.cy <= topBoundary || d.cy >= bottomBoundary) {
        d.y_diff = d.y_diff * -1;
      }
      return d.cy;
    });

    return timer_ret_val;
  }
}

// Call the motion2 function with the desired parameter (num)
motion2(0);
