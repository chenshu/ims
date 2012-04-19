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
                $("input:submit", ".table").click(function(event) {
                    $(this).parents("form").validate({
                        errorPlacement: function(error, element) {
                            error.appendTo(element.parent());
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
