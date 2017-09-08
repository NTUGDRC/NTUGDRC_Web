$(document).ready(function() {
    var HasFill = {
        Name       : false,
        Department : true,
        StudentID  : true,
        Email      : false,
        check      : function() {
            return ( this.Name && this.Department && this.StudentID && this.Email );
        }
    };
    $("#form_Name").blur(function() {
        var Value = $("#form_Name").val();
        if ( Value === "") {
            UpdateForm("Name", "has-warning", "請讓我們知道您的大名", "");
            HasFill.Name = false;
        } else {
            UpdateForm("Name", "has-success", "供提交社團資料用", Value + " ");
            HasFill.Name = true;
        }
    });
    $("#form_FBName").blur(function() {
        var Value = $("#form_FBName").val();
        UpdateForm("FBName", "has-success", "", Value + " ");
    });
    $("#form_Department").blur(function() {
        var Value = $("#form_Department").val();
        if ( Value === "" && $('input[name=YNNTU]:checked').val() !== "否" ) {
            UpdateForm("Department", "has-warning", "本校學生，請填寫系級", "");
            HasFill.Department = false;
        } else {
            UpdateForm("Department", "has-success", "供提交社團資料用", Value + " ");
            HasFill.Department = true;
        }
    });
    $("#form_StudentID").blur(function() {
        var Value = $("#form_StudentID").val().toUpperCase();
        if( Value.search(/^[a-zA-Z0-9_]+$/) == -1 && Value !== "" ) {
            UpdateForm("StudentID", "has-error", "不能包含特殊字元及中文字！", "");
            HasFill.StudentID = false;
        } else if ( Value === "" && $('input[name=YNNTU]:checked').val() !== "否" ) {
            UpdateForm("StudentID", "has-warning", "本校學生，請填寫學號", "");
            HasFill.StudentID = false;
        } else {
            UpdateForm("StudentID", "has-success", "會自動轉換成大寫", Value + " ");
            $("#form_StudentID").val( Value );
            HasFill.StudentID = true;
        }
    });
    $("#form_Email").blur(function() {
        var Value = $("#form_Email").val();
        if( Value.search(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})*$/) == -1 ) {
            UpdateForm("Email", "has-error", "信箱格式錯誤！", "");
            HasFill.Email = false;
        } else if (Value === "") {
            UpdateForm("Email", "has-warning", "請填寫信箱", "");
            HasFill.Email = false;
        } else {
            UpdateForm("Email", "has-success", "通知社團訊息及聯絡使用",Value + " ");
            HasFill.Email = true;
        }
    });
    $("label.input-group").click(function() {
        var Department = $('#form_Department').val(), StudentID = $('#form_StudentID').val();
        if( $('input[name=YNNTU]:checked').val() === "否" ) {
            UpdateForm("Department", "has-success", "如果可以，請填寫所在單位", Department +" ");
            HasFill.Department = true;
            UpdateForm("StudentID", "has-success", "會自動轉換成大寫", StudentID + " ");
            HasFill.StudentID = true;
        } else {
            if( Department == "" ) {
                UpdateForm("Department", "has-warning", "本校學生，請填寫系級", "");
                HasFill.Department = false;
            } else {
                UpdateForm("Department", "has-success", "供提交社團資料用", Department + " ");
                HasFill.Department = true;
            }
            if( StudentID == "" ) {
                UpdateForm("StudentID", "has-warning", "本校學生，請填寫學號", "");
                HasFill.StudentID = false;
            } else {   
                UpdateForm("StudentID", "has-success", "會自動轉換成大寫",  StudentID + " ");
                HasFill.StudentID = true;
            }
        }
    });
    // select all desired input fields and attach tooltips to them
    $("#form :input.form-control").tooltip({ placement: "bottom" });
    $("label.input-group").tooltip({ placement: "bottom" });

	// event for when form submit 
	$('#form').submit( function() {
		// Stop the browser from submitting the form.
		event.preventDefault();
		// prepare ajax data
		var form_Name       = $("#form_Name").val();
		var form_FBName     = $("#form_FBName").val();
		var form_YNNTU      = $('input[name=YNNTU]:checked').val();
		var form_Department = $('#form_Department').val();
		var form_StudentID  = $('#form_StudentID').val();
		var form_Email      = $('#form_Email').val();

		// check blank is fill up and username is correct
        if( !HasFill.Name ) {
            UpdateForm("Name", "has-error", "請讓我們知道您的大名", "");
        }
        if( !HasFill.Email ) {
            UpdateForm("Email", "has-error", "未填寫或信箱格式錯誤", "");
        }
        if( !HasFill.Department ) {
            UpdateForm("Department", "has-error", "本校學生，請填寫系級", "");
        }
        if( !HasFill.StudentID ) {
            UpdateForm("StudentID", "has-error", "本校學生，請填寫學號", "");
        }
        if( HasFill.check() ) {
            // ajax to insert adminuser data
            $.ajax({
            	url: 'https://script.google.com/macros/s/AKfycbxKknDMj5Oi8ftXUDpCw-9yNntWnMFFD5KA_9gLt8tvY1uJhpXy/exec',
            	type: 'GET',
            	data: {
                    Name       : form_Name,
                    FBName     : form_FBName,
                    YNNTU      : form_YNNTU,
                    Department : form_Department,
                    StudentID  : form_StudentID,
                    Email      : form_Email,
            	},
            	dataType: 'json',
            	cache: false,
                beforeSend : function() {
                    $('div.formloader.loader-bar ').addClass("is-active");
                },
                complete : function() {
                    $('div.formloader.loader-bar ').removeClass("is-active");
                },
            	error: function(xhr) {
            		console.log( "Ajax request 發生錯誤" );
            	},
            	success: function(response) {
            		if (response.mode == 'success') {
                        bootbox.alert({
                            title: "Successful",
                            message: "資料提交成功，按下 OK 後會自動重新整理。",
                            className: "medal-success",
                            callback: function(){
                                window.location.reload(true);
                            }
                        });
            		} else {
            			console.log( "fail!" );
                    }
            	}
            });
        } else {
            return;
        }
	});
});

function InputStatus(Selector, HasClass) {
    $(Selector).removeClass("has-error");
    $(Selector).removeClass("has-success");
    $(Selector).removeClass("has-warning"); 
    $(Selector).addClass(HasClass);   
}

function UpdateTooltip(Selector, tooltip) {
    $(Selector).attr('title', tooltip).tooltip('fixTitle');
}

function UpdateForm( Selector, HasClass, Tooltip, Value) {
    InputStatus("#form_"+Selector+"_div", HasClass);
    UpdateTooltip("#form_"+Selector, Tooltip);
    $("#info_"+Selector).text( Value );
}
