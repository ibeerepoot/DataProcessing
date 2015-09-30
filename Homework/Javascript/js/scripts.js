// Select textarea, split it at every newline
var lines = document.getElementById("rawdata").innerHTML.split('\n');

// create variable to store array in
var data = [];

var temperatures = [];

// each lines[i] is a new line
for(var i = 0; i < lines.length; i++){
    // chunks returns a list with chunks[0]=date & chunks[1]=temperature
    var chunks = lines[i].split(', ');

    // make the temp into an integer, and divide by ten to get whole degrees Celsius
    chunks[1] = parseInt(chunks[1])/10;

    // append date and temp to the data array
    data.push(chunks);

    // fill temperatures array to be able to find the max and min values
    // if value is nan, don't add
    if (chunks[1]) {
    	// append just the temperature to the temperatures list
    	temperatures.push(chunks[1]);
    }
}

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

// define the canvas
var c = document.getElementById("graph");

// ctx is the pencil with which we draw
var ctx = c.getContext("2d");

/*
figure out where the ticks should be
*/
// create array for number of days in months
var num_days = [31,29,31,30,31,30,31,31,30,31,30,31];
// create variable to keep track of where the tick should be on x-axis
var tickx = 150;
// move the pencil to the x/y intersection
ctx.moveTo(tickx,425);
// loop through all months
for (var k = 0; k < 12; k++){
	// update the x value
	tickx += num_days[k]*2;

	// draw tick
	ctx.moveTo(tickx,430);
	ctx.lineTo(tickx,420);
	ctx.stroke();
}

// draw lighter horizontal lines for every 5 degrees
var line_y_position = 475;
ctx.beginPath();
// move to x=0 and y=-5
ctx.moveTo(150,line_y_position);
// change colour of lines to grey
ctx.strokeStyle = "#d3d3d3";
// loop through every 5 degrees Celsius from -5 to 35
for (var m = -5; m < 36; m += 5) {
	// draw light line to the right
	ctx.lineTo(880,line_y_position);
	ctx.stroke();
	// update y position for next line
	line_y_position -= 50;
	// move to the new y position
	ctx.moveTo(150,line_y_position);
}
ctx.closePath();

// draw x-axis
ctx.beginPath();
ctx.strokeStyle = "#000";
ctx.moveTo(150,425);
ctx.lineTo(880,425);
ctx.closePath();
ctx.stroke();

// draw y-axis
ctx.beginPath();
ctx.strokeStyle = "#000";
ctx.moveTo(150,475);
ctx.lineTo(150,75);
ctx.closePath();
ctx.stroke();

// draw graph
for (var i = 0; i < 366; i++){
	var current_temperature = transform(myarray[i].temperature);
	var current_day = 150 + i*2;
	ctx.lineTo(current_day,current_temperature);
	ctx.stroke();
	ctx.moveTo(current_day,current_temperature);
}

// write text
ctx.font = "20px Arial";
ctx.fillText("Max temp in Celsius",30,50);
ctx.fillText("Months in 2014",850,500);

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
	ctx.fillText(months[h],x_position,455);
	x_position += 61;
}