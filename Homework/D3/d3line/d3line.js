// when page loads
window.onload = function() {
 	visualizeData();
}

// a global variable that contains the JSON data
var data; 

// get the JSON data when the page loads
function visualizeData() {
	d3.json("d3line.json", function(error, json) {
		// if there is an error, send a message
		if (error) return console.warn(error);
		// store the data into the global variable
		data = json;

		// create container for the line chart
		d3.select("body").append("div").attr("class","chart")
									   .attr("width","1000px")
									   .attr("height","550px")
						 .append("svg")
						 			   .attr("width","1000px")
						 			   .attr("height","550px");

		// parser to Javascript dates
		var parseDate = d3.time.format("%Y/%m/%d").parse;

		console.log(data);

		var max = d3.max(d3.values(data)); 

		// set values for chart
		var vis = d3.select("svg"),
		    WIDTH = 1000,
		    HEIGHT = 500,
		    MARGINS = {
		        top: 20,
		        right: 20,
		        bottom: 20,
		        left: 50
		    },
		    // set range and domain for x axis
		    xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([0, 365]),
		    // set range and domain for y axis
		    yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([-1,31]),

		    // create axes
		    xAxis = d3.svg.axis()
			    .scale(xScale),
			  
			yAxis = d3.svg.axis()
			    .scale(yScale)
			    .orient("left");

		// add the x axis to the svg
		vis.append("svg:g")
		   .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
		   .attr("class", "x axis")
    	   .call(xAxis);

    	// add the y axis to the svg
    	vis.append("svg:g")
    	   .attr("transform", "translate(" + (MARGINS.left) + ",0)")
    	   .attr("class", "y axis")
    	   .call(yAxis);
    	
    	// create text for y axis
    	vis.append("text")
    	   .attr("class", "y text")
		   .attr("transform", "rotate(-90)")
		   .attr("y", 6)
		   .attr("dy", ".71em")
		   .style("text-anchor", "end")
		   .text("Max temperature");

		// create text for x axis
		vis.append("text")
    	   .attr("class", "x text")
    	   .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom + 25) + ")")
		   .attr("x", 1000)
		   .attr("dy", ".71em")
		   .style("text-anchor", "end")
		   .text("Days in 2014");
		    

    	// create the line
    	var lineGen = d3.svg.line()
		  .x(function(d, i) {
		    return xScale(i);
		  })
		  .y(function(d) {
		    return yScale(d.maxtemp/10);
		  });

		// add the line to the svg
		vis.append('svg:path')
		   .attr('d', lineGen(data))
		   .attr('stroke', 'red')
		   .attr('stroke-width', 1)
		   .attr('fill', 'none');

		/* 
		// for each element in the data
		data.forEach(function(d) {
			// change to javascript date
			d.date = parseDate(d.date);

			// format date to get: 01 Jan
			formatDate = d3.time.format("%d %b");
			d.date = formatDate(d.date);
		});
		*/

		/*
		Crosshair
		*/
	});
}