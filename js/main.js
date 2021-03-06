$(function() {
	var implementation = getUrlParameter('implementation') || 'control',
		numQuestions = getUrlParameter('numQuestions') || 10,
		uid = getUrlParameter('id') || guid();

	$('body').mcquiz({
		implementation: implementation,
		numQuestions: numQuestions,
		uid: uid
	});

	//http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html
	function getUrlParameter(sParam) {
	    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
	        sURLVariables = sPageURL.split('&'),
	        sParameterName,
	        i;

	    for (i = 0; i < sURLVariables.length; i++) {
	        sParameterName = sURLVariables[i].split('=');

	        if (sParameterName[0] === sParam) {
	            return sParameterName[1] === undefined ? true : sParameterName[1];
	        }
	    }
	};
});