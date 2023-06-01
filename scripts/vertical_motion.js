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

var width = 600;
var height = 300;
var padding = 5;
var timer_ret_val = false;

var margin = {
  top: 2,
  left: 140,
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

// function next_element() {
//   motion2(array_elem1);
// }

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
  var circle1 = [1.6, 1.4, 0.2, 0.4, 1.0, 0.4, 0.3, 0.2, 0.2, 0.2];
  // var circle2 = [1.8, 2.5, 0.6, 2.0, 3.0, 2.8, 3.0, 2.5, 3.0, 0.36];
  var circle2 = circle1;
  var count1 = 1;
  var count2 = 1;
  var m_s = circle1[num];
  var m_s0 = circle2[num];
  var m_s1 = m_s / 0.2; //console.log(m_s1);
  var m_s2 = m_s0 / 0.2; //console.log(m_s2);

  var radius = 10;
  move_true = false;
  count = 0;

  var circle_data = [
    {
      x: 50,
      y: 50,
      id: 1,
      x_diff: 1,
      y_diff: 0.5,
      speed: 2,
      move: 0
    },
    {
      x: 100,
      y: 50,
      id: 2,
      x_diff: 1,
      y_diff: 0.5,
      speed: url_data["ratio"] * 2,
      move: 0
    }
  ];

  var line_data = [
    {
      x1: 40,
      y1: 10,
      x2: 60,
      y2: 10
    },
    {
      x1: 50,
      y1: 10,
      x2: 50,
      y2: 210
    },
    {
      x1: 100,
      y1: 10,
      x2: 100,
      y2: 210
    },
    {
      x1: 40,
      y1: 210,
      x2: 60,
      y2: 210
    },
    {
      x1: 90,
      y1: 10,
      x2: 110,
      y2: 10
    },
    {
      x1: 90,
      y1: 210,
      x2: 110,
      y2: 210
    }
  ];

  var lines = svg
    .selectAll(".line")
    .data(line_data)
    .enter()
    .append("line")
    .attr("class", "line")
    .style("stroke", "black")
    .attr("stroke-width", 2)
    .attr("x1", function(d) {
      return d.x1;
    })
    .attr("y1", function(d) {
      return d.y1;
    })
    .attr("x2", function(d) {
      return d.x2;
    })
    .attr("y2", function(d) {
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
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    });

  var text_data = [{ x: 45, y: 250, id: 1 }, { x: 95, y: 250, id: 2 }];

  var texts = svg
    .selectAll(".text")
    .data(text_data)
    .enter()
    .append("text")
    .attr("class", "text")
    .attr("x", function(d) {
      return d.x;
    })
    .attr("y", function(d) {
      return d.y - 10;
    })
    .text(function(d) {
      return d.id;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .attr("fill", "black");

  var t;
  t = d3.timer(animate);
  move_true = true;
  count = 1;
  svg.style("opacity", 1);

  console.log("Vertical");

  function animate(elapsed) {
    circles
      .attr("cy", function(d) {
        if (move_true && d.id == 1) {
          d.y = d.y + d.speed * m_s1 * d.y_diff;
          if (d.y <= 50 || d.y >= 200) {
            d.y_diff = d.y_diff * -1;
            if (d.y <= 50) count1++;
          } else;
          return d.y;
        } else if (move_true && d.id != 1) {
          d.y = d.y + d.speed * m_s2 * d.y_diff;
          if (d.y <= 50 || d.y >= 200) {
            d.y_diff = d.y_diff * -1;
            if (d.y <= 50) count2++;
          } else;
          return d.y;
        } else return d.y;
      })
      .attr("cx", function(d) {
        return d.x;
      });

    if (count1 % 2 == 0) {
      //console.log("circle1"); //console.log(elapsed);
      count1 = 1;
    }
    if (count2 % 2 == 0) {
      //console.log("circle2");//console.log(elapsed);
      count2 = 1;
    }
    return timer_ret_val;
  }
}
