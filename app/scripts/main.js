/* jshint devel:true */
console.log('main.js loaded');


// init scripts
jQuery(document).ready(function($) {
	$.each($('.msnr-gallery-grid'), function(index, val) {
		/* iterate through array or object */
		console.log('init msnr-gallery-grid');
		var $container = $(this);
		$container.imagesLoaded(function(){
			$container.masonry({
		 		itemSelector: '.item'
	 		});
		})
	});
	$('.mfp-popup').magnificPopup();
});
