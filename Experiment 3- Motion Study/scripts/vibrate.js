var circleRadius = 10;

var data = [
  {
    id: "0",
    item: "1",
    xVal: "160",
    speed: "10"
  },
  {
    id: "1",
    item: "2",
    xVal: "250",
    speed: (url_data["ratio"] * 10).toString()
  }
];
console.log(data);

var chart;

var svg = d3.select("svg");
var circle = svg.selectAll("circle").data(data, function(d) {
  return d;
});

circle
  .enter()
  .append("circle")
  .attr("cy", 130)
  .attr("cx", function(d) {
    return d.xVal;
  })
  .attr("r", 20)
  .attr("fill", "#008fb3")
  .attr("speed", function(d) {
    return d.speed;
  });

vibrate();
function vibrate() {
  circles = svg.selectAll("circle");
  circles.transition().on("start", function repeat() {
    // console.log(circles.attr("cx"));
    d3.active(this)
      .attr("cx", function(d) {
        return (parseInt(d.xVal, 10) + 20).toString();
      })
      .transition()
      .duration(function(d) {
        return d.speed;
      })
      .attr("cx", function(d) {
        return d.xVal;
      })
      .transition()
      .on("start", repeat);
  });
}

svg
  .selectAll(".text")
  .data(data)
  .enter()
  .append("text")
  .attr("cy", 200)
  .attr("class", "label")
  .attr("x", function(d) {
    return d.xVal;
  })
  .attr("dx", "0.25em")
  .attr("dy", "10.75em")
  .text(function(d) {
    return d.item;
  });
