var motion1;
var motion2;
var motion3;
var motion1_pair=[];
var motion2_pair=[];
var motion3_pair=[];
var motion_type=[];




function generate_motion(){

var i=0;
var rand;
var t1=0;
var t2=0;
var t3=0;

for(i=0;i<30;i++){

    generate_random(i);
}


function generate_random(i){

rand= Math.floor((Math.random()*3)+1);

console.log(rand);
if(rand==1)
{
    if(t1<10){
        motion_type[i]=rand;
        t1++;
        return;
    }

    else 
   {
    
    generate_random(i);
    return;

   }

}



if(rand==2)
{
     if(t2<10){
        motion_type[i]=rand;
        t2++;
        return;
    }

    else 
   {
    
    generate_random(i);
    return;

   }

}


if(rand==3)
{
    if(t3<10){
        motion_type[i]=rand;
        t3++;
        return;
    }

    else 
   {
    
    generate_random(i);
    return;

   }

}
}

}







function generate_pair1(){

var i=0;
var rand;
var t0=0;
var t1=0;
var t2=0;
var t3=0;
var t4=0;
var t5=0;
var t6=0;
var t7=0;
var t8=0;
var t9=0;


for(i=0;i<10;i++){

    generate_random_pair(i);
}


function generate_random_pair(i){

rand=Math.floor(Math.random() * 10);

console.log(rand);

if(rand==0)
{
    if(t0<1){
        motion1_pair[i]=rand;
        t0++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}
if(rand==1)
{
    if(t1<1){
        motion1_pair[i]=rand;
        t1++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}



if(rand==2)
{
     if(t2<1){
        motion1_pair[i]=rand;
        t2++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}


if(rand==3)
{
    if(t3<1){
        motion1_pair[i]=rand;
        t3++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}
if(rand==4)
{
    if(t4<1){
        motion1_pair[i]=rand;
        t4++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}
if(rand==5)
{
    if(t5<1){
        motion1_pair[i]=rand;
        t5++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}
if(rand==6)
{
    if(t6<1){
        motion1_pair[i]=rand;
        t6++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}
if(rand==7)
{
    if(t7<1){
        motion1_pair[i]=rand;
        t7++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}

if(rand==8)
{
    if(t8<1){
        motion1_pair[i]=rand;
        t8++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}

if(rand==9)
{
    if(t9<1){
        motion1_pair[i]=rand;
        t9++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}


}

}

function generate_pair2(){

var i=0;
var rand;
var t0=0;
var t1=0;
var t2=0;
var t3=0;
var t4=0;
var t5=0;
var t6=0;
var t7=0;
var t8=0;
var t9=0;


for(i=0;i<10;i++){

    generate_random_pair(i);
}


function generate_random_pair(i){

rand=Math.floor(Math.random() * 10);

console.log(rand);

if(rand==0)
{
    if(t0<1){
        motion2_pair[i]=rand;
        t0++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}
if(rand==1)
{
    if(t1<1){
        motion2_pair[i]=rand;
        t1++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}



if(rand==2)
{
     if(t2<1){
        motion2_pair[i]=rand;
        t2++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}


if(rand==3)
{
    if(t3<1){
        motion2_pair[i]=rand;
        t3++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}
if(rand==4)
{
    if(t4<1){
        motion2_pair[i]=rand;
        t4++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}
if(rand==5)
{
    if(t5<1){
        motion2_pair[i]=rand;
        t5++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}
if(rand==6)
{
    if(t6<1){
        motion2_pair[i]=rand;
        t6++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}
if(rand==7)
{
    if(t7<1){
        motion2_pair[i]=rand;
        t7++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}

if(rand==8)
{
    if(t8<1){
        motion2_pair[i]=rand;
        t8++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}

if(rand==9)
{
    if(t9<1){
        motion2_pair[i]=rand;
        t9++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}

}

}


function generate_pair3(){

var i=0;
var rand;
var t0=0;
var t1=0;
var t2=0;
var t3=0;
var t4=0;
var t5=0;
var t6=0;
var t7=0;
var t8=0;
var t9=0;


for(i=0;i<10;i++){

    generate_random_pair(i);
}


function generate_random_pair(i){

rand=Math.floor(Math.random() * 10);

console.log(rand);

if(rand==0)
{
    if(t0<1){
        motion3_pair[i]=rand;
        t0++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}
if(rand==1)
{
    if(t1<1){
        motion3_pair[i]=rand;
        t1++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}



if(rand==2)
{
     if(t2<1){
        motion3_pair[i]=rand;
        t2++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}


if(rand==3)
{
    if(t3<1){
        motion3_pair[i]=rand;
        t3++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}
if(rand==4)
{
    if(t4<1){
        motion3_pair[i]=rand;
        t4++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}
if(rand==5)
{
    if(t5<1){
        motion3_pair[i]=rand;
        t5++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}
if(rand==6)
{
    if(t6<1){
        motion3_pair[i]=rand;
        t6++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}
if(rand==7)
{
    if(t7<1){
        motion3_pair[i]=rand;
        t7++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
    return;

   }

}

if(rand==8)
{
    if(t8<1){
        motion3_pair[i]=rand;
        t8++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}

if(rand==9)
{
    if(t9<1){
        motion3_pair[i]=rand;
        t9++;
        return;
    }

    else 
   {
    
    generate_random_pair(i);
        return;

   }

}

}

}

