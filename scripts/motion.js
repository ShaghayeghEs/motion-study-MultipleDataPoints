generate_motion();
generate_pair1();
generate_pair2();
generate_pair3();



console.log("array");
for(i=0;i<30;i++)
{
    console.log(i);
    console.log(motion_type[i]);
}
console.log("pair1");
for(var j=0;j<10;j++)
{

  console.log(motion1_pair[j]);
}

console.log("pair2");
for(var j=0;j<10;j++)
{

  console.log(motion2_pair[j]);
}

console.log("pair3");
for(var j=0;j<10;j++)
{

  console.log(motion3_pair[j]);
}

      var ID;
      var Value;
      var radio1;
      var radio2;
      var results_json=[];
      var current_elem=0;
      var array_elem1=0;
      var array_elem2=0;
      var array_elem3=0;
      var pair1;
      var pair2;
      var pair3;

      var move_true;
      var count;
      var time;

var slider = document.getElementById("value2");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
}

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


var svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');


function next_element()
{
   var element= motion_type[current_elem];

   if(current_elem<30){
  
   if(element==1)
   {
        pair1= motion1_pair[array_elem1];
        motion2(pair1);
   }

   if(element==2)
   {
        pair2= motion2_pair[array_elem2];
        motion3(pair2);
   }

   if(element==3)
   {
        pair3= motion3_pair[array_elem3];
        motion4(pair3);
   }

   else;
 }

  else
  {

    WriteFile();
    svg.remove();
  }

       
}

var display1= d3.select("#chart");
var display2= d3.select("#test");
var display3= d3.select("#ranger");
var display4= d3.select("#last");
var display5= d3.select("#notice");


function motion2(num)
{


var circle1=[1.6,1.4,0.2,0.4,1.0,0.4,0.3,0.2,0.2,0.2];
var circle2=[1.8,2.5,0.6,2.0,3.0,2.8,3.0,2.5,3.0,0.36];

var count1=1;
var count2=1;
var m_s=circle1[num];
var m_s0=circle2[num];
var m_s1= m_s/0.20; //console.log(m_s1);
var m_s2=m_s0/0.20; //console.log(m_s2);



var cycle1=0;
var cycle2=0;


var radius = 10;
move_true=false;
count=0;


var circle_data = [{
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


var line_data=  [{
    x1: 40,
    y1: 20,
    x2: 60,
    y2: 20,

},
{
    x1: 50,
    y1: 20,
    x2: 50,
    y2: 230,

},
{
    x1: 100,
    y1: 20,
    x2: 100,
    y2: 230,

},
{
    x1: 40,
    y1: 230,
    x2: 60,
    y2: 230,

},
{
    x1: 90,
    y1: 20,
    x2: 110,
    y2: 20,

},
{
    x1: 90,
    y1: 230,
    x2: 110,
    y2: 230,

}

];



var lines= svg.selectAll(".line")
    .data(line_data)
    .enter()
    .append("line")
    .attr("class","line")
    .style("stroke", "black")
    .attr("stroke-width", 2)
    .attr("x1",function(d){ return d.x1})
    .attr("y1",function(d){ return d.y1})
    .attr("x2",function(d){ return d.x2})
    .attr("y2",function(d){ return d.y2});

var circles = svg.selectAll('.circle')
    .data(circle_data)
    .enter()
    .append('circle')
    .attr('class', 'circle')
    .attr('r', radius)
    .attr('fill', '#007a99')
    .attr('cx', function(d) {
        return d.x;
    })
    .attr('cy', function(d) {
        return d.y;
    });

var text_data=[{x:45,y:250,id:1},{x:95,y:250,id:2}];

var texts=svg.selectAll(".text")
         .data(text_data)
         .enter()
         .append("text")
         .attr("class","text")
         .attr("x", function(d) { return d.x; })
         .attr("y", function(d) { return d.y; })
         .text( function (d) { return d.id; })
         .attr("font-family", "sans-serif")
         .attr("font-size", "15px")
         .attr("fill", "black");
    
var t;
document.getElementById("submit").disabled= true;
display1.style("opacity", 0);
display2.style("opacity", 0);
display3.style("opacity", 0);
display4.style("opacity", 0);
display5.style("opacity", 1);
svg.style("opacity", 0);
var startbtn=d3.select("#startbtn");
startbtn.on("click", function() {

time=0;
if(count==0)
{
   t= d3.timer(animate);

   document.getElementById("submit").disabled= false;
   svg.style("opacity", 1);
   display1.style("opacity", 1);
   display2.style("opacity", 1);
   display3.style("opacity", 1);
   display4.style("opacity", 1);
   move_true=true;
   count=1;


   display5.style("opacity", 0);
   startbtn.style("opacity", 0);
   document.getElementById("startbtn").disabled= true;
}
// else if (count==1){
//     t.stop();
//     move_true=false;
//     count=0;
//     timer_ret_val = true;

// }

else;



});


console.log("Vertical");


var submitbtn=d3.select("#submit");
submitbtn.on("click", function()  {

document.getElementById("submit").disabled= true;
svg.style("opacity", 0);
display1.style("opacity", 0);
display2.style("opacity", 0);
display3.style("opacity", 0);
display4.style("opacity", 0);
display5.style("opacity", 1);
startbtn.style("opacity", 1);
document.getElementById("startbtn").disabled= false;


// radio1=document.getElementById("radio21");
// radio2=document.getElementById("radio22");
Value=document.getElementById("value2").value;



 // if(radio1.checked) ID=1;
 // else if(radio2.checked) ID=2;
 // else ID=0;
ID=1;
 console.log("Id:"+ID);
 console.log("Value:"+Value);
 save_json("Vertical",ID,time,Value,m_s,m_s0);


 // radio1.checked=false;
 // radio2.checked=false;
 document.getElementById("value2").value=1;
 output.innerHTML = slider.value;


circles
.attr('cy',function(d){
     d.y=50;
     d.y_diff=0.5;
     return d.y;
})
.attr('cx',function(d){
     return d.x;
});

t.stop();
move_true=false;
count=0;
setTimeout(delay,500);

function delay(){


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
        .attr('cy', function(d) {
        if(move_true && d.id==1)
        {   
            var x;
            if(m_s1>=m_s2){
            if(cycle1<4){     
            d.y = d.y + (d.speed*m_s1* d.y_diff);
            if (d.y <= 50 || d.y >= 200) {
                d.y_diff = d.y_diff * -1;
                if(d.y<=50 && m_s1>=m_s2) { count1++; cycle1++;}
            } 
            else ;
            }


            if(cycle1>=4 && cycle2>=90)
            {
             // d.y=50;
             // d.y_diff=0.5;
             cycle1=0;
             cycle2=0;

            }
            else
            {

            }
            }

            if(m_s1<m_s2){
            if(cycle2<4){     
            d.y = d.y + (d.speed*m_s1* d.y_diff);
            if (d.y <= 50 || d.y >= 200) {
                d.y_diff = d.y_diff * -1;
                if(d.y<=50 && m_s1<m_s2) { count1++; cycle2++;}
            } 
            else ;
            }
            if(cycle2>=4)
            	cycle2++;

            else
            {

            }

            }

           
            return d.y;
        }
        else if(move_true && d.id!=1)
        {
            var x;
            if(m_s2>=m_s1){
            if(cycle1<4){     
            d.y = d.y + (d.speed*m_s2* d.y_diff);
            if (d.y <= 50 || d.y >= 200) {
                d.y_diff = d.y_diff * -1;
                if(d.y<=50 && m_s2>=m_s1) { count1++; cycle1++;}
              
            } 
            else ;
            }

            if(cycle1>=4 && cycle2>=90)
            {
             // d.y=50;
             // d.y_diff=0.5;
             cycle1=0;
             cycle2=0;

            }
            else
            {

            }
            }

            if(m_s2<m_s1){
            if(cycle2<4){     
            d.y = d.y + (d.speed*m_s2* d.y_diff);
            if (d.y <= 50 || d.y >= 200) {
                d.y_diff = d.y_diff * -1;
                if(d.y<=50 && m_s2<m_s1) { count1++; cycle2++;}
            } 
            else ;
            }

            if(cycle2>=4)
            cycle2++;

            else
            {

            }
            }

            return d.y;

        }
        else
           return d.y;
        })
         .attr('cx', function(d) {
            return d.x;
        });

    time=elapsed;
    return timer_ret_val;   
}

}

function motion3(num)
{


var circle1_1=[1.6,1.4,0.2,0.4,1.0,0.4,0.3,0.2,0.2,0.2];
var circle2_1=[1.8,2.5,0.6,2.0,3.0,2.8,3.0,2.5,3.0,0.36];



var count1_1=1;
var count2_1=1;
var m_s_1=circle1_1[num];
var m_s0_1=circle2_1[num];
var m_s1_1= m_s_1/0.20; 
var m_s2_1=m_s0_1/0.20; 


count=0;
cycle1=0;
cycle2=0;

var circle_data1 = [{
    x: 80,
    y: 100,
    id: 1,
    r_diff: 0.33,
    speed: 2,
    radius: 40,
    move: 0,
    color: "#007a99",
    time:0
},
{
    x: 250,
    y: 100,
    id: 2,
    r_diff: 0.33,
    speed: 2,
    radius : 40,
    move: 0,
    color: "#007a99",
    time:0
}
];

var box_data=  [
{
    x: 20,
    y: 40,
    h: 125,
    w :125
},
{
    x: 190,
    y: 40,
    h: 125,
    w:125

}
];



var box= svg.selectAll(".rect")
    .data(box_data)
    .enter()
    .append("rect")
    .attr("class","rect")
    .style("fill","white")
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("x",function(d){ return d.x})
    .attr("y",function(d){ return d.y})
    .attr("height",function(d){ return d.h})
    .attr("width",function(d){ return d.w});



var circles1 = svg.selectAll('.circle')
    .data(circle_data1)
    .enter()
    .append('circle')
    .attr('class', 'circle')
    .attr('r', function(d){return d.radius;})
    .attr('fill', function(d){return d.color;})
    .attr('cx', function(d) {
        return d.x;
    })
    .attr('cy', function(d) {
        return d.y;
    });




var text_data1=[{x:80,y:195,id:1},{x:250,y:195,id:2}];

var texts1=svg.selectAll(".text")
         .data(text_data1)
         .enter()
         .append("text")
         .attr("class","text")
         .attr("x", function(d) { return d.x; })
         .attr("y", function(d) { return d.y; })
         .text( function (d) { return d.id; })
         .attr("font-family", "sans-serif")
         .attr("font-size", "15px")
         .attr("fill", "black");
    
var t1;
document.getElementById("submit").disabled= true;
svg.style("opacity", 0);
display1.style("opacity", 0);
display2.style("opacity", 0);
display3.style("opacity", 0);
display4.style("opacity", 0);
display5.style("opacity", 1);
var startbtn1=d3.select("#startbtn");
startbtn1.on("click", function() {
  time=0;
if(count==0)
{
   t1= d3.timer(animate1);

   document.getElementById("submit").disabled= false;
   svg.style("opacity", 1);
   display1.style("opacity", 1);
   display2.style("opacity", 1);
   display3.style("opacity", 1);
   display4.style("opacity", 1);
   move_true=true;
   count=1;

   display5.style("opacity", 0);
   startbtn1.style("opacity", 0);
   document.getElementById("startbtn").disabled= true;


}
// else if (count==1){
//     t1.stop();
//     move_true=false;
//     count=0;
//     timer_ret_val = true;

// }

else;


});



console.log("Flicker");

var submitbtn1=d3.select("#submit");
submitbtn1.on("click", function()  {

document.getElementById("submit").disabled= true;
svg.style("opacity", 0);
display1.style("opacity", 0);
display2.style("opacity", 0);
display3.style("opacity", 0);
display4.style("opacity", 0);
display5.style("opacity", 1);
startbtn1.style("opacity", 1);
document.getElementById("startbtn").disabled= false;

// radio1=document.getElementById("radio21");
// radio2=document.getElementById("radio22");
Value=document.getElementById("value2").value;



 // if(radio1.checked) ID=1;
 // else if(radio2.checked) ID=2;
 // else ID=0;

 ID=2;

 console.log("Id:"+ID);
 console.log("Value:"+Value);
 save_json("Flicker",ID,time,Value,m_s_1, m_s0_1);


 // radio1.checked=false;
 // radio2.checked=false;
 document.getElementById("value2").value=1;
 output.innerHTML = slider.value;

circles1
.attr('r',function(d){
     d.radius=40;
     d.r_diff=0.33;
     d.time=0;
     return d.radius;
});



t1.stop();
move_true=false;
count=0;

setTimeout(delay1,500);

function delay1(){


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
        .attr('cx', function(d) {
           return d.x;
        })
        .attr('cy', function(d) {
            return d.y;
        })
        .attr('r',function(d){
        if(move_true && d.id==1)
        {
            
            if(m_s1_1>=m_s2_1) {
            if(cycle1<4){
            d.time=  d.time+(d.speed *m_s1_1* d.r_diff);
            if (d.time>100) {

               d.radius=0;
                d.r_diff = d.r_diff * -1;
            } 
            if (d.time<0)
            {
                d.radius=40;
                d.r_diff = d.r_diff * -1;
                if(m_s1_1>=m_s2_1) cycle1++;

            } 
           }

            if(cycle1>=4 && cycle2>=90)
            {
      
             cycle1=0;
             cycle2=0;

            }
            else
            {

            }
        }

        if(m_s1_1<m_s2_1)
        {
            if(cycle2<4){
            d.time=  d.time+(d.speed *m_s1_1* d.r_diff);
            if (d.time>100) {

               d.radius=0;
                d.r_diff = d.r_diff * -1;
            } 
            if (d.time<0)
            {
                d.radius=40;
                d.r_diff = d.r_diff * -1;
                if(m_s1_1<m_s2_1) cycle2++;

            } 
           }

            if(cycle2>=4) 
            {
 
                cycle2++;
                //console.log(cycle2);
            }


        }


            return d.radius;
        }
        else if(move_true && d.id==2)
        {
            if(m_s2_1>=m_s1_1) {
            if(cycle1<4){
            d.time=  d.time+(d.speed *m_s2_1* d.r_diff);
            if (d.time>100) {

               d.radius=0;
                d.r_diff = d.r_diff * -1;
            } 
            if (d.time<0)
            {
                d.radius=40;
                d.r_diff = d.r_diff * -1;
                if(m_s2_1>=m_s1_1) cycle1++;

            } 
           }

            if(cycle1>=4 && cycle2>=90)
            {
 
             cycle1=0;
             cycle2=0;

            }
            else
            {

            }
        }

        if(m_s2_1<m_s1_1)
        {
            if(cycle2<4){
            d.time=  d.time+(d.speed *m_s2_1* d.r_diff);
            if (d.time>100) {

               d.radius=0;
                d.r_diff = d.r_diff * -1;
            } 
            if (d.time<0)
            {
                d.radius=40;
                d.r_diff = d.r_diff * -1;
                if(m_s2_1<m_s1_1) cycle2++;

            } 
           }

            if(cycle2>=4) 
            {
 
                cycle2++;
                //console.log(cycle2);
            }


        }

            return d.radius;
        }});
    time=elapsed;
    return timer_ret_val;   
}
}


function motion4(num)
{

var fnc_count_2=0;


var circle1_2=[1.6,1.4,0.2,0.4,1.0,0.4,0.3,0.2,0.2,0.2];
var circle2_2=[1.8,2.5,0.6,2.0,3.0,2.8,3.0,2.5,3.0,0.36];


var count1_2=1;
var count2_2=1;
var m_s_2=circle1_2[num];
var m_s0_2=circle2_2[num];
var m_s1_2= m_s_2/0.20; 
var m_s2_2=m_s0_2/0.20; 



count=0;
cycle1=0;
cycle2=0;


var circle_data_2 = [{
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
    radius : 10,
    move: 0
}
];

var box_data_2=  [
{
    x: 20,
    y: 40,
    h: 125,
    w :125
},
{
    x: 190,
    y: 40,
    h: 125,
    w:125

}
];



var box_2= svg.selectAll(".rect")
    .data(box_data_2)
    .enter()
    .append("rect")
    .attr("class","rect")
    .style("fill","white")
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("x",function(d){ return d.x})
    .attr("y",function(d){ return d.y})
    .attr("height",function(d){ return d.h})
    .attr("width",function(d){ return d.w});



var circles_2 = svg.selectAll('.circle')
    .data(circle_data_2)
    .enter()
    .append('circle')
    .attr('class', 'circle')
    .attr('r', function(d){return d.radius;})
    .attr('fill', '#007a99')
    .attr('cx', function(d) {
        return d.x;
    })
    .attr('cy', function(d) {
        return d.y;
    });


var text_data_2=[{x:80,y:195,id:1},{x:250,y:195,id:2}];

var texts_2=svg.selectAll(".text")
         .data(text_data_2)
         .enter()
         .append("text")
         .attr("class","text")
         .attr("x", function(d) { return d.x; })
         .attr("y", function(d) { return d.y; })
         .text( function (d) { return d.id; })
         .attr("font-family", "sans-serif")
         .attr("font-size", "15px")
         .attr("fill", "black");
    
    
var t_2;
document.getElementById("submit").disabled= true;
svg.style("opacity", 0);
display1.style("opacity", 0);
display2.style("opacity", 0);
display3.style("opacity", 0);
display4.style("opacity", 0);
display5.style("opacity", 1);
var startbtn_2=d3.select("#startbtn");
startbtn_2.on("click", function() {
  time=0;
if(count==0)
{
   t_2= d3.timer(animate_2);
   document.getElementById("submit").disabled= false;
   svg.style("opacity", 1);
   display1.style("opacity", 1);
   display2.style("opacity", 1);
   display3.style("opacity", 1);
   display4.style("opacity", 1);
   display5.style("opacity", 0);
   startbtn_2.style("opacity", 0);
   document.getElementById("startbtn").disabled= true;
   move_true=true;
   count=1;


   //document.getElementById("startbtn").innerHTML='Stop';
}
// else if (count==1){
//     t_2.stop();
//     move_true=false;
//     count=0;
//  //   document.getElementById("startbtn").innerHTML='Start';
//     timer_ret_val = true;

// }

else;


});


// var stopbtn_2=d3.select("#stopbtn");
// stopbtn_2.on("click", function()  {

//     t_2.stop();
//     move_true=false;
//     count=0;
//     timer_ret_val = true;
//   //  console.log(count);
// });

console.log("Expansion");

var submitbtn2=d3.select("#submit");
submitbtn2.on("click", function()  {

document.getElementById("submit").disabled= true;
svg.style("opacity", 0);
display1.style("opacity", 0);
display2.style("opacity", 0);
display3.style("opacity", 0);
display4.style("opacity", 0);
display5.style("opacity", 1);
startbtn_2.style("opacity", 1);
document.getElementById("startbtn").disabled= false;


// radio1=document.getElementById("radio21");
// radio2=document.getElementById("radio22");
Value=document.getElementById("value2").value;



 // if(radio1.checked) ID=1;
 // else if(radio2.checked) ID=2;
 // else ID=0;

 ID=3;

 console.log("Id:"+ID);
 console.log("Value:"+Value);
 save_json("Expansion",ID,time,Value,m_s_2, m_s0_2);


// radio1.checked=false;
// radio2.checked=false;
document.getElementById("value2").value=1;
output.innerHTML = slider.value;

 circles_2
.attr('r',function(d){
     d.radius=10;
     d.r_diff=0.13;
     return d.radius;
});


t_2.stop();
move_true=false;
count=0;


setTimeout(delay2,500);

function delay2(){

box_2.remove();
circles_2.remove();
texts_2.remove();
array_elem3++;
current_elem++;
next_element();
}

});



function animate_2(elapsed) {

         circles_2
        .attr('cx', function(d) {
           return d.x;
        })
        .attr('cy', function(d) {
            return d.y;
        })
        .attr('r',function(d){
        if(move_true && d.id==1)
        {
           
           if(m_s1_2>=m_s2_2){

            if(cycle1<4){
            d.radius = d.radius + (d.speed *m_s1_2* d.r_diff);
            if (d.radius <= 10 || d.radius >= 50) {
                d.r_diff = d.r_diff * -1;
                if(d.radius<=10 && m_s1_2>=m_s2_2) {cycle1++;}
            } else ;
          }
           if(cycle1>=4 && cycle2>=90)
            {
             d.radius=10;
             d.r_diff=0.13;
             cycle1=0;
             cycle2=0;

            }
            if(cycle1>=4 && cycle2<90)
            {
                d.radius=10;
                d.r_diff=0.13;
            }
            else
            {
                // d.radius=10;
                // d.r_diff=0.13;
            }
        }


        if(m_s1_2<m_s2_2){

          if(cycle2<4){
            d.radius = d.radius + (d.speed *m_s1_2* d.r_diff);
            if (d.radius <= 10 || d.radius >= 50) {
                d.r_diff = d.r_diff * -1;
                if(d.radius<=10 && m_s1_2<m_s2_2) {cycle2++;}
            } else ;
          }
          
          if(cycle2>=4) 
            {
 
                cycle2++;
                d.radius=10;
                d.r_diff=0.13;

                //console.log(cycle2);
            }

        }

            return d.radius;
        }
        else if(move_true && d.id==2)
        {
           if(m_s2_2>=m_s1_2){

            if(cycle1<4){
            d.radius = d.radius + (d.speed *m_s2_2* d.r_diff);
            if (d.radius <= 10 || d.radius >= 50) {
                d.r_diff = d.r_diff * -1;
                if(d.radius<=10 && m_s2_2>=m_s1_2) {cycle1++;}
            } else ;
          }
           if(cycle1>=4 && cycle2>=90)
            {
             d.radius=10;
             d.r_diff=0.13;
             cycle1=0;
             cycle2=0;

            }
            if(cycle1>=4 && cycle2<90)
            {
                d.radius=10;
                d.r_diff=0.13;
            }
            else
            {

                // d.radius=10;
                // d.r_diff=0.13;
            }
        }


        if(m_s2_2<m_s1_2){

          if(cycle2<4){
            d.radius = d.radius + (d.speed *m_s2_2* d.r_diff);
            if (d.radius <= 10 || d.radius >= 50) {
                d.r_diff = d.r_diff * -1;
                if(d.radius<=10 && m_s2_2<m_s1_2) {cycle2++;}
            } else ;
          }
          
          if(cycle2>=4) 
            {
 
                cycle2++;
                d.radius=10;
                d.r_diff=0.13;
                //console.log(cycle2);
            }

        }
           
            return d.radius;

        }
        else
            return d.radius;
        }) ;
        time=elapsed;
    return timer_ret_val;   
}
}



function save_json(type,id,time,value,s1,s2){  


      results_json.push({Type: type, ID: id,Time: time, Value: value , Speed1: s1, Speed2:s2});// contour: i+1, points: highlight_data[i]})
  
}

// Modified by Shae - Mar 7, 2019

function WriteFile(){
    

    var jsonContent = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results_json));
    var a = document.createElement('a');
    a.href = 'data:' + jsonContent;
    a.download = 'motion_syn.json';
    a.innerHTML = 'End Study';
    a.click();
    var input;
    input = prompt ('Did you download the json file? (y/n)');
    while (input == 'n') {
      a.download = 'motion_syn.json';
      a.click();
      input = prompt ('Did you download the json file? (y/n)');
    }
    location.href="./Start.html";
    
}




