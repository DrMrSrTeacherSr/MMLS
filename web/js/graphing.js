/* Chart + Graph Information
*
* Note: All arrays are assumed to be of homogenous type when graphed
*
* Model
* BarData
* 	- label : name of specific data
* 	- data  : numeric value
* ChartSizer
* 	- data  : BarData array representing chart
* 	- height: height of whole chart
* 	- width : width of whole chart
* 	- label_width  : width of label area, left of bars
* 	- data_padding : minimum extra space to right of bar (for data label)
* 	- max_bar_width: length of longest bar, leaving space for label on left, data label on the right
* 	- scale : function to scale data to bar_width
*/

/*****************************************************************
* Graph Type Utility
*****************************************************************/
var Graph = {
	types: {
		BAR: "Bar Graph",
		NUM_LINE: "Line Plot",
		LINE: "Line Graph",
		SCAT: "Scatter Plot",
		HIST: "Histogram",
		PIE: "Pie Chart"
	}
}
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
function dimension(array) {
	if (!array || array.constructor != Array) {
		return 0;
	}
	return 1 + dimension(array[0]);
}
function numFields(arrayToPlot) {
	/* This is called on an array of objects to plot. The objects
	can be:
		- primitives: the number of fields is 1
		- objects: the number of fields is the number of keys in the object
		- unknown (empty array): 0
	*/
	if (arrayToPlot.length == 0) {
		return 0;
	}
	if (typeof arrayToPlot[0] == String || typeof arrayToPlot[0] == Number) {
		return 1;
	}
	// Assume it's a JSON description of data
	return arrayToPlot[0].keys().length;
}
function cleanTypes(arrayOrPrim) {
	if (arrayOrPrim.constructor == Array) {
		var cleanedArray = [];
		$.each(arrayOrPrim, function() {
			var cleaned = cleanTypes(this);
			cleanedArray.push(cleaned);
		});
		return cleanedArray;
	}
	if (arrayOrPrim instanceof String && isNumeric(arrayOrPrim)) {
		return Number(arrayOrPrim);
	}
	return arrayOrPrim;
}
function fieldTypes(arrayToPlot) {
	if (arrayToPlot.length == 0) {
		return null;
	}
	if (typeof arrayToPlot[0] == 'string' || arrayToPlot[0] instanceof String) {
		return ["string"];
	}
	if (typeof arrayToPlot[0] == 'number' || arrayToPlot[0] instanceof Number) {
		return ["number"];
	}
	var typeList = [];
	$.each(arrayToPlot[0], function(key, value) {
		typeList.push(fieldTypes([value]));
	});
	// Assume it's a JSON description of data
	return typeList;
}
function validGraphsForData(data) {
	var types = fieldTypes(data);
	if (!types || types.length == 0) {
		niceAlert("Cannot graph nothing :/");
		return;
	}
	if (types.length == 1) {
		var typeList = [Graph.types.PIE, Graph.types.HIST];
		if (types[0] == "number") {
			typeList.push(Graph.types.NUM_LINE, Graph.types.LINE);
		}
		return typeList;
	}
	return [Graph.types.LINE, Graph.types.BAR];
}
function presentGraphOptions(data) {
	$('#modal-chooser-options').html('');

	// Plot fields are numeric data
	// Hist fields are things we can count
	// 		automatically, or using another source row
	var plot_fields = [];
	var hist_fields = [];
	data = cleanTypes(data);
	var types = fieldTypes(data);

	if (!types || types.length == 0) {
		niceAlert("Cannot graph nothing :/");
		return;
	}

	if (types.length == 1) {
		hist_fields = types;
		if (types[0] == "number") {
			plot_fields.push(Graph.types.NUM_LINE);
		}
	} else {
		// More than one type
		// hist_fields = 
	}


	$.each(validGraphsForData(data), function() {
		var graphType = this;
		$('#modal-chooser-options').append(
			$('<button></button>').addClass('light-blue darken-2 waves-effect waves-light white-text btn-flat')
						.html(this)
						.click(function() {
							presentGraphType(graphType, data);
						})
		);
	});
	$('#modal-chooser').openModal();
}
function presentGraphType(type, data) {
		$('#modal-chooser').closeModal();
	if (type == Graph.types.NUM_LINE) {
		popUpNumberLine(data);
	} else if (type == Graph.types.LINE) {
		popUpLineGraph(data);
	}else {
		alert("Sorry, that graph type is coming soon :)");
	}
}
function presentDataTable(data) {
	$('#modal-table-data').html(tableForArray(data));
	$('#modal-table').openModal();
}


/*****************************************************************
* Graphics
*****************************************************************/
// function BarDataMax(a, b) {
// 	if(a.data < b.data) {
// 		return b.data;
// 	}
// 	return a.data;
// }
// function BarDataArrMax(arr) {
// 	return d3.max(arr.map(function(bd){return bd.data}));
// }

// /* Chart sizer encapsulates size and scaling of a chart into 1 */
// function CreateChartSizer(data, width, k_label, k_data) {
// 	return {
// 		data: data,
// 		width: width,
// 		get label_width()   { return this.width * k_label},
// 		get data_padding()  { return this.width * k_data },
// 		get max_bar_width() { return this.width - this.label_width - this.data_padding},
// 		get scale() { return d3.scale.linear().domain([0, BarDataArrMax(this.data)]).range([0, this.max_bar_width]) }
// 	}
// }



function popUpGraph(data) {
	$('#modal-graph').openModal();
	var data_width = d3.select('#modal-graph-data').style('width').match(/\d+/)[0];
	var data_sizer = CreateChartSizer(data, data_width, .25, .10);

	// var bar_containers = d3.select('#modal-graph-data')
	// 						.selectAll('div')
	// 						.data(data)
	// 						.enter().append('div')
	// 						.classed('bar_container', true);
	// // Add labels, then bars, then data
	// bar_containers.append('div')
	//     .classed('bar_label', true)
	//     .style('width', data_sizer.label_width)
	//     .style('height', '100%')
	//     .text(function(d) {return d.name;});
	// bar_containers.append('div')
	//     .classed('bar', true)
	//     .style('width',( function(d) { return data_sizer.scale(d.data) + 'px'; }))
	//     .style('height', '100%');
	// bar_containers.append('div')
	//  	.classed('bar_data', true)
	//  	.style('width', function(d) { return (data_sizer.width - data_sizer.scale(d.data) - data_sizer.label_width + data_sizer.data_padding) + 'px'})
	//  	.style('height', '100%')
	//     .text(function(d) { return d.data; });
}

function CreateGraphicalData(data, maxWidth) {
	return {
		data: data,
		width: maxWidth,
		get max_value() { return d3.max(data) },
		get min_value() { return d3.min(data) },
		get range() { return this.max_value - this.min_value },
		get scale() {
			var offset = d3.max([this.range * 0.1, 1]);
			var min = this.min_value - offset;
			var max = this.max_value + offset;
			var other = this.width;
			var scaleTest = d3.scale.linear()
						.domain([this.min_value - offset, this.max_value + offset])
						.range([0, this.width]); 
			var test1 = scaleTest(this.min_value);
			var test2 = scaleTest(this.max_value);
			var test3 = scaleTest(3.0);
			return scaleTest;
		}
	}
}

function popUpNumberLine(data) {
	$('#modal-graph-data').html('');
	$('#modal-graph').openModal();
	$('#modal-graph-data').append('<div class="center-align"><h3>Number Line</h3></div>')
						  .append('<div id="modal-graph-data-number-line"></div>');

	var width = $('#modal-graph').width() * 0.8;
	var height = $('#modal-graph').height() * .5;
	var svgContainer = d3.select('#modal-graph-data-number-line').append('svg')
									.attr('width', width)
                                    .attr('height', height);
	var GraphInfo = CreateGraphicalData(data, width);
    var xAxis = d3.svg.axis()
					.scale(GraphInfo.scale)
					.ticks(5)
					.orient('bottom');
	svgContainer.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height/2.0 + ")")
    .call(xAxis)

    var g = svgContainer.append("svg:g"); 
	g.selectAll("scatter-dots")
	  .data(data)
	  .enter().append("svg:circle")
	      .attr("cy", function (d) { return 0;} )
	      .attr("cx", function (d) { return GraphInfo.scale(d); } )
	      .attr("transform", "translate(0," + height/2.0 + ")")
	      .attr("r", 5);

}

function popUpLineGraph(data) {
	var margin = {top: 20, right: 30, bottom: 30, left: 30};
	$('#modal-graph-data').html('');
	$('#modal-graph').openModal();
	$('#modal-graph-data').append('<div class="center-align"><h3>Line Graph</h3></div>')
						  .append('<div id="modal-graph-data-line-graph"></div>');

	var width = $('#modal-graph').width() * 0.8;
	var height = $('#modal-graph').height() * .5;
	var svgContainer = d3.select('#modal-graph-data-line-graph').append('svg')
									.attr('width', width + margin.left + margin.right)
                                    .attr('height', height + margin.top + margin.bottom)
                                .append("g")
							    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var primaryKey = "data1";
	var secondaryKeys = ["data2", "data3", "data4", "data5", "data6"];

	var x = d3.scale.linear()
	    .range([0, width]);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var lines = {};
	var secondaryMax = 0;
	var secondaryMin = 0;
	$.each(secondaryKeys, function() {
		var thisKey = this;
		var line = d3.svg.line()
		    .x(function(d) { 
		    	console.log("Iterating over x: " + d[primaryKey] + x(d[primaryKey]));
		    	return x(d[primaryKey]); 
		    })
		    .y(function(d) { 
		    	console.log("Iterating over y: " + d[thisKey] + x(d[thisKey]));
		    	return y(d[thisKey]); 
		    });
		lines[thisKey] = line;
		secondaryMin = d3.min([secondaryMin, d3.min(data, function(d) { return d[thisKey]; })]);
		secondaryMax = d3.max([secondaryMax, d3.max(data, function(d) { return d[thisKey]; })]);
	});
	x.domain(d3.extent(data, function(d) { return d[primaryKey]; }));
	y.domain([secondaryMin, secondaryMax]);

	svgContainer.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis);

	svgContainer.append("g")
	  .attr("class", "y axis")
	  .call(yAxis)
	.append("text")
	  .attr("transform", "rotate(-90)")
	  .attr("y", 6)
	  .attr("dy", ".71em")
	  .style("text-anchor", "end")
	  .text("Dependent");

	$.each(lines, function() {
		svgContainer.append('svg:path')
		  .attr('d', this(data))
		  .attr('class', nextGraphColor())
		  .attr('fill', 'none');

	});
}

