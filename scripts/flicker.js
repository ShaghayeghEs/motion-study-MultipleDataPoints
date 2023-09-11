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

var slider = document.getElementById("value2");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
};

var width = 500;
var height = 350;
var padding = 10;
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
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

var display1 = d3.select("#chart");
var display2 = d3.select("#test");
var display3 = d3.select("#ranger");
var display4 = d3.select("#last");
var display5 = d3.select("#notice");
// Added by Shae
var display6 = d3.select("#test_difficulty");
var display7 = d3.select("#ranger_difficulty");

var speedArray = [1000, 1500, 1000,3000,4000,5000,6000,1000, 1500, 2000,3000,4000,5000,6000,1000, 1500, 2000,3000,4000,5000,6000,1000, 1500, 2000,3000,4000,5000,6000,1000, 1500, 2000,3000,4000,5000,6000,1000, 1500, 2000,3000,4000,5000,6000]; // Array of speeds for each circle

motion3(array_elem2);

function motion3(num) {
  var N = 3; // Change N to the desired size of the grid

  var data = [];
  var chartWidth = width - margin.left - margin.right;
  var chartHeight = height - margin.top - margin.bottom;
  var cellSize = Math.min(chartWidth, chartHeight) / N; // Size of each grid cell
  var circleRadius = cellSize / 2.5; // Adjust the fraction to control the circle size

  // Generate data for each cell in the grid
  for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      var cx = (j + 0.5) * cellSize; // X position of circle center
      var cy = (i + 0.5) * cellSize; // Y position of circle center

      var speed = speedArray[i * N + j]; // Get the speed value from the speedArray

      data.push({
        id: i * N + j,
        cx: cx,
        cy: cy,
        radius: circleRadius,
        flickering: true,
        color: "#008fb3",
        time: 0,
        speed: speed // Different speed for each circle
      });
    }
  }

  var circles = svg
    .selectAll(".circle")
    .data(data)
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

  animate();

  function animate() {
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


