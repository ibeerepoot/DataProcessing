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
                        geo.properties.name + '<br>',
                        'Population: ' + data.population,
                        '</strong></div>'].join('');
            }
        },
	});

	// add country to the data property in the datamap object
	for (var country in parsed) {
		var codeOfCountry = parsed[key].code;
		map.options.data[codeOfCountry] = { fillKey: "", population: "100"};
	}

	console.log(map.options.data);
	
	var group = "groep1";
	
	// loop through all country keys in map.data
	for (key in map.options.data) {
		var data = {};
		data[key] = { fillKey: group};
		map.updateChoropleth(data);
	}
}