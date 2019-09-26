$(document).ready(function () {
    let greenColor = "#00FF7F";
    let redColor = "#DC143C";
    $("#regex").val('^$');
    $(".input").val('');
    $(".input").css("background-color", greenColor);

    $(".input").keyup(function () {
        let regex = new RegExp($("#regex").val());

        if (regex.test($('#input1').val())) {
            $('#verification-icon1').attr("src", "src/img/certo.png");
            $("#input1").css("background-color", greenColor);
        }
        else {
            $('#verification-icon1').attr("src", "src/img/errado.png");
            $("#input1").css("background-color", redColor);
        }

        if (regex.test($('#input2').val())) {
            $('#verification-icon2').attr("src", "src/img/certo.png");
            $("#input2").css("background-color", greenColor);
        }
        else {
            $('#verification-icon2').attr("src", "src/img/errado.png");
            $("#input2").css("background-color", redColor);
        }

    });
});