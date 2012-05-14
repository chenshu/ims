var oTable_building_basic_price;
var oTable_building_towards_correction;
var oTable_building_roof_type_correction;
var oTable_building_additional_price;
var oTable_building_volume_ratio;
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
                $("#formAddNewRow_building_basic_price").validate({
                    submitHandler: function(form) {
                        jQuery(form).ajaxSubmit(options);
                    },
                    errorPlacement: function(error, element) {
                        error.appendTo(element.parent());
                    }
                });
                $("#formAddNewRow_building_towards_correction").validate({
                    submitHandler: function(form) {
                        jQuery(form).ajaxSubmit(options);
                    },
                    errorPlacement: function(error, element) {
                        error.appendTo(element.parent());
                    }
                });
                $("#formAddNewRow_building_roof_type_correction").validate({
                    submitHandler: function(form) {
                        jQuery(form).ajaxSubmit(options);
                    },
                    errorPlacement: function(error, element) {
                        error.appendTo(element.parent());
                    }
                });
                $("#formAddNewRow_building_additional_price").validate({
                    submitHandler: function(form) {
                        jQuery(form).ajaxSubmit(options);
                    },
                    errorPlacement: function(error, element) {
                        error.appendTo(element.parent());
                    }
                });
                $("#formAddNewRow_building_volume_ratio").validate({
                    submitHandler: function(form) {
                        jQuery(form).ajaxSubmit(options);
                    },
                    errorPlacement: function(error, element) {
                        error.appendTo(element.parent());
                    }
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
                oTable_building_basic_price = $("#building_basic_price_tb").dataTable({
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
                        {"bSortable": false, "aTargets": [ 0 ]},
                        {"bSortable": false, "bVisible": false, "aTargets": [ 1 ]},
                    ],
                    "aaSorting": [[ 1, 'asc' ]],
                    "bRetrieve": true,
                    "bDestroy": true,
                });
                var add_url_building_basic_price = $("#building_basic_price_add > a").attr("href");
                var delete_url_building_basic_price = $("#building_basic_price_del > a").attr("href");
                oTable_building_basic_price.makeEditable({
                    sAddNewRowFormId:"formAddNewRow_building_basic_price",
                    sAddNewRowButtonId:"btnAddNewRow_building_basic_price",
                    sAddNewRowOkButtonId: "btnAddNewRowOk_building_basic_price",
                    sAddNewRowCancelButtonId: "btnAddNewRowCancel_building_basic_price",
                    sDeleteRowButtonId: "btnDeleteRow_building_basic_price",
                    sAddURL:add_url_building_basic_price,
                    sDeleteURL: delete_url_building_basic_price,
                    sAddDeleteToolbarSelector: ".add_delete_toolbar_building_basic_price",
                    "aoColumns": [
                        null,
                        {
                            cssclass: 'required',
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
                        {
                            cssclass: 'required',
                            indicator: 'Saving...',
                            tooltip: 'Click to input',
                            loadtext: 'loading...',
                            type: 'text',
                            column: 'product_structure',
                            sUpdateURL: "/business/imposition/database/building/update?t=building_basic_price"
                        },
                        {
                            cssclass: 'required, number',
                            indicator: 'Saving...',
                            tooltip: 'Click to input',
                            loadtext: 'loading...',
                            type: 'text',
                            column: 'product_price',
                            sUpdateURL: "/business/imposition/database/building/update?t=building_basic_price"
                        },
                        {
                            cssclass: 'required',
                            indicator: 'Saving...',
                            tooltip: 'Click to input',
                            loadtext: 'loading...',
                            type: 'text',
                            column: 'product_classify',
                            sUpdateURL: "/business/imposition/database/building/update?t=building_basic_price"
                        },
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
                oTable_building_towards_correction = $("#building_towards_correction_tb").dataTable({
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
                        {"bSortable": false, "aTargets": [ 0 ]},
                        {"bSortable": false, "bVisible": false, "aTargets": [ 1 ]},
                    ],
                    "aaSorting": [[ 1, 'asc' ]],
                    "bRetrieve": true,
                    "bDestroy": true,
                });
                var add_url_building_towards_correction = $("#building_towards_correction_add > a").attr("href");
                var delete_url_building_towards_correction = $("#building_towards_correction_del > a").attr("href");
                oTable_building_towards_correction.makeEditable({
                    sAddNewRowFormId:"formAddNewRow_building_towards_correction",
                    sAddNewRowButtonId:"btnAddNewRow_building_towards_correction",
                    sAddNewRowOkButtonId: "btnAddNewRowOk_building_towards_correction",
                    sAddNewRowCancelButtonId: "btnAddNewRowCancel_building_towards_correction",
                    sDeleteRowButtonId: "btnDeleteRow_building_towards_correction",
                    sAddURL:add_url_building_towards_correction,
                    sDeleteURL: delete_url_building_towards_correction,
                    sAddDeleteToolbarSelector: ".add_delete_toolbar_building_towards_correction",
                    "aoColumns": [
                        null,
                        {
                            cssclass: 'required',
                            indicator: 'Saving...',
                            tooltip: 'Click to select',
                            loadtext: 'loading...',
                            type: 'select',
                            onblur: 'cancel',
                            submit: 'OK',
                            data: "{'east':'东', 'south':'南', 'west':'西', 'north':'北'}",
                            column: 'towards',
                            sUpdateURL: "/business/imposition/database/building/update?t=building_towards_correction"
                        },
                        {
                            cssclass: 'required, number',
                            indicator: 'Saving...',
                            tooltip: 'Click to input',
                            loadtext: 'loading...',
                            type: 'text',
                            column: 'correction_factor',
                            sUpdateURL: "/business/imposition/database/building/update?t=building_towards_correction"
                        },
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
                oTable_building_roof_type_correction = $("#building_roof_type_correction_tb").dataTable({
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
                        {"bSortable": false, "aTargets": [ 0 ]},
                        {"bSortable": false, "bVisible": false, "aTargets": [ 1 ]},
                    ],
                    "aaSorting": [[ 1, 'asc' ]],
                    "bRetrieve": true,
                    "bDestroy": true,
                });
                var add_url_building_roof_type_correction = $("#building_roof_type_correction_add > a").attr("href");
                var delete_url_building_roof_type_correction = $("#building_roof_type_correction_del > a").attr("href");
                oTable_building_roof_type_correction.makeEditable({
                    sAddNewRowFormId:"formAddNewRow_building_roof_type_correction",
                    sAddNewRowButtonId:"btnAddNewRow_building_roof_type_correction",
                    sAddNewRowOkButtonId: "btnAddNewRowOk_building_roof_type_correction",
                    sAddNewRowCancelButtonId: "btnAddNewRowCancel_building_roof_type_correction",
                    sDeleteRowButtonId: "btnDeleteRow_building_roof_type_correction",
                    sAddURL:add_url_building_roof_type_correction,
                    sDeleteURL: delete_url_building_roof_type_correction,
                    sAddDeleteToolbarSelector: ".add_delete_toolbar_building_roof_type_correction",
                    "aoColumns": [
                        null,
                        {
                            cssclass: 'required',
                            indicator: 'Saving...',
                            tooltip: 'Click to select',
                            loadtext: 'loading...',
                            type: 'text',
                            column: 'roof_type',
                            sUpdateURL: "/business/imposition/database/building/update?t=building_roof_type_correction"
                        },
                        {
                            cssclass: 'required, number',
                            indicator: 'Saving...',
                            tooltip: 'Click to input',
                            loadtext: 'loading...',
                            type: 'text',
                            column: 'correction_factor',
                            sUpdateURL: "/business/imposition/database/building/update?t=building_roof_type_correction"
                        },
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
                oTable_building_additional_price = $("#building_additional_price_tb").dataTable({
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
                        {"bSortable": false, "aTargets": [ 0 ]},
                        {"bSortable": false, "bVisible": false, "aTargets": [ 1 ]},
                    ],
                    "aaSorting": [[ 1, 'asc' ]],
                    "bRetrieve": true,
                    "bDestroy": true,
                });
                var add_url_building_additional_price = $("#building_additional_price_add > a").attr("href");
                var delete_url_building_additional_price = $("#building_additional_price_del > a").attr("href");
                oTable_building_additional_price.makeEditable({
                    sAddNewRowFormId:"formAddNewRow_building_additional_price",
                    sAddNewRowButtonId:"btnAddNewRow_building_additional_price",
                    sAddNewRowOkButtonId: "btnAddNewRowOk_building_additional_price",
                    sAddNewRowCancelButtonId: "btnAddNewRowCancel_building_additional_price",
                    sDeleteRowButtonId: "btnDeleteRow_building_additional_price",
                    sAddURL:add_url_building_additional_price,
                    sDeleteURL: delete_url_building_additional_price,
                    sAddDeleteToolbarSelector: ".add_delete_toolbar_building_additional_price",
                    "aoColumns": [
                        null,
                        {
                            cssclass: 'required',
                            indicator: 'Saving...',
                            tooltip: 'Click to select',
                            loadtext: 'loading...',
                            type: 'text',
                            column: 'additional',
                            sUpdateURL: "/business/imposition/database/building/update?t=building_additional_price"
                        },
                        {
                            cssclass: 'required, number',
                            indicator: 'Saving...',
                            tooltip: 'Click to input',
                            loadtext: 'loading...',
                            type: 'text',
                            column: 'price',
                            sUpdateURL: "/business/imposition/database/building/update?t=building_additional_price"
                        },
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
                oTable_building_volume_ratio = $("#building_volume_ratio_tb").dataTable({
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
                        {"bSortable": false, "aTargets": [ 0 ]},
                        {"bSortable": false, "bVisible": false, "aTargets": [ 1 ]},
                    ],
                    "aaSorting": [[ 1, 'asc' ]],
                    "bRetrieve": true,
                    "bDestroy": true,
                });
                var add_url_building_volume_ratio = $("#building_volume_ratio_add > a").attr("href");
                var delete_url_building_volume_ratio = $("#building_volume_ratio_del > a").attr("href");
                oTable_building_volume_ratio.makeEditable({
                    sAddNewRowFormId:"formAddNewRow_building_volume_ratio",
                    sAddNewRowButtonId:"btnAddNewRow_building_volume_ratio",
                    sAddNewRowOkButtonId: "btnAddNewRowOk_building_volume_ratio",
                    sAddNewRowCancelButtonId: "btnAddNewRowCancel_building_volume_ratio",
                    sDeleteRowButtonId: "btnDeleteRow_building_volume_ratio",
                    sAddURL:add_url_building_volume_ratio,
                    sDeleteURL: delete_url_building_volume_ratio,
                    sAddDeleteToolbarSelector: ".add_delete_toolbar_building_volume_ratio",
                    "aoColumns": [
                        null,
                        {
                            cssclass: 'required',
                            indicator: 'Saving...',
                            tooltip: 'Click to input',
                            loadtext: 'loading...',
                            type: 'text',
                            column: 'volume',
                            sUpdateURL: "/business/imposition/database/building/update?t=building_volume_ratio"
                        },
                        {
                            cssclass: 'required, number',
                            indicator: 'Saving...',
                            tooltip: 'Click to input',
                            loadtext: 'loading...',
                            type: 'text',
                            column: 'correction_factor',
                            sUpdateURL: "/business/imposition/database/building/update?t=building_volume_ratio"
                        },
                        {
                            cssclass: 'required',
                            indicator: 'Saving...',
                            tooltip: 'Click to select',
                            loadtext: 'loading...',
                            type: 'select',
                            onblur: 'cancel',
                            submit: 'OK',
                            data: "{'residential':'住宅', 'nonresidential':'非住宅'}",
                            column: 'product_type',
                            sUpdateURL: "/business/imposition/database/building/update?t=building_volume_ratio"
                        },
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


    $("#showColumn > button").button();
    $("#showColumn > button").toggle(
        function() {
            $("#showColumn > form").show("slow");
            return false;
        },
        function() {
            $("#showColumn > form").hide();
            return false;
        }
    );
    $("#colShowHidn > input").click(function() {
        if ($(this).attr("checked") == 'checked')
            fnShowHide($(this).attr("value"));
        else
            fnShowHide($(this).attr("value"));
    });
    oTable_calculate_data = $("#calculate_data_tb").dataTable({
        "bJQueryUI": true,
        "sPaginationType": "full_numbers",
        "bPaginate": true,
        "bLengthChange": true,
        "bFilter": true,
        "bSort": true,
        "bInfo": true,
        "bAutoWidth": true,
        "sScrollX": "100%",
        "bScrollCollapse": true,
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
            {"bSortable": false, "aTargets": [ 0 ]},
            {"bSortable": false, "bVisible": false, "aTargets": [ 1 ]},
        ],
        "aaSorting": [[ 1, 'asc' ]],
        "bRetrieve": true,
        "bDestroy": true,
        "aoColumns": [
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
            {"sWidth": "100px"},
        ],
    });
});

function fnShowHide(iCol) {
    var oTable = $('#calculate_data_tb').dataTable();
    var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
    oTable.fnSetColumnVis( iCol, bVis ? false : true );
}

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
