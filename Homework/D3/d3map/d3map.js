/* use this to test out your function */
window.onload = function() {
 	mapData();
}

function mapData() {
	// get the JSON data from the DOM
	var el = document.getElementById("dataset").innerHTML;
	// parse JSON to Javascript object
	var parsed = JSON.parse(el);

	// loop through all countries in the dataset
	for (key in parsed) {
		// get the country code
		var countryCode = parsed[key].code;
		// transform the code to lowercase
		var countryID = countryCode.toLowerCase();
		parsed[key].code = countryID;

		// loop through all elements in country_codes
		for (var code in country_codes) {
			if (country_codes[code][0] === parsed[key].code) {
				// change two-letter country code to three-letter country code
				parsed[key].code = country_codes[code][1];
			}
		}
	}

	// create a new datamap
	var map = new Datamap({
		element: document.getElementById('container'),

		// add the classes for the different groups
		fills: {
		    defaultFill: "#ABDDA4",
		    group1: "#092b27", 
		    group2: "#183934", 
		    group3: "#32524d", 
		    group4: "#4f6e6a", 
		    group5: "#65847f", 
		    group6: "#71908b", 
		    group7: "#7d9c97", 
		    group8: "#8baaa6", 
		    group9: "#9ab9b4", 
		    group10: "#a9c7c3", 
		    group11: "#bad8d4", 
		    group12: "#cceae6", 
		    group13: "#e0fefa"
		},
		data: {
			"USA": { fillKey: "red", population: "50" },
		},
		// edit popup
		geographyConfig: {
            popupTemplate: function(geo, data) {
                return ['<div class="hoverinfo"><strong>',
                        'Population density in '+ geo.properties.name,
                        ': ' + data.population,
                        '</strong></div>'].join('');
            }
        },
	});

	// add country to the data property in the datamap object
	for (var country in parsed) {
		var codeOfCountry = parsed[key].code;
		map.options.data[codeOfCountry] = { fillKey: "", population: ""};
	}

	console.log(map.options.data);
	
	var fillKey_value = "groep1";
	var population_value = "100";

	// create array with all density values
	var density_values = [];
	for (var values in parsed) {
		console.log(parsed[values].value); 
		density_values.push(parsed[values].value);
	}
	console.log(density_values);

	/*
	min = 0.02, max = 19416
	meeste onder de 100, dan nog een paar tot 500
	weinig boven de 500

	1. 5 0-5
	2. 10 5-15
	3. 20 15-35
	4. 40 35-75
	5. 80 75-155
	6. 160 155-315
	7. 320 315-635
	8. 640 635-1275
	9. 1280 1275-2555
	10. 2560 2555 - 5115
	11. 5120 5115 - 10235
	12. 10240 10235 - 20475
	13.

	1. 1 > 0-1
	2. 2 > 1-3
	3. 4 > 3-7
	4. 8 > 7-15
	5. 16 > 15-31
	6. 32 > 31-63
	7. 64 > 63-127
	8. 128 > 127-255
	9. 256 > 255-511
	10. 512 > 511-1023
	11. 1024 > 1023-2047
	12. 2048 > 2047-4095
	13. 4096 > 4095-max
	*/

	// loop through all country keys in map.data
	for (key in map.options.data) {
		console.log(key);
		var data = {};
		// figure out the right population value
		for (countries in parsed) {
			if (parsed[countries].code == key);
			population_value = parsed[countries].value;
		}
		// change the fillkey and population properties to the right value
		data[key] = { fillKey: fillKey_value, population: population_value};
		
	}
	map.updateChoropleth(data);
}