$(document).ready(function() {
    $("#menu").accordion({
        animated: "slide",
        autoHeight: false,
        header: ".menuLink",
        collapsible: true,
        active: -1,
        change: function(event, ui){
            $(".tabs").hide();
        },
    });

    $(".showLink").click(function(event) {
        $(".tabs").hide();
        var anchor = $("#" + $(this).attr("id").split('_')[0] + "_tabs");
        anchor.show("slow");
        //anchor.effect("highlight", {}, 2000);
        event.preventDefault();
        return false;
    });

    $(".tabs").hide();

    $(".tabs").tabs({
        fx: {opacity: 'toggle'},
        selected: -1,
        collapsible: true,
        ajaxOptions: {
            success: function() {
                $(".add_button > a").toggle(
                    function() {
                        $("#" + $(this).parents("div").attr("id") + "_field").show("slow");
                        return false;
                    },
                    function() {
                        $("#" + $(this).parents("div").attr("id") + "_field").hide();
                        return false;
                    }
                );
                $(".table").styleTable();
                $("a, input:submit", ".table").button();
                var options = {
                    success: showAdd,
                    error: showError,
                    dataType: 'json',
                };
                $("input:submit", ".table").click(function(event) {
                    $(this).parents("form").validate({
                        submitHandler: function(form) {
                            jQuery(form).ajaxSubmit(options);
                        },
                        errorPlacement: function(error, element) {
                            error.appendTo(element.parent());
                        }
                    });
                });
                $(".del_button").click(function(event) {
                    event.preventDefault();
                    $.getJSON(this.href, {}, function(response) {
                        if (response.action == 'success') {
                            $("#bodyText").append("delete success");
                            $("#bodyText").dialog("open");
                            //$("#bodyText").show("slow", {}, 500, callback);
                            //$("#bodyText").effect("highlight", {}, 2000);
                        }
                    });
                });
            },
            error: function(xhr, status, index, anchor) {
                $(anchor.hash).html(
                    "Couldn't load this tab. We'll try to fix this as soon as possible." );
            }
        }
    });

});

function showAdd(data) {
    if (data.action == 'success') {
        $('table:first tbody>tr:last').clone(true).insertAfter('table:first tbody>tr:last');
        var rows_length = $('table:first tbody>tr').length
        var cells_length = $('table:first tbody>tr:last td').length;
        alert($('table:first tbody>tr:last td:first').text());
        $('table:first tbody>tr:last td:first').html(rows_length);
        alert($('table:first tbody>tr:last td:last').text());
        alert($('table:first tbody>tr:last td:last').html());
        alert($('table:first tbody>tr:last td:last').val());
        $('table:first tbody>tr:last td:nth-child(1)').val(rows_length);
        for (i = 0; i < data.data.length; i++) {
            $('table:first tbody>tr:last td:(' + (i+2) + ')').html(data.data[i]);
        }
        $('table:first tbody>tr:last td:last').html('<a href="/business/imposition/database/building/delete?t=' + $('table').parents("div").attr("id") + '">删除</a>');
        /*
        var tb = $('table')[0];
        var lastRow = tb.rows.length;
        //var row = tb.insertRow(lastRow);
        var class_first = $('td:first').attr("class");
        var class_last = $('td:last').attr("class");
        var s = '<tr><td>' + lastRow + '</td>';
        for (i = 0; i < data.data.length; i++) {
            s += '<td>' + data.data[i] + '</td>';
        }
        s += '<td><a href="/business/imposition/database/building/delete?t=' + $('table').parents("div").attr("id") + '">删除</a>';
        //$('table:first tbody>tr:last').after(s);
        $('table:first tbody>tr:last').clone(true).insertAfter('table:first tbody>tr:last');
        //$('table:first tbody>tr:last td:first').addClass(class_first);
        //$('table:first tbody>tr:last td:not:first').addClass(class_last);
        //$("table:first tbody>tr:last").each(function() {this.reset();});
        */
    }
}

function showError(data) {
    $("#bodyText").append("error");
    $("#bodyText").show("slow", {}, 500, callback);
    $("#bodyText").effect("highlight", {}, 2000);
}

function callback() {
    setTimeout(function() {
        $("#bodyText").hide();
    }, 5000);
};

(function ($) {
    $.fn.styleTable = function (options) {
        var defaults = {
            css: 'styleTable'
        };
        options = $.extend(defaults, options);

        return this.each(function () {

            input = $(this);
            input.addClass(options.css);

            input.find("tr").live('mouseover mouseout', function (event) {
                if (event.type == 'mouseover') {
                    $(this).children("td").addClass("ui-state-hover");
                } else {
                    $(this).children("td").removeClass("ui-state-hover");
                }
            });

            input.find("th").addClass("ui-state-default");
            input.find("td").addClass("ui-widget-content");

            input.find("tr").each(function () {
                $(this).children("td:not(:first)").addClass("first");
                $(this).children("th:not(:first)").addClass("first");
            });
        });
    };
})(jQuery);
