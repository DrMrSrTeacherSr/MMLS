/*****************************************************************
* Table Generation
* I apologize for the shittiness, but random numbers take a
* lot of time if generated a lot, I figure this is a bit quicker
*****************************************************************/
var GLOBAL_ID_COUNTER = 0;
var GLOBAL_ID_ROOT = "Q3LKV93JDNQVIE-";
function pseudoUUID() {
	GLOBAL_ID_COUNTER += 1;
	return GLOBAL_ID_ROOT + GLOBAL_ID_COUNTER;
}


/*****************************************************************
* Table Generation
*****************************************************************/
// Array Objects - shown with one item per row
function tableForArray(array) {
	var html = '<table class="striped">';
	if (array.length == 0) {
		html += '<tr><td><emph class="grey-text">Empty Array</emph></td></tr>';
	} else {
		$.each(array, function() {
			html += '<tr>'+dataCellForValue(this)+'</tr>';
		});
	}
	html += '</table>';
	return html;
}
// JSON Data - shown with one col for key, one for value for each row
function tableHeaderForJSON() {
	return '<thead><tr><th data-field="key">Key</th><th data-field="value">Value</th></tr></thead>';
}
function tableBodyForJSON(jsonData) {
	var html = '<tbody>';
	if (jsonData.length == 0) {
		html += '<tr><td><emph class="grey-text">No Object Information</emph></tr></td>';
	} else {
		$.each(jsonData, function(key, value) {
			html += '<tr><td class="key-data">'+key+'</td>'+dataCellForValue(value)+'</tr>';
		});
	}
	html += '</tbody>';
	return html;
}
function completeTableForJSON(jsonData) {
	var html = '<table class="striped">';
	html += tableHeaderForJSON();
	html += tableBodyForJSON(jsonData);
	html += '</table>';
	return html;
}

/*****************************************************************
* Data Cell Generation
*
* Additional level of abstraction, allowing for specific creation
* of data cells for individual types. Most importantly, this
* allows neat creation of nested tables and arrays.
*
*****************************************************************/
function dataCellForValue(value) {
	html = '<td class="value-cell">';
	if (value.constructor === Array) {
		html += '<ul class="collapsible" data-collapsible="accordion"><li>';
		html += '<div class="collapsible-header array-cell-header">Array</div>';
		html += '<div class="collapsible-body array-cell-detail">';
		html += tableForArray(value);
		html += '<a class="blue-grey waves-effect waves-light white-text btn-flat" data-array="'+value+'" onclick="graphArrayData(this)">GRAPH</a>'
		html += '</div>';
		html += '</li></ul>';
	} else if (typeof value === 'object' && !(value instanceof String || value instanceof Number)) {
		html += '<ul class="collapsible" data-collapsible="accordion"><li>';
		html += '<div class="collapsible-header">Object</div>';
		html += '<div class="collapsible-body">'+completeTableForJSON(value)+'</div>';
		html += '</li></ul>';
	} else {
		html += value
	}
	html += '</td>';
	return html;
}


/*****************************************************************
* Examples
*****************************************************************/
function displayDataInDiv(dataDivSelector, jsonData) {
	$(dataDivSelector).append(completeTableForJSON(jsonData));
}
var exampleData = {
	key1: 0,
	key2: 4.02234,
	key3: 'Hello',
	key4: [],
	key5: [1.2, 3.4, 5.6],
	key6: "MOAR DATA",
	key7: { subkey: 'subkey 1 data', subkey2: 'subkey 2 data'},
	key8: 'last data'
};
displayDataInDiv('#whereDataGoes', exampleData);
	