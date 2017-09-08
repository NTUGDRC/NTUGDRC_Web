$(document).ready(function() {
    var navbar =  $("nav");
    navbar.addClass("navbar navbar-default navbar-fixed-top");
    navbar.load("html_navbar.html");

    var footer =  $("footer");
    footer.addClass("container jumbotron text-center");
    footer.load("html_footer.html", function() {
        var height = $("div.namecard.col-xs-12").children("h1").height( );
        $("div.namecard.col-xs-12").children("img").height(height);
    }); 
});