(function ($) {
  "use strict";

  // Masquer l'overlay de chargement une fois la page prête
  function hidePageLoadingOverlay() {
    var el = document.getElementById('pageLoadingOverlay');
    if (el) {
      el.classList.add('loaded');
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 450);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hidePageLoadingOverlay);
  } else {
    hidePageLoadingOverlay();
  }

  // COUNTER NUMBERS
    jQuery('.counter-thumb').appear(function() {
      jQuery('.counter-number').countTo();
    });
    
    // CUSTOM LINK
    $('.smoothscroll').click(function(){
    var el = $(this).attr('href');
    var elWrapped = $(el);
    var header_height = $('.navbar').height();

    scrollToDiv(elWrapped,header_height);
    return false;

    function scrollToDiv(element,navheight){
      var offset = element.offset();
      var offsetTop = offset.top;
      var totalScroll = offsetTop-navheight;

      $('body,html').animate({
      scrollTop: totalScroll
      }, 300);
    }
});

})(window.jQuery);

