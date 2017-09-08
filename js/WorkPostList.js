$(document).ready(function() {
    var AjaxConfing = AjaxConfing_init();

    var $_GET = Geturl_init();

    var path = $(location).attr('pathname');
    switch (path) {
        case "/WorkPostList.html": {
            AjaxConfing.data.Mode = "GetPostList";
            AjaxConfing.dataType = 'json';
            AjaxConfing.success = WorkPostListDisplay;
            break;
        }
        case "/WorkPost.html": {
            AjaxConfing.data.Mode = "GetPost";
            AjaxConfing.data.PostName = $_GET["PostName"];
            AjaxConfing.dataType = 'text';
            AjaxConfing.success = WorkPostDisplay;
            break;
        }
        default: {
            console.log("Error Page");
            return;
        }
    }
    // ajax to req data
    $.ajax( AjaxConfing );
});

function AjaxConfing_init(){
    var Confing = {
        url        : "https://script.google.com/macros/s/AKfycbwObqOxrUqKVflXOMqEA1kCWUau6oz2B78IHzOaR80l4Re09qU/exec",
        type       : 'GET',
        data       : new Object(),
        cache      : false,
        beforeSend : function() {
            $('#LoadingDiv').show();
        },
        complete : function() {
            $('#LoadingDiv').hide();
        },
        error : function(xhr) {
            console.log( "Ajax request 發生錯誤" );
        }
    };
    return Confing; 
}

function WorkPostDisplay(MDtext) {
    var target = $('#PostDiv');
    var converter = new showdown.Converter();
    var html = converter.makeHtml(MDtext);
    target.html(html);
}
function WorkPostListDisplay(List) {
    // remove first element
    List.shift();
    List.forEach( function( data ) {
        var Author = $('<p>');
        for (var i = 7; i < data.length; i++) {
            if( data[i] === "" ) { continue; }
            var name = data[i].split("::");
            var href = (name[1])? name[1].split("==>"):"";
            var a_Attr = new Object();
            switch (href[0]) {
                case "url": {
                    a_Attr.href = href[1];
                    a_Attr.target = "_blank"
                    break;
                }
                case "mail": {
                    a_Attr.href = "mailto:"+href[1];
                    break;
                }
                default: {
                    a_Attr.href = "#";
                    break;
                }
            }
            a_Attr.text = name[0];
            var span = ( i == 7 )? "by":"|";
            Author.append(
                $('<span>', { text:span }),
                $('<a>', a_Attr)
            );
        }
        var href = (data[2] === "")?  "#":"WorkPost.html?PostName=" + data[2];
        $("#PostListDiv").append(
            $('<div>', { class:"row work-container" }).append(
                $('<div>', { class:"col-xs-12 col-md-4" }).append(
                    $('<a>', { class:"work-img", href:href }).append(
                        $('<img>', { src:data[4] }),
                        $('<div>', { text:data[6] })                    
                    )
                ),
                $('<div>', { class:"col-xs-12 col-md-8" }).append(
                    $('<div>', { class:"work-info" }).append(
                        $('<a>', { id:"caption", href:href, text:data[3] + "\xa0-\xa0[" + data[1] + "]" }),
                        Author,
                        $('<p>', { class:"hidden-xs", text:data[5] }),
                        $('<p>', { class:"text-right", text:"資料最後更新日期："+data[0].substr(0, 10) })
                    )
                )
            ),
            $('<hr>')
        );
        var rowheight = $("div.row.work-container").last().children("div.col-xs-12.col-md-8").height();
        var typeheight = $("a.work-img").last().children("div").height();
        $("a.work-img").last().children("img").height(rowheight-typeheight);
    }, this);
}

function Geturl_init() {
    var StrUrl = $(location).attr('search');
    var GetPara, ParaVal;
    var $_GET = [];
    if (StrUrl.indexOf("?") != -1) {
        GetPara = StrUrl.split("?")[1].split("&");
        for (i = 0; i < GetPara.length; i++) {
            ParaVal = GetPara[i].split("=");
            $_GET.push(ParaVal[0]);
            $_GET[ParaVal[0]] = ParaVal[1];
        }
    }
    return $_GET;
}

