// Select textarea, split it at every newline
var lines = document.getElementById("rawdata").innerHTML.split('\n');

// create variable to store array in
var data = [];

// each lines[i] is a new line
for(var i = 0; i < lines.length; i++){
    // chunks returns a list with chunks[0]=date & chunks[1]=temperature
    var chunks = lines[i].split(', ');

    // make the temp into an integer, and divide by ten to get whole degrees Celsius
    chunks[1] = parseInt(chunks[1])/10;

    // append date and temp to the data array
    data.push(chunks);
}
// from now on, don't use the csv data, but start using JSON

/* 
convert csv array to JSON
*/
var myarray = [];
var myJSON = "";

// length of array is 368 (367), but the first (0) and last (367) don't contain values
for (var i = 1; i < (data.length - 1); i++) {
    var item = {
        "date": data[i][0],
        "temperature": data[i][1]
    };
    myarray.push(item);
}
myJSON = JSON.stringify({myarray: myarray});

// keep track of just the temperatures, so you can easily find the min and max
var temperatures = [];
for (var j = 0; j < myarray.length; j++) {
	temperatures.push(myarray[j].temperature);
}

// find the alpha and beta data points
function createTransform(domain, range){
	// domain is a two-element array of the domain's bounds
	// range is a two-element array of the range's bounds
	// implement the actual calculation here
	var Cmax_minus_Cmin = range[1] - range[0];
	var Dmax_minus_Dmin = domain[1] - domain[0];

	// a = (Cmax - Cmin)/(Dmax - Dmin)
	var alpha = Cmax_minus_Cmin / Dmax_minus_Dmin;

	// b = Cmin - a*Dmin
	var alpha_times_Dmin = alpha * domain[0];
	var beta = range[0] - alpha_times_Dmin;

	return function(x){
		return alpha * x + beta;
	};
}

// calculate domain
var Dmin = Math.min.apply(null, temperatures);
var Dmax = Math.max.apply(null, temperatures);

/* 
set values for range
don't start at 0,0 of the canvas, but leave some space at the top, so 100
also leave some space at the bottom, so don't go to 550, but to 434
*/
var Cmin = 434;
var Cmax = 100;

var transform = createTransform([Dmin, Dmax], [Cmin, Cmax]);

/* 
Draw graph on canvas
*/
// set values for axes
var Xmin = 150;
var Xmax = 882;
var Ymin = 75;
var Ymax = 475;
var x_axis = 425;

// define the canvas
var c = document.getElementById("graph");
var c2 = document.getElementById("overlay");

// ctx is the pencil with which we draw
var ctx = c.getContext("2d");
var ctx2 = c2.getContext("2d");

/*
figure out where the ticks should be
*/
// create array for number of days in months
var num_days = [31,29,31,30,31,30,31,31,30,31,30,31];
// create variable to keep track of where the tick should be on x-axis
var tickx = Xmin;
// move the pencil to the x/y intersection
ctx.moveTo(tickx,x_axis);
// loop through all months
for (var k = 0; k < 12; k++){
	// update the x value
	tickx += num_days[k]*2;

	// draw tick
	ctx.moveTo(tickx,(x_axis+5));
	ctx.lineTo(tickx,(x_axis-5));
	ctx.stroke();
}

// draw lighter horizontal lines for every 5 degrees
var line_y_position = Ymax;
ctx.beginPath();
// move to x=0 and y=-5
ctx.moveTo(Xmin,line_y_position);
// change colour of lines to grey
ctx.strokeStyle = "#d3d3d3";
// loop through every 5 degrees Celsius from -5 to 35
for (var m = -5; m < 36; m += 5) {
	// draw light line to the right
	ctx.lineTo(Xmax,line_y_position);
	ctx.stroke();
	// update y position for next line
	line_y_position -= 50;
	// move to the new y position
	ctx.moveTo(Xmin,line_y_position);
}
ctx.closePath();

// draw x-axis
ctx.beginPath();
ctx.strokeStyle = "#000";
ctx.moveTo(Xmin,x_axis);
ctx.lineTo(Xmax,x_axis);
ctx.closePath();
ctx.stroke();

// draw y-axis
ctx.beginPath();
ctx.strokeStyle = "#000";
ctx.moveTo(Xmin,Ymax);
ctx.lineTo(Xmin,Ymin);
ctx.closePath();
ctx.stroke();

// draw graph
for (var i = 0; i < 366; i++){
	var current_temperature = transform(myarray[i].temperature);
	var current_day = Xmin + i*2;
	ctx.lineTo(current_day,current_temperature);
	ctx.stroke();
	ctx.moveTo(current_day,current_temperature);
}

// write text
ctx.font = "20px Arial";
ctx.fillText("Max temp in Celsius",30,50);
ctx.fillText("Months in 2014",850,530);

ctx.beginPath();
ctx.font = "30px Arial";
ctx.fillText("Maximum temperatures during 2014",50,600);
ctx.closePath();

ctx.beginPath();
ctx.font = "15px Arial";
ctx.fillText("Maximum temperatures over all 12 months of 2014. Source: KNMI de Bilt. Hover over the graph to see the date and max temperature.",50,650);
ctx.closePath();

// write degrees Celsius
ctx.font = "12px Arial";
var y_position = 479;
for (var j = -5; j < 36; j += 5) {
	ctx.fillText(j,120,y_position);
	y_position -= 50;
}

// write months of the year
var months = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"];
var x_position = 170;
for (var h = 0; h < 12; h++) {
	ctx.fillText(months[h],x_position,495);
	x_position += 61;
}

/*
Listen to the mouse with addEventListener when it hovers over the overlay canvas
*/
var el = document.getElementById('overlay');

/*
Calculate position of canvas on page

mouseposition is an object with 6 properties: 
bottom, height, left, right, top and width
*/
var mouseposition = el.getBoundingClientRect();

// function that should be called when mouse is moved over canvas
function crosshair(event) {
	// get the html element tooltip, make sure it doesn't show
	var tooltip_element = document.getElementById('tooltip');
	tooltip_element.style.display="none";

	// get values from the event that's done on overlay canvas
	var pagex = event.pageX;
	var pagey = event.pageY;
	// subtract mouseposition.left from pagex to get canvasx
	var canvasx = pagex - mouseposition.left;
	// subtract mouseposition.top from pagey to get canvasy
	var canvasy = pagey - mouseposition.top;

	// get the current day the mouse is on
	var crosshairx = canvasx / 2;
	// round to nearest integer
	var mouse_on_day = Math.round(crosshairx);
	// get the temperature for that day
	var degrees_on_day = myarray[mouse_on_day].temperature;
	// transform the temperature to its y-value on the canvas
	// since the createTransform was for the base canvas, substract 75 because the overlay canvas starts lower
	var crosshairy = transform(degrees_on_day)-75;

	// calculate y-position of x axis of overlay canvas
	var x_axis_overlay = 375 + mouseposition.top;

	var radius_of_outer_circle = 10;

	ctx2.clearRect(0,0,732,400);

	// draw vertical hair, lower part
	ctx2.beginPath();
	ctx2.strokeStyle = "#000";
	ctx2.moveTo((mouse_on_day*2),(crosshairy+radius_of_outer_circle));
	ctx2.lineTo((mouse_on_day*2),400);
	ctx2.closePath();
	ctx2.stroke();

	// draw vertical hair, higher part
	ctx2.beginPath();
	ctx2.strokeStyle = "#000";
	ctx2.moveTo((mouse_on_day*2),0);
	ctx2.lineTo((mouse_on_day*2),(crosshairy-radius_of_outer_circle));
	ctx2.closePath();
	ctx2.stroke();

	// draw horizontal hair, left part
	ctx2.beginPath();
	ctx2.strokeStyle = "#000";
	ctx2.moveTo((mouse_on_day*2-radius_of_outer_circle),crosshairy);
	ctx2.lineTo(0,crosshairy);
	ctx2.closePath();
	ctx2.stroke();

	// draw horizontal hair, right part
	ctx2.beginPath();
	ctx2.strokeStyle = "#000";
	ctx2.moveTo((mouse_on_day*2+radius_of_outer_circle),crosshairy);
	ctx2.lineTo(731,crosshairy);
	ctx2.closePath();
	ctx2.stroke();

	// draw outer circle
	ctx2.beginPath();
	ctx2.arc((mouse_on_day*2),crosshairy,radius_of_outer_circle,0,2*Math.PI);
	ctx2.stroke();

	// draw inner circle
	ctx2.beginPath();
	ctx2.arc((mouse_on_day*2),crosshairy,3,0,2*Math.PI);
	ctx2.stroke();

	/*
	Tooltip
	*/
	function tooltip() {
		// display the element
		tooltip_element.style.display="inline";
		// calculate what value the left-margin of the tooltip should be
		var lmargin = mouse_on_day*2+250-200 + 'px';
		// change the left margin to let the tooltip move with the mouse
		tooltip_element.style.marginLeft=lmargin;
		// get the full date string from the array that belongs to the current date
		var full_date = myarray[mouse_on_day].date;
		// change the text in the div
		tooltip_element.textContent = 'On ' + full_date + ' it was ' + degrees_on_day + '℃';
	}
	// only call the tooltip when some time has passed
	setTimeout(tooltip, 1000);
}

// listen to the position of the mouse when it movees over the overlay canvas
el.addEventListener('mousemove', crosshair, false);