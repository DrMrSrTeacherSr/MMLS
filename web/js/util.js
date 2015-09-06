/*****************************************************************
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

function niceAlert(message) {
	$('#modal-alert-body').html(message);
}

function get(name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}
