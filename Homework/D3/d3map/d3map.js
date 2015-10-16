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
		data: {},
	});

	// add countries to the data list
	map.options.data["NLD"] = { fillKey: "group13"}
	
	console.log(map.options.data);

	map.updateChoropleth({
	    USA: "groep1",
	    RUS: "#e0fefa",
	    AUS: "#e0fefa",
	    BRA: "#e0fefa",
	    CAN: "#e0fefa",
	    ZAF: "#e0fefa",
	    IND: "#e0fefa",
	  });

	for (key in map.options.data) {
		var data = {};
		data[key] = "green";
		map.updateChoropleth(data);
		
		/*
		map.updateChoropleth({
		    USA: "groep13",
		    RUS: "#e0fefa",
		    AUS: { fillKey: 'groep1' },
		    BRA: "#e0fefa",
		    CAN: "#e0fefa",
		    ZAF: "#e0fefa",
		    IND: "#e0fefa",
		  });
		*/
	}
}