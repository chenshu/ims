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

    $(".tabs").hide();

    $(".tabs").tabs({
        fx: {opacity: 'toggle'},
        selected: -1,
        collapsible: true,
        ajaxOptions: {
            error: function(xhr, status, index, anchor) {
                $(anchor.hash).html(
                    "Couldn't load this tab. We'll try to fix this as soon as possible." );
            }
        }
    });

    $(".showLink").click(function() {
        $(".tabs").hide();
        var anchor = $("#" + $(this).attr("id").split('_')[0] + "_tabs");
        anchor.show("slow");
        //anchor.effect("highlight", {}, 2000);
        return false;
    });

});
