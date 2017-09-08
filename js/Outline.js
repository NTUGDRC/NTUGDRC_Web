$(document).ready(function() {
    CrabRawData("first");

    $("#Semester").change(function() {
        var Value = $("#Semester").val();
        CrabRawData(Value);
    });

    // search table data, keyup function
    $("#search_input").keyup(function() {
        var filter, table_rows;
        filter = $("#search_input").val().toLowerCase();
        //selector for rows
        table_rows = $("#outline_data").children("tr");
        
        if(filter != "") {
            var a, b, c, d, e, f;
            var found = false;
            table_rows.each(function(){
                a = $(this).children("#table_week"    ).text().toLowerCase();
                b = $(this).children("#table_date"    ).text().toLowerCase();
                c = $(this).children("#table_topic"   ).text().toLowerCase();
                d = $(this).children("#table_type"    ).text().toLowerCase();
                e = $(this).children("#table_tag"     ).text().toLowerCase();
                f = $(this).children("#table_location").text().toLowerCase();

                re = (a.search(filter) != -1) || (b.search(filter) != -1) || (c.search(filter) != -1) || 
                     (d.search(filter) != -1) || (e.search(filter) != -1) || (f.search(filter) != -1);
                if( re ) {
                    $(this).css("display", "");
                    found = true;
                } else {
                    $(this).css("display", "none");
                }
            });
            if ( found == true ) {
                $("#NoResult").css("display", "none");
            } else {
                $("#NoResult").css("display", "");
            }
        } else {
            table_rows.each(function(){
                $(this).css("display", "");
            });
            $("#NoResult").css("display", "none");
        }
    });
});

function selectlable(type) {
    var label = "label label-default";
    switch (type) {
        case "行政": case "通用":
            label = "label label-orange"
            break;
        case "分析": case "機制":
            label = "label label-green"
            break;
        case "風格":
            label = "label label-purple"
            break;
        case "具現":
            label = "label label-blue"
            break;
        case "公關":
            label = "label label-yellow"
            break;
    }
    return label;
}

function CrabRawData(semester) {
    var googleurl = "https://script.google.com/macros/s/AKfycbzcNdct5ZW1hwZj2TMw-HvLJ3z07tPO3mgQ0_cPIl0B7DQlHKg/exec";
    $.ajax({
        url: googleurl,
        type: 'GET',
        data: {
            semester: semester,
        },
        dataType: 'json',
        cache: false,
        error: function(xhr) {
            console.log( "Ajax request 發生錯誤" );
        },
        beforeSend:function(){
            $('#LoadingDiv').show(); $('tbody').hide();
        },
        complete:function(){
            $('#LoadingDiv').hide(); $('tbody').show();
        },
        success: function(response) {
            $("tbody").html("");
            // remove first element
            response[1].shift();
            // append data
            response[1].forEach( function(element) {
                var row = $('<tr>', { });
                //week
                $('<td>', { class:"hidden-xs", text:element[0], id:"table_week" }).appendTo(row);
                //date
                $('<td>', { text:element[1], id:"table_data" }).appendTo(row);
                //topic
                $('<td>', { text:element[2], id:"table_topic" }).appendTo(row);
                //type
                $('<td>', { text:element[3], id:"table_type" }).appendTo(row);
                //tag
                var tag = $('<td>', { class:"hidden-xs", id:"table_tag" });
                var lableclass = selectlable(element[4]);
                $('<span>', {
                    class: lableclass,
                    text:element[4],
                }).appendTo(tag);
                for (var i = 6; i < element.length; i++) {
                    if(element[i] === "") { break; } 
                    $('<span>', {
                        class:"label label-default",
                        text:element[i],
                    }).appendTo(tag);
                }
                tag.appendTo(row);
                //loaction
                $('<td>', { text:element[5], id:"table_loaction" }).appendTo(row);   
                //insert to table
                row.appendTo("tbody");
            }, this);

            if(semester == "first") {
                response[0].forEach( function(element, index) {
                    var select = (index == 0)? true:false;
                    $('<option>', { text:element[0], selected:select }).appendTo("#Semester");
                }, this);
            }
        }
    });
}