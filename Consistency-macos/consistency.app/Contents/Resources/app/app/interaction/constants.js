$(function () {
    // on ready

    var quotes = new Array("Cooking up some games...", "Hold onto your butts...", "This better be good...", "Preparing to launch...", "3...2...1..."),
    randno = quotes[Math.floor( Math.random() * quotes.length )];
    $('#status').text( randno );
    setTimeout(function () {
        $("#status").css({
            opacity: 1,
        })
        $("img").css({
            opacity: 1,
        })

    }, 300);
    $( "body" ).fadeOut( 3000, function() {
      window.location.href = "hangar.html";
  });
})
