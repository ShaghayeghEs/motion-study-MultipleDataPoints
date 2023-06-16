var svg = d3.select("svg"),
  margin = {
    top: 20,
    right: 10,
    bottom: 30,
    left: 130
  },
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom,
  g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%d-%b-%y");

var x = d3
  .scaleBand()
  .rangeRound([0, width])
  .padding(0.1);

var y = d3.scaleLinear().rangeRound([height, 0]);

data = [
  {
    id: "0",
    item: "1",
    length: "20"
  },
  {
    id: "1",
    item: "2",
    length: (url_data["ratio"] * 20).toString()
  }
];
console.log(data);
x.domain(
  data.map(function(d) {
    return d.item;
  })
);
y.domain([
  0,
  d3.max(data, function(d) {
    return Number(d.length);
  })
]);

g.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x).tickSize(0))
  .style("font-size", "16px");

g.append("g")
  .call(d3.axisLeft(y).tickSize(0))
  .selectAll("text")
  .remove()
  .append("text")
  .attr("fill", "#000")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("text-anchor", "end")
  .text("length");

g.selectAll(".bar")
  .data(data)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", function(d) {
    return x(d.item);
  })
  .attr("y", function(d) {
    return y(Number(d.length));
  })
  .attr("width", x.bandwidth())
  .attr("height", function(d) {
    return height - y(Number(d.length));
  })
  .attr("fill", "#008fb3");
