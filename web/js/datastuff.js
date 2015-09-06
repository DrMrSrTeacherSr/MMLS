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
		cell.append('<div class="valign left"><p>Array ('+value.length+')</p><div>');
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
		var objectButton = $('<div class="pointer"></div>');
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
	$(dataDivSelector).html('');
	$(dataDivSelector).append(completeTableForJSON(jsonData));
}
var exampleData = {
	key1: {},
	key2: 4.02234,
	key3: 'Hello',
	key4: [],
	key5: [1.2, 3.4, 5.6],
	key6: "MOAR DATA",
	key7: [
		{'name':1.969996, 'data1':16.562913, 'data2':19.480364},
		{'name':7.472591, 'data1':10.841777, 'data2':6.546157},
		{'name':4.253489, 'data1':11.831421, 'data2':16.945962},
		{'name':1.434307, 'data1':38.536927, 'data2':1.773492},
		{'name':2.308044, 'data1':0.310628, 'data2':19.995986},
		{'name':5.259964, 'data1':7.822528, 'data2':18.860419},
		{'name':0.845122, 'data1':10.124342, 'data2':23.515818},
		{'name':2.912263, 'data1':24.382339, 'data2':17.635937},
		{'name':4.837530, 'data1':12.537201, 'data2':11.321074},
		{'name':2.891381, 'data1':4.449830, 'data2':24.109770},
		{'name':2.320603, 'data1':24.879898, 'data2':5.372329},
		{'name':5.939670, 'data1':10.841828, 'data2':14.300984},
		{'name':9.315631, 'data1':25.903154, 'data2':6.175185}
	],
	key8: {0.0: 'wert', 45 : '45'},
	key9: 'last data',
	megaData: [{"data5": 50.0, "data4": 5.0, "data6": 25.0, "data1": 1.0, "data3": 4.0, "data2": -4.0},
				{"data5": 49.10309413200602, "data4": 5.0, "data6": 25.122577273708604, "data1": 1.1391682256452098, "data3": 4.572910496297492, "data2": -2.554476773539541},
				{"data5": 46.38244597946999, "data4": 5.039029367600556, "data6": 25.276626979528157, "data1": 1.8512684595499602, "data3": 4.32741106873155, "data2": -0.19760056644700397},
				{"data5": 46.26202640441196, "data4": 5.39009098042039, "data6": 25.597496950333074, "data1": 2.029008876252808, "data3": 4.1516294382434795, "data2": 1.9122652451615},
				{"data5": 45.07825474792104, "data4": 5.519439122972471, "data6": 25.634138285154656, "data1": 2.770127957476825, "data3": 3.517851532656428, "data2": 2.5107575017814763},
				{"data5": 42.296134049947554, "data4": 5.519439122972471, "data6": 25.840529956435315, "data1": 3.529773305259675, "data3": 3.330516996040123, "data2": 3.0647155933394115},
				{"data5": 41.433718570576126, "data4": 6.433353760208055, "data6": 26.093223943521124, "data1": 4.284840929164982, "data3": 3.187117934591805, "data2": 4.343315968885645},
				{"data5": 44.98064345334713, "data4": 6.741577591229807, "data6": 26.295764115687188, "data1": 5.0776827415593075, "data3": 3.6558495763454375, "data2": 5.730821932906624},
				{"data5": 41.1250037072378, "data4": 7.181610575142864, "data6": 26.399923748718027, "data1": 5.5883412363767055, "data3": 4.402069961064736, "data2": 7.76947906725113},
				{"data5": 43.67245388870838, "data4": 7.181610575142864, "data6": 26.49567331520934, "data1": 6.275152432558233, "data3": 3.9067171560011444, "data2": 10.074700709879576},
				{"data5": 42.217795793765255, "data4": 7.833499980897719, "data6": 26.80540880630689, "data1": 6.548911705027772, "data3": 3.217602389159735, "data2": 10.348898979636093},
				{"data5": 45.84902279433201, "data4": 8.659943463907412, "data6": 27.262709907552924, "data1": 7.245232547324497, "data3": 3.6252966679065026, "data2": 11.527545325365196},
				{"data5": 45.85719051464805, "data4": 8.952382654411897, "data6": 27.663561526743983, "data1": 7.619398332631097, "data3": 2.7627953048761036, "data2": 13.501883968545627},
				{"data5": 45.004380067546286, "data4": 8.952382654411897, "data6": 27.693072194317104, "data1": 7.776339164319663, "data3": 2.0013716688092913, "data2": 13.002116083629152},
				{"data5": 44.087379077344636, "data4": 9.24282131154386, "data6": 27.830512198934603, "data1": 8.106513208661408, "data3": 1.6821348853492741, "data2": 14.629669696182873},
				{"data5": 41.59215479773533, "data4": 9.763718902020434, "data6": 28.237480468614116, "data1": 9.075257356374474, "data3": 1.9298299258585354, "data2": 14.839705085691179},
				{"data5": 44.159526713866335, "data4": 10.487732018871476, "data6": 28.29036112418889, "data1": 9.111938158249655, "data3": 2.8866312050826717, "data2": 16.344113331209694},
				{"data5": 41.203557287909504, "data4": 10.487732018871476, "data6": 28.325951631932856, "data1": 9.37535519617877, "data3": 2.549872876273516, "data2": 17.34283288256639},
				{"data5": 39.98295473140537, "data4": 10.514420940587211, "data6": 28.470141310975468, "data1": 9.843902825802276, "data3": 2.406901958554159, "data2": 19.003320874609475},
				{"data5": 36.02289190437297, "data4": 11.199345374341995, "data6": 28.96855699803331, "data1": 10.565993467874256, "data3": 2.572297498572068, "data2": 19.883458361362898}]
};

function showResponse(response) {
	displayDataInDiv('#whereDataGoes', response);

}
function newSQLQuery() {
	$('#modal-sql').openModal();

	$('#run_sql_query').click(function() {
		var val = $('#sql_query').val();
		if (val) {
			$.get('http://45.79.175.230:8080/api', {q: val}, function(data, status, jqXHR) {
				showResponse(data[0]);
				$('#modal-sql').closeModal();
			});
		} else {
			niceAlert('Please enter a query');
		}
	});
}

var urlData = get('data');
if (urlData) {
	var parsed = JSON.parse(response);
	showResponse(parsed);
} else {
	newSQLQuery();
}
	