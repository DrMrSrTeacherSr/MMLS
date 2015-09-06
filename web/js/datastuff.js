/*****************************************************************
* Table Generation
* I apologize for the shittiness, but random numbers take a
* lot of time if generated a lot, I figure this is a bit quicker
*****************************************************************/
var GLOBAL_ID_COUNTER = 0;
var GLOBAL_ID_ROOT = "Q3LKV93JDNQVIE-";
function pseudoUUID() {
	GLOBAL_COLOR_COUNTER = (GLOBAL_COLOR_COUNTER + 1) % 5;
	return GLOBAL_COLOR_ROOT + GLOBAL_ID_COUNTER;
}
var GLOBAL_COLOR_COUNTER = -1;
var GLOBAL_COLOR_ROOT = "graph-color-";
function nextGraphColor() {
	GLOBAL_COLOR_COUNTER++;
	return GLOBAL_COLOR_ROOT + GLOBAL_COLOR_COUNTER;
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
	megaData: [{'data5': 50.0, 'data4': 5.0, 'data6': 25.0, 'data1': 1.0, 'data3': 4.0, 'data2': -4.0},
				{'data5': 46.40570033576991, 'data4': 5.0, 'data6': 25.471076468764004, 'data1': 1.1211860934431184, 'data3': 4.406751097877374, 'data2': -6.425438400810466},
				{'data5': 45.46972429207182, 'data4': 5.3570047625951105, 'data6': 25.937787088783466, 'data1': 2.0984668452043422, 'data3': 3.8788113779395905, 'data2': -4.568784297449284},
				{'data5': 48.66070844894221, 'data4': 5.668543956593979, 'data6': 26.05368862749669, 'data1': 2.1556107690264357, 'data3': 2.971221757296708, 'data2': -5.98071909818404},
				{'data5': 47.867984458210785, 'data4': 6.13456690095663, 'data6': 26.13719758012159, 'data1': 2.6281868071650507, 'data3': 2.453279115454247, 'data2': -6.989424591356755},
				{'data5': 48.091870160836756, 'data4': 6.13456690095663, 'data6': 26.4868480652424, 'data1': 3.0870526741521815, 'data3': 3.3694424337886093, 'data2': -4.887049313814386},
				{'data5': 47.68872404893702, 'data4': 7.100572874625017, 'data6': 26.734258696196076, 'data1': 3.8712933973323502, 'data3': 2.9596309721693803, 'data2': -4.202954457701843},
				{'data5': 47.28120154952777, 'data4': 7.58753350951951, 'data6': 26.83445726597616, 'data1': 3.9445941621646514, 'data3': 2.2031190071884716, 'data2': -4.153118116255566},
				{'data5': 43.5680794586637, 'data4': 8.448292285342236, 'data6': 27.314308395752747, 'data1': 4.288183545105781, 'data3': 2.3428504807862103, 'data2': -2.8894756427697077},
				{'data5': 39.78430424081091, 'data4': 8.448292285342236, 'data6': 27.685802450301082, 'data1': 4.537408993837771, 'data3': 1.8966527165993934, 'data2': -2.1411412898015474},
				{'data5': 38.2530637086055, 'data4': 9.332425792821748, 'data6': 27.857236201409364, 'data1': 4.619310987083088, 'data3': 2.0690602125454953, 'data2': -1.9302882774514702},
				{'data5': 34.438720598916895, 'data4': 9.513220174780471, 'data6': 27.965845545598036, 'data1': 4.963878495420151, 'data3': 2.0094951956712275, 'data2': 0.485395223406754},
				{'data5': 34.40160400576044, 'data4': 9.9592328678833, 'data6': 28.29504719478622, 'data1': 5.866895169061504, 'data3': 1.8646641282580685, 'data2': 1.0148110887224262},
				{'data5': 31.632395884702063, 'data4': 9.9592328678833, 'data6': 28.634017299850864, 'data1': 5.99698583149292, 'data3': 1.9091323391747712, 'data2': 1.7277083728232014},
				{'data5': 28.337303413000626, 'data4': 10.112368543461354, 'data6': 28.89002285677161, 'data1': 6.608883997619862, 'data3': 1.2458140606396706, 'data2': -0.7518294407014348},
				{'data5': 30.593266634573673, 'data4': 10.251587211938954, 'data6': 29.002040217881877, 'data1': 7.010125447426086, 'data3': 2.123797799310755, 'data2': -1.6357769722347086},
				{'data5': 27.138552256634128, 'data4': 10.750073595446374, 'data6': 29.12167068132944, 'data1': 7.616164154003396, 'data3': 2.921604467802701, 'data2': -3.2797987633745675},
				{'data5': 25.68991053497517, 'data4': 10.750073595446374, 'data6': 29.48043801244102, 'data1': 7.953421217456056, 'data3': 2.904989596696432, 'data2': -2.455108959786995},
				{'data5': 25.537311399373433, 'data4': 10.892640415567168, 'data6': 29.882094727536042, 'data1': 8.809608133443282, 'data3': 2.5389466869659425, 'data2': -2.350041791490065},
				{'data5': 22.221476684110637, 'data4': 11.140437697987107, 'data6': 30.15575906906871, 'data1': 9.74041393373862, 'data3': 1.5790942870374343, 'data2': -0.42789815461236946}]
};
displayDataInDiv('#whereDataGoes', exampleData);
	