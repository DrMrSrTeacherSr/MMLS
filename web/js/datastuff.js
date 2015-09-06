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
	var table = $('<table class="striped"></table>');
	if (array.length == 0) {
		table.append('<tr><td><emph class="grey-text">Empty Array</emph></td></tr>');
	} else {
		$.each(array, function() {
			table.append($('<tr></tr>').append(dataCellForValue(this)));
		});
	}
	return table;
}
// JSON Data - shown with one col for key, one for value for each row
function tableHeaderForJSON() {
	return $('<thead><tr><th data-field="key">Key</th><th data-field="value">Value</th></tr></thead>');
}
function tableBodyForJSON(jsonData) {
	var tbody = $('<tbody></tbody>')
	if (jsonData.length == 0) {
		tbody.append('<tr><td><emph class="grey-text">No Object Information</emph></tr></td>');
	} else {
		$.each(jsonData, function(key, value) {
			var row = $('<tr></tr>');
			row.append('<td class="key-data">'+key+'</td>');
			row.append(dataCellForValue(value));
			tbody.append(row);
		});
	}
	return tbody;
}
function completeTableForJSON(jsonData) {
	var header = tableHeaderForJSON();
	var body = tableBodyForJSON(jsonData);
	return $('<table class="striped"></table>').append(header).append(body);
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
	var cell = $('<td class="value-cell valign-wrapper"></td>');
	cell.data('value', value);
	if (value.constructor === Array) {
		cell.append('<div class="left valign"><p>Array ('+value.length+')</p></div>');
		if (value.length > 0) {
			var buttonArea = $('<div class="right valign"></div>');
			var tableButton = $('<a class="blue-grey waves-effect waves-light white-text btn-flat"></a>')
									.append('<i class="large material-icons">list</i>')
									.click(function(){ presentDataTable(cell.data('value')); });
			var graphButton = $('<a class="blue-grey waves-effect waves-light white-text btn-flat"></a>')
									.append('<i class="large material-icons">insert_chart</i>')
									.click(function(){ presentGraphOptions(cell.data('value')); });
			cell.append(buttonArea.append(tableButton).append(graphButton));
		}
	} else if (typeof value == 'object' && !(value instanceof String || value instanceof Number)) {

		var collapseWrapper = $('<ul class="collapsible" data-collapsible="accordion"></ul>');
		var collapse = $('<li></li>');
		collapse.append($('<div class="collapsible-header">Object</div>'));
		collapse.append($('<div class="collapsible-body"></div>').append(completeTableForJSON(value)));
		cell.append(collapseWrapper.append(collapse));
	} else {
		cell.html(value);
	}
	return cell;
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
	key7: [
		{'name': 'one', 'asdf': 1.0},
		{'name': 'two', ';ljk': 4.0},
		{'name': 'three', '1': 9.0},
		{'name': 'four', ';2': 16.0},
		{'name': 'five', ';3': 25},
		{'name': 'six', '1': 36.0},
		{'name': 'seven', ';2': 49.0},
		{'name': 'eight', ';3': 64.0}
	],
	key8: 'last data'
};
displayDataInDiv('#whereDataGoes', exampleData);
	