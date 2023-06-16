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

var width = 600;
var height = 300;
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

motion3(array_elem2);
function motion3(num) {
  var circle1_1 = [1.4, 0.2, 0.4, 0.2, 1.6, 0.2, 0.4, 0.3, 0.2, 1.0];
  //var circle2_1 = [2.5, 2.5, 2.0, 3.0, 1.8, 0.36, 2.8, 3.0, 0.6, 3.0];
  var circle2_1 = circle1_1;
  var count1_1 = 1;
  var count2_1 = 1;
  var m_s_1 = circle1_1[num];
  var m_s0_1 = circle2_1[num];
  var m_s1_1 = m_s_1 / 0.2;
  var m_s2_1 = m_s0_1 / 0.2;

  count = 0;
  var circle_data1 = [
    {
      x: 80,
      y: 100,
      id: 1,
      r_diff: 0.33,
      speed: 2,
      radius: 40,
      move: 0,
      color: "#008fb3",
      time: 0
    },
    {
      x: 250,
      y: 100,
      id: 2,
      r_diff: 0.33,
      speed: url_data["ratio"] * 2,
      radius: 40,
      move: 0,
      color: "#008fb3",
      time: 0
    }
  ];

  var box_data = [
    {
      x: 20,
      y: 40,
      h: 125,
      w: 125
    },
    {
      x: 190,
      y: 40,
      h: 125,
      w: 125
    }
  ];

  var box = svg
    .selectAll(".rect")
    .data(box_data)
    .enter()
    .append("rect")
    .attr("class", "rect")
    .style("fill", "white")
    .attr("stroke", "black")
    .attr("stroke-width", 2)
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

  var circles1 = svg
    .selectAll(".circle")
    .data(circle_data1)
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
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    });

  var text_data1 = [{ x: 80, y: 195, id: 1 }, { x: 250, y: 195, id: 2 }];

  var texts1 = svg
    .selectAll(".text")
    .data(text_data1)
    .enter()
    .append("text")
    .attr("class", "text")
    .attr("x", function(d) {
      return d.x;
    })
    .attr("y", function(d) {
      return d.y;
    })
    .text(function(d) {
      return d.id;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .attr("fill", "black");

  var t1;
  t1 = d3.timer(animate1);
  move_true = true;
  console.log("Flicker");

  function animate1(elapsed) {
    circles1
      .attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      })
      .attr("r", function(d) {
        if (move_true && d.id == 1) {
          d.time = d.time + d.speed * m_s1_1 * d.r_diff;
          if (d.time > 100) {
            d.radius = 0;
            d.r_diff = d.r_diff * -1;
          }
          if (d.time < 0) {
            d.radius = 40;
            d.r_diff = d.r_diff * -1;
          }

          return d.radius;
        } else if (move_true && d.id == 2) {
          d.time = d.time + d.speed * m_s2_1 * d.r_diff;
          if (d.time > 100) {
            d.radius = 0;
            d.r_diff = d.r_diff * -1;
          }
          if (d.time < 0) {
            d.radius = 40;
            d.r_diff = d.r_diff * -1;
          }
          return d.radius;
        }
      });
    return timer_ret_val;
  }
}
