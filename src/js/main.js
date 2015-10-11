function wrapBySymbol (text, wrapper){
	var wrapper = wrapper || 'span'
	var textArr = text.split("");
	var wrappedText='';
	for (var i = 0; i < textArr.length; i++) {
		var escaped = textArr[i].replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"_p");
		 wrappedText= wrappedText +'<' + wrapper + ' class="char-' + i + ' char-' + escaped + '">' + textArr[i] + '</' + wrapper + '>';
	};
	return wrappedText
}

function wrapByWord(text, wrapper){
	var wrapper = wrapper || 'span'
	var textArr = text.split(" ");
	var wrappedText='';
	for (var i = 0; i < textArr.length; i++) {
		var wrappedWord = wrapBySymbol(textArr[i], wrapper);
		var escaped = textArr[i].replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"_p");
		wrappedText += '<' + wrapper + ' class="word-' + i + ' word-' + escaped + '">' + wrappedWord + '</' + wrapper + '>';
		if (i < textArr.length - 1) {
			wrappedText += '&nbsp;';
		};
	};
	return wrappedText
}

$(document).ready(function() {
	$.each($('.type-animation'), function(index, val) {
		 /* iterate through array or object */
		 $(this).html(wrapByWord($(this).text()));
		 $(this).addClass('type-animation-init comp-' + index);
	});
});