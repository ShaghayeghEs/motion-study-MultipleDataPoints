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

var width = 450;
var height = 350;
var padding = 0;
var timer_ret_val = false;

var margin = {
  top: 20,
  left: 20,
  bottom: 20,
  right: 20
};

var svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
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
  var N = 4; // Define the value of N (between 2-10)

  var circle1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  var circle2 = circle1;
  var m_s = circle1[num];
  var m_s0 = circle2[num];
  var m_s1 = m_s / Math.max(...circle1); // Calculate the vertical movement factor dynamically
  var m_s2 = m_s0 / Math.max(...circle2); // Calculate the vertical movement factor dynamically

  var radius = 10;
  move_true = false;
  count = 0;

  var speeds = [10.1, 20.2, 30, 40.3, 50.5, 60.7, 30.4, 20.6, 10.9, 20.2, 30, 10.3, 20.5, 10.7, 30.4, 20.6, 10.9, 20.2, 30, 40.3, 50.5, 10.7, 30.4, 20.6, 10.9, 20.2, 30, 40.3, 50.5, 60.7, 30.4, 20.6, 10.9, 20.2, 30, 40.3, 50.5, 60.7, 30.4, 20.6, 10.9, 20.2, 30, 40.3, 50.5, 60.7, 30.4, 20.6, 10.9, 20.2, 30, 40.3, 50.5, 60.7, 30.4, 20.6, 10.9, 20.2, 30, 40.3, 50.5, 60.7, 30.4, 20.6, 10.9, 20.2, 30, 40.3, 50.5, 60.7, 30.4, 20.6, 10.9, 20.2, 30, 40.3, 50.5, 60.7, 30.4, 20.6, 10.9, 20.2, 30, 40.3, 50.5, 60.7, 30.4, 20.6, 10.9, 20.2, 30, 40.3, 50.5, 60.7, 30.4, 20.6, 10.9, 20.2, 30, 40.3, 50.5, 60.7, 30.4, 20.6, 10.9, 20.2, 30, 40.3, 50.5, 60.7, 30.4, 20.6, 10.9, 20.2, 30, 40.3, 50.5, 60.7, 30.4, 20.6, 10.9, 20.2, 30, 40.3, 50.5, 60.7, 30.4, 20.6, 10.9, 20.2, 30, 40.3, 50.5, 60.7, 30.4, 20.6, 10.9, 20.2, 30, 40.3, 50.5, 60.7, 30.4, 20.6, 10.9, 20.2, 30, 40.3, 50.5, 60.7, 30.4, 20.6, 10.9, 20.2, 30, 40.3, 50.5, 60.7, 30.4, 20.6, 10.9]; // Speeds array for each cell

  var containerWidth = width - margin.left - margin.right;
  var containerHeight = height - margin.top - margin.bottom;

  var cellSize = Math.min(containerWidth, containerHeight) / N;

  var circle_data = [];
  var line_data = [];
  var text_data = []; // Added missing text_data array

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
        dx: radius,
        x_diff: 0, // No horizontal movement
        y_diff: 1, // Vertical movement direction (always downward)
        speed: speed,
        move: 0
      });

      if (j === 0) {
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

      text_data.push({
        x: cx - 12,
        y: cy,
        value: id + 1
      });
    }
  }

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

  var text = svg
    .selectAll(".text")
    .data(text_data)
    .enter()
    .append("text")
    .attr("class", "text")
    .attr("x", function (d) {
      return d.x;
    })
    .attr("y", function (d) {
      return d.y;
    })
    .text(function (d) {
      return d.value;
    })
    .style("text-anchor", "middle")
    .style("alignment-baseline", "middle")
    .style("fill", "black");

  var t;
  t = d3.timer(animate);
  move_true = true;
  count = 1;
  svg.style("opacity", 1);

  console.log("Vertical");

  function animate(elapsed) {
    circles.attr("cy", function (d) {
      d.cy = d.cy + d.speed * m_s1 * d.y_diff;

      // Adjust the condition for top and bottom boundary
      var row = Math.floor(d.id / N); // Calculate the row index
      var topBoundary = (row + 0.2) * cellSize;
      var bottomBoundary = (row + 0.8) * cellSize;

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
