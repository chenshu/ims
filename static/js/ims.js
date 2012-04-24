var oTable;
$(document).ready(function() {
    $(".menu").accordion({
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
                //$(".table_data").styleTable();
                //$("a", ".add_button").button();
                //$("a", ".del_button").button();
                /*
                *$('.table tbody tr').click(function(e) {
                *    if ($(this).hasClass('row_selected')) {
                *        $(this).removeClass('row_selected');
                *    }
                *    else {
                *        oTable.$('tr.row_selected').removeClass('row_selected');
                *        $(this).addClass('row_selected');
                *    }
                *});
                */
                var options = {
                    success: fnClickAddRow,
                    error: showError,
                    dataType: 'json',
                };
                $("#formAddNewRow").validate({
                    submitHandler: function(form) {
                        jQuery(form).ajaxSubmit(options);
                    },
                    errorPlacement: function(error, element) {
                        error.appendTo(element.parent());
                    }
                });
                $("input:submit", ".add_form").click(function(event) {
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
                    var anSelected = fnGetSelected(oTable);
                    if (anSelected.length !== 0) {
                        $.getJSON($(this).find("a").attr("href") + "&id=" + anSelected[0].id, {}, function(response) {
                            if (response.action == 'success') {
                                oTable.fnDeleteRow(anSelected[0]);
                            }
                        });
                    }
                    event.preventDefault();
                    return false;
                });
                oTable = $(".table").dataTable({
                    "bJQueryUI": true,
                    "sPaginationType": "full_numbers",
                    "bPaginate": true,
                    "bLengthChange": true,
                    "bFilter": true,
                    "bSort": true,
                    "bInfo": true,
                    "bAutoWidth": true,
                    "oLanguage": {
                        "sLengthMenu": "Display _MENU_ records per page",
                        "sZeroRecords": "Nothing found - sorry",
                        "sInfo": "Showing _START_ to _END_ of _TOTAL_ records",
                        "sInfoEmpty": "Showing 0 to 0 of 0 records",
                        "sInfoFiltered": "(filtered from _MAX_ total records)"
                    },
                    "fnDrawCallback": function(oSettings) {
                        if (oSettings.bSorted || oSettings.bFiltered || oSettings.bInitialised) {
                            for (var i=0, iLen=oSettings.aiDisplay.length; i<iLen; i++) {
                                $('td:eq(0)', oSettings.aoData[ oSettings.aiDisplay[i] ].nTr).html(i+1);
                            }
                        }
                    },
                    "aoColumnDefs": [
                        {"bSortable": false, "aTargets": [ 0 ]}
                    ],
                    "aaSorting": [[ 1, 'asc' ]],
                });
                oTable.fnSetColumnVis(1, false);
                var add_url = $(".add_button > a").attr("href");
                var delete_url = $(".del_button > a").attr("href");
                oTable.makeEditable({
                    sAddURL:add_url,
                    sDeleteURL: delete_url,
                    "aoColumns": [
                        null,
                        {
                            indicator: 'Saving...',
                            tooltip: 'Click to select',
                            loadtext: 'loading...',
                            type: 'select',
                            onblur: 'cancel',
                            submit: 'OK',
                            data: "{'residential':'住宅', 'nonresidential':'非住宅'}",
                            column: 'product_type',
                            sUpdateURL: "/business/imposition/database/building/update?t=building_basic_price"
                        },
                        {}, 
                        {},
                        {},
                    ],
                    oAddNewRowButtonOptions: { 
                        label: "添加...",
                        icons: { primary: 'ui-icon-plus' }
                    },
                    oDeleteRowButtonOptions: {
                        label: "删除",
                        icons: { primary: 'ui-icon-trash' }
                    },
                    oAddNewRowOkButtonOptions: {
                        label: "确定",
                        icons: { primary: 'ui-icon-check' },
                        name: "action",
                        value: "add-new"
                    },
                    oAddNewRowCancelButtonOptions: { 
                        label: "取消",
                        class: "back-class",
                        name: "action",
                        value: "cancel-add",
                        icons: { primary: 'ui-icon-close' }
                    },
                    oAddNewRowFormOptions: {
                        title: '新增',
                        show: "blind",
                        hide: "explode"
                    },
                });
            },
            error: function(xhr, status, index, anchor) {
                $(anchor.hash).html(
                    "Couldn't load this tab. We'll try to fix this as soon as possible." );
            }
        }
    });

});

function fnClickAddRow(data) {
    if (data.action == 'success') {
        var content = new Array();
        content[0] = "";
        for (i = 0; i < data.data.length; i++) {
            content[i+1] = data.data[i];
        }
        $('.table').dataTable().fnAddData(content);
        $('.table tbody tr:last').attr("id", data.data[0]);
        /*
        *$('.table tbody tr:last').click(function(e) {
        *    if ($(this).hasClass('row_selected')) {
        *        $(this).removeClass('row_selected');
        *    }
        *    else {
        *        oTable.$('tr.row_selected').removeClass('row_selected');
        *        $(this).addClass('row_selected');
        *    }
        *});
        */
    }
}

function fnGetSelected(oTableLocal) {
    return oTableLocal.$('tr.row_selected');
}

function showError(data) {
    alert(data);
}

function callback() {
    setTimeout(function() {
        $("#bodyText").hide();
    }, 5000);
};

/*
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
*/
