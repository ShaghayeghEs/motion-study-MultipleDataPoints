var width = 500;
var height = 500;

var svg = d3
  .select("#chart")
  .attr("width", width)
  .attr("height", height);

var cellSize = 51.5;
var padding = 2;

var cellData = [];
for (var i = 0; i < 10; i++) {
  for (var j = 0; j < 10; j++) {
    cellData.push({
      x: i * cellSize,
      y: j * cellSize,
    });
  }
}

var cells = svg
  .selectAll(".cell")
  .data(cellData)
  .enter()
  .append("rect")
  .attr("class", "cell")
  .attr("x", function (d) {
    return d.x;
  })
  .attr("y", function (d) {
    return d.y;
  })
  .attr("width", cellSize - padding)
  .attr("height", cellSize - padding)
  .style("stroke", "black")
  .style("fill", "none")
  .style("stroke-width", 1);

var radius = (cellSize - padding) / 4;

var circleData = [];
var circleSpeedRange = [0.1, 4.5]; // Range of possible speeds

for (var i = 0; i < 10; i++) {
  for (var j = 0; j < 10; j++) {
    var circleSpeed =
      Math.random() * (circleSpeedRange[1] - circleSpeedRange[0]) +
      circleSpeedRange[0];
    circleData.push({
      cx: i * cellSize + cellSize / 2,
      cy: j * cellSize + radius,
      dy: radius,
      y_diff: 1,
      speed: circleSpeed,
    });
  }
}

var circles = svg
  .selectAll(".circle")
  .data(circleData)
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

var t = d3.timer(animate);

function animate(elapsed) {
  circles
    .attr("cy", function (d) {
      d.dy = d.dy + d.speed * d.y_diff;
      if (
        d.dy >= cellSize - padding - radius ||
        d.dy <= radius
      ) {
        d.y_diff = d.y_diff * -1;
      }
      return d.cy + d.dy - radius;
    });
}

var slider = document.getElementById("value2");
      var output = document.getElementById("demo");
      output.innerHTML = slider.value;

      slider.oninput = function() {
        output.innerHTML = this.value;
      };
      function postMessage(timeSpentOnPage) {
        var xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          "http://localhost:5000/store_data/",
          false
        );
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(
          JSON.stringify({
            participant_id: url_data["id"],
            ratio: parseFloat(url_data["ratio"]),
            trial_number: parseInt(url_data["trail"]),
            time_spent: timeSpentOnPage,
            participant_answer: slider.value,
            correct_answer: 10,
            type_of_encoding: "vertical motion",
            difference: 10 - slider.value
          })
        );
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
        // btn.style.background = "#e8e7d8";
        var timeSpentOnPage = TimeMe.getTimeOnCurrentPageInSeconds();
        postMessage(timeSpentOnPage);
      };