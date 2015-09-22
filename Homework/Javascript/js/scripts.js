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

// find the alpha and beta data points
function createTransform(domain, range){
	// domain is a two-element array of the domain's bounds
	// range is a two-element array of the range's bounds
	// implement the actual calculation here

	// Cmax = range[1]
	// Cmin = range[0]
	// Dmax = domain[1]
	// Dmin = domain[0]

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

/*
// to use this for instance:
var transform = createTransform([10, 20], [10, 20]);
console.log(transform(15));  // should log 15
*/

// calculate domain
var Dmin = Math.min.apply(null, temperatures);
var Dmax = Math.max.apply(null, temperatures);

/* 
set values for range
don't start at 0,0 of the canvas, but leave some space at the top, so 75
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

// create array for number of days in months
var num_days = [31,29,31,30,31,30,31,31,30,31,30,31];

var rectx = 150;

// loop through all months
for (var k = 0; k < 12; k++){
	// figure out which colour the background should be
	if (k == 0 || k == 4 || k == 8){
		ctx.fillStyle = "#4bdabc";
	}
	else if (k == 1 || k == 5 || k == 9){
		ctx.fillStyle = "#8ef3e1";
	}
	else if (k == 2 || k == 6 || k == 10){
		ctx.fillStyle = "#8de1d2";
	}
	else {
		ctx.fillStyle = "#cbf6ed";
	}
	var rectwidth = num_days[k]*2;
	// x,y,width,height
	ctx.fillRect(rectx,75,rectwidth,350);

	rectx += num_days[k]*2;
}

/*
ctx.fillStyle = "#4bdabc";
ctx.fillRect(150,75,62,350);
*/

// change colour to black
ctx.fillStyle = "#000";

// draw x-axis
ctx.moveTo(150,425);
ctx.lineTo(880,425);
ctx.stroke();

// draw y-axis
ctx.moveTo(150,425);
ctx.lineTo(150,75);
ctx.stroke();

// draw graph
for (var i = 0; i < 366; i++){
	var current_temperature = transform(temperatures[i]);
	var current_day = 150 + i*2;
	ctx.lineTo(current_day,current_temperature);
	ctx.stroke();
	ctx.moveTo(current_day,current_temperature);
}

// write text
ctx.font = "20px Arial";
ctx.fillText("Degrees Celsius",30,50);
ctx.fillText("Months in 2014",850,500);

// write degrees Celsius
ctx.font = "12px Arial";
var y_position = 430;
for (var j = 0; j < 36; j += 5) {
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