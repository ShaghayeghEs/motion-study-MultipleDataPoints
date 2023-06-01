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

motion4(array_elem3);
function motion4(num) {
  var circle1_2 = [0.2, 0.4, 0.2, 0.4, 0.2, 1.6, 1.4, 1.0, 0.3, 0.2];
  var circle2_2 = circle1_2;
  // var circle2_2 = [0.36, 2.8, 2.5, 2.0, 3.0, 1.8, 2.5, 3.0, 3.0, 0.6];

  var count1_2 = 1;
  var count2_2 = 1;
  var m_s_2 = circle1_2[num];
  var m_s0_2 = circle2_2[num];
  var m_s1_2 = m_s_2 / 0.2;
  var m_s2_2 = m_s0_2 / 0.2;

  count = 0;
  move_true = false;

  var circle_data_2 = [
    {
      x: 80,
      y: 100,
      id: 1,
      r_diff: 0.13,
      //speed: 2,
      radius: 10,
      move: 0
    },
    {
      x: 250,
      y: 100,
      id: 2,
      r_diff: 0.13,
      //speed: 2,
      radius: url_data["ratio"] * 10,
      //radius: 40,
      move: 0
    }
  ];

  var angle_data_2 = [
    {
      x: 50,
      y: 130,
      id: 1,
      startAngle: (90 - 20) * (3.14 / 180)
      //r_diff: 0.13,
      //speed: 2,
      //radius: 10,
      //move: 0
    },
    {
      x: 220,
      y: 130,
      id: 2,
      startAngle: (90 - (20 * url_data["ratio"])) * (3.14 / 180)
      //r_diff: 0.13,
      //speed: 2,
      //radius: url_data["ratio"] * 10,
      //radius: 40,
      //move: 0
    }
  ];


  var box_data_2 = [
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

  var box_2 = svg
    .selectAll(".rect")
    .data(box_data_2)
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

  var angles_2 = svg
    .selectAll(".path")
    //.data(circle_data_2)
    .data(angle_data_2)
    .enter()
    .append("path")
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")"; 
    })
    .attr("d", d3.arc()
    .innerRadius( 0 )
    .outerRadius( 75 )
    .startAngle( function(d) {return d.startAngle;} )     // It's in radian, so Pi = 3.14 = bottom.
    //.endAngle( 0.25 * Math.PI )       // 2*Pi = 6.28 = top
    .endAngle(1.5708)
    )
    .attr("fill", "none")
    .attr('stroke', 'black')
    //.attr('fill', "#ffffff")
    //.attr("class", "circle")
    // .attr("r", function(d) {
    //   return d.radius;
    // })
    // .attr("fill", "#008fb3")
    // .attr("cx", function(d) {
    //   return d.x;
    // })
    // .attr("cy", function(d) {
    //   return d.y;
    // })
    ;

  var text_data_2 = [{ x: 80, y: 195, id: 1 }, { x: 250, y: 195, id: 2 }];

  var texts_2 = svg
    .selectAll(".text")
    .data(text_data_2)
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

  //var t_2;
  //t_2 = d3.timer(animate_2);
  move_true = true;
  console.log("angle");
  console.log(width);
  console.log(height);

  function animate_2(elapsed) {
    circles_2
      .attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      })
      .attr("r", function(d) {
        // if (move_true && d.id == 1) {
        //   // d.radius = d.radius + d.speed * m_s1_2 * d.r_diff;
        //   d.radius = d.radius;
        //   // if (d.radius < 10 || d.radius > 50) {
        //   //   d.r_diff = d.r_diff * -1;
        //   // } else;
        //   return d.radius;
        // } 
        // else if (move_true && d.id == 2) {
        //   //d.radius = d.radius + d.speed * m_s2_2 * d.r_diff;
        //   d.radius = d.radius;
        //   // if (d.radius < 10 || d.radius > 50) {
        //   //   d.r_diff = d.r_diff * -1;
        //   // } else;
        //   return d.radius;
        // } 
        //else 
        return d.radius;
      });
    return timer_ret_val;
  }
}
