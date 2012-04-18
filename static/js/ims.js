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
                    var ret = validateForm($(":input"));
                    event.preventDefault();
                    return ret;
                });
            },
            error: function(xhr, status, index, anchor) {
                $(anchor.hash).html(
                    "Couldn't load this tab. We'll try to fix this as soon as possible." );
            }
        }
    });

});

function validateForm(allTags) {
    var allGood = true;
    for (var i = 0; i < allTags.length; i++) {
        if (!validTag(allTags[i])) {
            allGood = false;
            break;
        }
    }
    return allGood;

    function validTag(thisTag) {
        var outClass = "";
        var allClasses = thisTag.className.split(" ");
        for (var j = 0; j < allClasses.length; j++) {
            outClass += validBasedOnClass(allClasses[j]) + " ";
        }
        thisTag.className = outClass;
        $(thisTag).parents("label").addClass("ui-state-error");
        if (outClass.indexOf("invalid") > -1) {
            invalidLabel(thisTag.parentNode);
            thisTag.focus();
            if (thisTag.nodeName == "INPUT") {
                thisTag.select();
            }
            return false;
        }
        return true;

        function validBasedOnClass(thisClass) {
            var classBack = "";
            switch(thisClass) {
                case "":
                case "invalid":
                    break;
                case "reqd":
                    if (allGood && thisTag.value == "") {
                        classBack = "invalid ";
                    }
                    classBack += thisClass;
                    break;
                case "radio":
                    if (allGood && !radioPicked(thisTag.name)) {
                        classBack = "invalid ";
                    }
                    classBack += thisClass;
                    break;
                default:
                    classBack += thisClass;
            }
            return classBack;
        }

        function radioPicked(radioName) {
            var radioSet = "";
            for (var k = 0; k < document.forms.length; k++) {
                if (!radioSet) {
                    radioSet = document.forms[k][radioName];
                }
            }
            if (!radioSet)
                return false;
            for (k = 0; k < radioSet.length; k++) {
                if (radioSet[k].checked) {
                    return true;
                }
            }
            return false;
        }

        function invalidLabel(parentTag) {
            if (parentTag.nodeName == "LABEL") {
                parentTag.className += " invalid";
            }
        }
    }
}

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
