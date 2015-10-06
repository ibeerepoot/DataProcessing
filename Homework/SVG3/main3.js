/* use this to test out your function */
window.onload = function() {
 	parseData();
}

/* changeColor takes a path ID and a color (hex value)
   and changes that path's fill color */
function changeColor(id, color) {
    document.getElementById(id).style.fill=color;
}

function parseData() {
	// get the JSON data from the DOM
	var el = document.getElementById("dataset").innerHTML;
	// parse JSON to Javascript object
	var parsed = JSON.parse(el);

	// create array to find min and max values
	var popValues = [];

	// keep track of which countries in parsed are EU countries
	var euCountries = []

	// loop through all countries in the dataset
	for (key in parsed) {
		// get the country code
		var countryCode = parsed[key].code;
		// transform the code to lowercase
		var countryID = countryCode.toLowerCase();

		// if element with this id exists on page
		if (document.getElementById(countryID)) {
			popValues.push(parsed[key].value);
			euCountries.push(key);
		}
	}

	// calculate minimum and maximum values in data
	var minValue = Math.min.apply(null, popValues);
	var maxValue = Math.max.apply(null, popValues);
	var range = maxValue - minValue;

	// fill in the colour spectrum we will use
	var spectrum = ["#166a62", "#276f63", "#387464", "#497a64", "#5a7f65", "#6b8466", "#7d8a67", "#8e8f67", "#9f9468", "#b09969", "#c19e6a", "#d2a46a", "#e3a96b"];
	
	// calculate the amount that will be in one colour
	var numColours = spectrum.length;
	var valuePerColour = range / numColours;

	// loop through all EU countries
	for (country in euCountries) {
		// get the number of that country in parsed
		var elNum = euCountries[country];

		// figure out which colour it should have
		var val = parsed[elNum].value;

		// get the country code and transform it to lowercase
		var code = parsed[elNum].code.toLowerCase();

		// calculate in what colour step it belongs
		var remainder = (val-minValue) % valuePerColour;
		var step = (val-minValue-remainder)/valuePerColour;

		// colour for this step
		var hexa = spectrum[step];

		changeColor(code, hexa);
	}
}