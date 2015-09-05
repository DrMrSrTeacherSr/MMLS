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
	var metaType = typeof arrayToPlot[0];
	if (metaType == "string" || metaType == "number") {
		return [metaType];
	}
	var typeList = [];
	$.each(arrayToPlot[0], function(key, value) {
		typeList.push(fieldTypes([value]));
	});
	// Assume it's a JSON description of data
	return typeList;
}
function validGraphsForData(data) {
	console.log("Pre-cleanse: " + data);
	data = cleanTypes(data);
	console.log("after-cleanse: " + data);
	var types = fieldTypes(data);
	if (!types || types.length == 0) {
		console.error("Yo give me better data, that's not an array");
		return;
	}
	if (types.length == 1) {
		var typeList = [Graph.types.PIE, Graph.types.HIST];
		if (types[0] == "number") {
			typeList.push(Graph.types.NUM_LINE);
		}
		return typeList;
	} else if (types.length == 2) {
		return [Graph.types.PIE, Graph.types.LINE, Graph.types.BAR];
	} else {
		alert("Yeah we haven't gotten there yet");
		return [];
	}
}
function presentGraphOptions(data) {
	$('#modal-chooser-options').html('');
	console.log(validGraphsForData(data));
	$.each(validGraphsForData(data), function() {
		var buttonHTML = '<div><button class="light-blue darken-2 waves-effect waves-light white-text btn-flat"'
		buttonHTML += ' onclick="presentGraphType(\''+this+'\',['+data+'])">';
		buttonHTML += this;
		buttonHTML += '</button></div>'
		$('#modal-chooser-options').append(buttonHTML);
	});
	$('#modal-chooser').openModal();
}
function presentGraphType(type, data) {
	alert("Success! " + type);
}


/*****************************************************************
* Graphics
*****************************************************************/
function BarDataMax(a, b) {
	if(a.data < b.data) {
		return b.data;
	}
	return a.data;
}
function BarDataArrMax(arr) {
	return d3.max(arr.map(function(bd){return bd.data}));
}

/* Chart sizer encapsulates size and scaling of a chart into 1 */
function CreateChartSizer(data,width, k_label, k_data) {
	return {
		data: data,
		width: width,
		get label_width()   { return this.width * k_label},
		get data_padding()  { return this.width * k_data },
		get max_bar_width() { return this.width - this.label_width - this.data_padding},
		get scale() { return d3.scale.linear().domain([0, BarDataArrMax(this.data)]).range([0, this.max_bar_width]) }
	}
}


function popUpGraph(data) {
	$('#modal-graph').openModal();
	var data_width = d3.select('#modal-graph-data').style('width').match(/\d+/)[0];
	var data_sizer = CreateChartSizer(data, data_width, .25, .10);

	var bar_containers = d3.select('#modal-graph-data')
							.selectAll('div')
							.data(data)
							.enter().append('div')
							.classed('bar_container', true);
	// Add labels, then bars, then data
	bar_containers.append('div')
	    .classed('bar_label', true)
	    .style('width', data_sizer.label_width)
	    .style('height', '100%')
	    .text(function(d) {return d.name;});
	bar_containers.append('div')
	    .classed('bar', true)
	    .style('width',( function(d) { return data_sizer.scale(d.data) + 'px'; }))
	    .style('height', '100%');
	bar_containers.append('div')
	 	.classed('bar_data', true)
	 	.style('width', function(d) { return (data_sizer.width - data_sizer.scale(d.data) - data_sizer.label_width + data_sizer.data_padding) + 'px'})
	 	.style('height', '100%')
	    .text(function(d) { return d.data; });
}


function graphArrayData(triggerElement) {
	var elementData = $(triggerElement).data();
	if (elementData && elementData['array']) {
		var dataAsArray = elementData['array'].split(',');
		presentGraphOptions(dataAsArray);
	} else {
		console.log('No data found to graph for ' + triggerElement);
	}
}

