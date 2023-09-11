window.addEventListener("DOMContentLoaded", function() {
  var N = 10; // Change N to the desired size of the grid

  var margin = { top: 20, right: 20, bottom: 20, left: 20 };
  var width = 500;
  var height = 350;
  var chartWidth = width - margin.left - margin.right;
  var chartHeight = height - margin.top - margin.bottom;

  // Calculate the maximum number of circles that can fit within the available space
  var maxCircles = Math.min(chartWidth, chartHeight) / Math.max(N, 1);

  var circleRadius = maxCircles * 0.3; // Adjust the fraction to control the circle size
  var circleSpacing = maxCircles * 1.1; // Adjust the fraction to control the spacing between circles

  var data = [];
  var chart;

  var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Calculate the required dimensions for the SVG container based on the grid size
  var containerWidth = N * circleSpacing + margin.left + margin.right;
  var containerHeight = N * circleSpacing + margin.top + margin.bottom;

  svg.attr("width", containerWidth).attr("height", containerHeight);

  // Generate data for each cell in the grid
  for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      var id = i * N + j;
      var xVal = margin.left + j * circleSpacing + circleSpacing / 2; // X position of circle center
      var yVal = margin.top + i * circleSpacing + circleSpacing / 2; // Y position of circle center
      var range = circleSpacing - circleRadius * 2; // Vertical range of motion
      var speed = (i + j + 1) * 100; // Vibration speed

      data.push({
        id: id.toString(),
        cx: xVal.toString(),
        cy: yVal.toString(),
        radius: circleRadius,
        range: range,
        speed: speed.toString(),
      });
    }
  }

  var circles = svg.selectAll(".circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("cx", function(d) {
      return d.cx;
    })
    .attr("cy", function(d) {
      return d.cy;
    })
    .attr("r", function(d) {
      return d.radius;
    })
    .attr("fill", "#008fb3")
    .attr("speed", function(d) {
      return d.speed;
    })
    .attr("range", function(d) {
      return d.range;
    });

  animate();

  function animate() {
    circles.transition()
      .attr("cy", function(d) {
        var minY = parseInt(d.cy) - parseInt(d.range) / 2 + d.radius;
        var maxY = parseInt(d.cy) + parseInt(d.range) / 2 - d.radius;
        var newY = Math.random() * (maxY - minY) + minY;
        return newY;
      })
      .duration(1000)
      .on("end", animate);
  }

  var slider = document.getElementById("value2");
  var output = document.getElementById("demo");
  output.innerHTML = slider.value;

  slider.oninput = function() {
    output.innerHTML = this.value;
  };

  function postMessage(timeSpentOnPage) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/store_data/", false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
      participant_id: url_data["id"],
      ratio: parseFloat(url_data["ratio"]),
      trial_number: parseInt(url_data["trail"]),
      time_spent: timeSpentOnPage,
      participant_answer: slider.value,
      correct_answer: 10,
      type_of_encoding: "vertical motion",
      difference: 10 - slider.value,
    }));
    if (xhr.status == 200) {
      console.log("made request");
      window.top.load_page();
    } else {
      console.log("Error sending msg to the server...retrying");
      postMessage();
    }
  }

  var btn = document.getElementById("submit");
  btn.onclick = function() {
    btn.disabled = true;
    var timeSpentOnPage = TimeMe.getTimeOnCurrentPageInSeconds();
    postMessage(timeSpentOnPage);
  };
});
