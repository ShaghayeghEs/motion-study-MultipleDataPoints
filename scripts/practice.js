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

function next_element() {
  var element = motion_type[current_elem];

  if (current_elem < 3) {
    if (element == 1) {
      console.log("current_elem is: " + current_elem);
      motion2(array_elem1);
    }

    if (element == 2) {
      console.log("current_elem is: " + current_elem);
      motion3(array_elem2);
    }

    if (element == 3) {
      console.log("current_elem is: " + current_elem);
      motion4(array_elem3);
    } else;
  } else {
    // location.href="./end.html";
    location.href = "./position.html";
    svg.remove();
  }
}

var display1 = d3.select("#chart");
var display2 = d3.select("#test");
var display3 = d3.select("#ranger");
var display4 = d3.select("#last");
var display5 = d3.select("#notice");
// Added by Shae
var display6 = d3.select("#test_difficulty");
var display7 = d3.select("#ranger_difficulty");

function motion2(num) {
  var circle1 = [1.6, 1.4, 0.2, 0.4, 1.0, 0.4, 0.3, 0.2, 0.2, 0.2];
  var circle2 = [1.8, 2.5, 0.6, 2.0, 3.0, 2.8, 3.0, 2.5, 3.0, 0.36];

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
      speed: 2,
      move: 0
    }
  ];

  var line_data = [
    {
      x1: 40,
      y1: 20,
      x2: 60,
      y2: 20
    },
    {
      x1: 50,
      y1: 20,
      x2: 50,
      y2: 230
    },
    {
      x1: 100,
      y1: 20,
      x2: 100,
      y2: 230
    },
    {
      x1: 40,
      y1: 230,
      x2: 60,
      y2: 230
    },
    {
      x1: 90,
      y1: 20,
      x2: 110,
      y2: 20
    },
    {
      x1: 90,
      y1: 230,
      x2: 110,
      y2: 230
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
      return d.y;
    })
    .text(function(d) {
      return d.id;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .attr("fill", "black");

  var t;
  document.getElementById("submit").disabled = true;
  svg.style("opacity", 0);
  display1.style("opacity", 0);
  display2.style("opacity", 0);
  display3.style("opacity", 0);
  display6.style("opacity", 0);
  display7.style("opacity", 0);
  display4.style("opacity", 0);
  display5.style("opacity", 1);
  var startbtn = d3.select("#startbtn");
  startbtn.on("click", function() {
    if (count == 0) {
      t = d3.timer(animate);
      move_true = true;
      count = 1;
      document.getElementById("submit").disabled = false;
      svg.style("opacity", 1);
      display1.style("opacity", 1);
      display2.style("opacity", 1);
      display3.style("opacity", 1);
      display4.style("opacity", 1);
      display5.style("opacity", 0);
      display6.style("opacity", 1);
      display7.style("opacity", 1);
    } else if (count == 1) {
      t.stop();
      move_true = false;
      count = 0;
      timer_ret_val = true;
    } else;

    document.getElementById("startbtn").disabled = true;
    startbtn.style("opacity", 0);
  });

  console.log("Vertical");

  var submitbtn = d3.select("#submit");
  submitbtn.on("click", function() {
    document.getElementById("submit").disabled = true;
    svg.style("opacity", 0);
    display1.style("opacity", 0);
    display2.style("opacity", 0);
    display3.style("opacity", 0);
    display6.style("opacity", 0);
    display7.style("opacity", 0);
    display4.style("opacity", 0);
    display5.style("opacity", 1);
    startbtn.style("opacity", 1);
    document.getElementById("startbtn").disabled = false;

    //document.getElementById("startbtn").innerHTML='Start';
    // radio1=document.getElementById("radio21");
    // radio2=document.getElementById("radio22");
    Value = document.getElementById("value2").value;

    // if(radio1.checked) ID=1;
    // else if(radio2.checked) ID=2;
    // else ID=0;

    ID = 2;

    console.log("Id:" + ID);
    console.log("Value:" + Value);
    save_json("Vertical", ID, Value, m_s, m_s0);

    // radio1.checked=false;
    // radio2.checked=false;
    document.getElementById("value2").value = 1;
    output.innerHTML = slider.value;
    //window.confirm("You Entered "+ID+" and "+Value);

    circles
      .attr("cy", function(d) {
        d.y = 50;
        d.y_diff = 0.5;
        return d.y;
      })
      .attr("cx", function(d) {
        return d.x;
      });

    t.stop();
    move_true = false;
    count = 0;
    setTimeout(delay, 500);

    function delay() {
      lines.remove();
      circles.remove();
      texts.remove();
      array_elem1++;
      current_elem++;
      next_element();
    }
  });

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

function motion3(num) {
  var circle1_1 = [1.4, 0.2, 0.4, 0.2, 1.6, 0.2, 0.4, 0.3, 0.2, 1.0];
  var circle2_1 = [2.5, 2.5, 2.0, 3.0, 1.8, 0.36, 2.8, 3.0, 0.6, 3.0];

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
      speed: 2,
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
  document.getElementById("submit").disabled = true;
  svg.style("opacity", 0);
  display1.style("opacity", 0);
  display2.style("opacity", 0);
  display3.style("opacity", 0);
  display4.style("opacity", 0);
  display5.style("opacity", 1);
  display6.style("opacity", 0);
  display7.style("opacity", 0);
  var startbtn1 = d3.select("#startbtn");
  startbtn1.on("click", function() {
    if (count == 0) {
      t1 = d3.timer(animate1);
      move_true = true;
      count = 1;
      document.getElementById("submit").disabled = false;
      svg.style("opacity", 1);
      display1.style("opacity", 1);
      display2.style("opacity", 1);
      display3.style("opacity", 1);
      display6.style("opacity", 1);
      display7.style("opacity", 1);
      display4.style("opacity", 1);
      display5.style("opacity", 0);
    } else if (count == 1) {
      t1.stop();
      move_true = false;
      count = 0;
      timer_ret_val = true;
    } else;

    document.getElementById("startbtn").disabled = true;
    startbtn1.style("opacity", 0);
  });

  console.log("Flicker");

  var submitbtn1 = d3.select("#submit");
  submitbtn1.on("click", function() {
    document.getElementById("submit").disabled = true;
    svg.style("opacity", 0);
    display1.style("opacity", 0);
    display2.style("opacity", 0);
    display3.style("opacity", 0);
    display6.style("opacity", 0);
    display7.style("opacity", 0);
    display4.style("opacity", 0);
    display5.style("opacity", 1);
    startbtn1.style("opacity", 1);
    document.getElementById("startbtn").disabled = false;

    // radio1=document.getElementById("radio21");
    // radio2=document.getElementById("radio22");
    Value = document.getElementById("value2").value;
    output.innerHTML = slider.value;

    // if(radio1.checked) ID=1;
    // else if(radio2.checked) ID=2;
    // else ID=0;
    ID = 2;
    console.log("Id:" + ID);
    console.log("Value:" + Value);
    save_json("Flicker", ID, Value, m_s_1, m_s0_1);

    // radio1.checked=false;
    // radio2.checked=false;
    document.getElementById("value2").value = 1;
    output.innerHTML = slider.value;

    circles1.attr("r", function(d) {
      d.radius = 40;
      d.r_diff = 0.33;
      d.time = 0;
      return d.radius;
    });

    t1.stop();
    move_true = false;
    count = 0;

    setTimeout(delay1, 500);

    function delay1() {
      box.remove();
      circles1.remove();
      texts1.remove();
      array_elem2++;
      current_elem++;
      next_element();
    }
  });

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

function motion4(num) {
  var circle1_2 = [0.2, 0.4, 0.2, 0.4, 0.2, 1.6, 1.4, 1.0, 0.3, 0.2];
  var circle2_2 = [0.36, 2.8, 2.5, 2.0, 3.0, 1.8, 2.5, 3.0, 3.0, 0.6];

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
      speed: 2,
      radius: 10,
      move: 0
    },
    {
      x: 250,
      y: 100,
      id: 2,
      r_diff: 0.13,
      speed: 2,
      radius: 10,
      move: 0
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

  var circles_2 = svg
    .selectAll(".circle")
    .data(circle_data_2)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("r", function(d) {
      return d.radius;
    })
    .attr("fill", "#008fb3")
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    });

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

  var t_2;
  document.getElementById("submit").disabled = true;
  svg.style("opacity", 0);
  display1.style("opacity", 0);
  display2.style("opacity", 0);
  display3.style("opacity", 0);
  display4.style("opacity", 0);
  display6.style("opacity", 0);
  display7.style("opacity", 0);
  display5.style("opacity", 1);
  var startbtn_2 = d3.select("#startbtn");
  startbtn_2.on("click", function() {
    if (count == 0) {
      t_2 = d3.timer(animate_2);
      move_true = true;
      count = 1;
      document.getElementById("submit").disabled = false;
      svg.style("opacity", 1);
      display1.style("opacity", 1);
      display2.style("opacity", 1);
      display3.style("opacity", 1);
      display6.style("opacity", 1);
      display7.style("opacity", 1);
      display4.style("opacity", 1);
      display5.style("opacity", 0);
    } else if (count == 1) {
      t_2.stop();
      move_true = false;
      count = 0;
      timer_ret_val = true;
    } else;

    document.getElementById("startbtn").disabled = true;
    startbtn_2.style("opacity", 0);
  });

  console.log("Expansion");

  var submitbtn2 = d3.select("#submit");
  submitbtn2.on("click", function() {
    document.getElementById("submit").disabled = true;
    svg.style("opacity", 0);
    display1.style("opacity", 0);
    display2.style("opacity", 0);
    display3.style("opacity", 0);
    display6.style("opacity", 0);
    display7.style("opacity", 0);
    display4.style("opacity", 0);
    display5.style("opacity", 1);
    startbtn_2.style("opacity", 1);
    document.getElementById("startbtn").disabled = false;

    // radio1=document.getElementById("radio21");
    // radio2=document.getElementById("radio22");
    Value = document.getElementById("value2").value;
    output.innerHTML = slider.value;

    // if(radio1.checked) ID=1;
    // else if(radio2.checked) ID=2;
    // else ID=0;
    ID = 2;

    console.log("Id:" + ID);
    console.log("Value:" + Value);
    save_json("Expansion", ID, Value, m_s_2, m_s0_2);

    // radio1.checked=false;
    // radio2.checked=false;
    document.getElementById("value2").value = 1;
    output.innerHTML = slider.value;

    circles_2.attr("r", function(d) {
      d.radius = 10;
      d.r_diff = 0.13;
      return d.radius;
    });

    t_2.stop();
    move_true = false;
    count = 0;

    setTimeout(delay2, 500);

    function delay2() {
      box_2.remove();
      circles_2.remove();
      texts_2.remove();
      array_elem3++;
      current_elem++;
      location.href = "./position.html";
      //next_element();
    }
  });

  function animate_2(elapsed) {
    circles_2
      .attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      })
      .attr("r", function(d) {
        if (move_true && d.id == 1) {
          d.radius = d.radius + d.speed * m_s1_2 * d.r_diff;
          if (d.radius < 10 || d.radius > 50) {
            d.r_diff = d.r_diff * -1;
          } else;
          return d.radius;
        } else if (move_true && d.id == 2) {
          d.radius = d.radius + d.speed * m_s2_2 * d.r_diff;
          if (d.radius < 10 || d.radius > 50) {
            d.r_diff = d.r_diff * -1;
          } else;
          return d.radius;
        } else return d.radius;
      });
    return timer_ret_val;
  }
}

function save_json(type, id, value, s1, s2) {
  var date_1 = new Date();
  results_json.push({
    Type: type,
    ID: id,
    Value: value,
    Speed1: s1,
    Speed2: s2
  }); // contour: i+1, points: highlight_data[i]})
}

function WriteFile() {
  var jsonContent =
    "text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(results_json));
  var a = document.createElement("a");
  a.href = "data:" + jsonContent;
  a.download = "motion_non.json";
  a.click();
  var user_selection = results_json;
  setCookie("user_selection", results_json);
  location.href = "./end.html";
}

function setCookie(cname, cvalue) {
  document.cookie = cname + "=" + cvalue + ";path=/"; // document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
