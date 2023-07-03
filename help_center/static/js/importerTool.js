// JavaScript source code
$('#send_mass_email').click(function () {
    $('#emailModal').modal('show');
})
$('#import_pop').click(function () {
    $('#importModal').modal('show');
})
$('#export_people').click(function () {
    $('#exportPeopleModal').modal('show');
})

$('#export_activities').click(function () {
    $('#ExportActivityModal').modal('show');
})
$('.importer').click(function (e) {
    e.preventDefault();
    var width = $(window).width() * 0.9;
    var height = $(window).height() * 0.9;
    var left = (screen.width - width) / 2
    var dimensions = `width=` + width + `,height=` + height + `,left=` + left;
    window.open($(this).attr("href"), "SportFin Importer Tool", dimensions);
})

var current_url = window.location.href;
if (current_url.includes('imp_ppl')) {
    $('#choice').hide();
    $('#upload_csv').show();
    $('#steps').removeClass('hidden');
    $('.imp_text').text('club members/participants');
}
$('#imp_ppl').click(function () {
    $('#choice').hide();
    $('#upload_csv').show();
    $('#steps').removeClass('hidden');
    $('.imp_text').text('club members/participants');
})
if (current_url.includes('imp_check_ins')) {
    $('#choice').hide();
    $('#check_ins_div').show();
    $('#steps').removeClass('hidden');
    $('#s1_text').text('Select People');
    $('#s2_text').text('Select Activities');
    $('#s2_text').text('Add Check-ins');
    $('.imp_text').text('check-ins');
}
$('#imp_check_ins').click(function () {
    $('#choice').hide();
    $('#check_ins_div').show();
    $('#steps').removeClass('hidden');
    $('#s1_text').text('Select People');
    $('#s2_text').text('Select Activities');
    $('#s2_text').text('Add Check-ins');
    $('.imp_text').text('check-ins');
})

$('.imp_back').click(function () {
    $('#choice').show();
    $('#upload_csv').hide();
    $('#check_ins_div').hide();
    $('#steps').addClass('hidden');
    $('.imp_text').text('data');
    window.history.pushState({}, '', '/club_management/1/import-people')
})

$('#file').change(function () {
    if (!$(this)[0].files[0]) {
        $('#importText').show();
        $('#uploadText').hide();
        $('#csv_input').css('border', 'dashed 1px #1d71b8');
    } else {
        var file_name = $(this)[0].files[0].name;
        if (!file_name.includes('.csv')) {
            $('#csv_input').addClass('border-danger');
            $('#upload_btn').prop('disabled', true);
            $('#file_error').removeClass('hidden-hard');
            $('#uploadText').addClass('text-danger');
            $('#uploadText').removeClass('color-primary');
        } else {
            $('#csv_input').removeClass('border-danger');
            $('#upload_btn').prop('disabled', false);
            $('#file_error').addClass('hidden-hard')
            $('#uploadText').removeClass('text-danger');
            $('#uploadText').addClass('color-primary');
        }
        $('#importText').hide();
        var uploadText = `<i class="fas fa-table mr-2"></i>` + file_name;
        $('#uploadText').show();
        $('#uploadText').html(uploadText);
        $('#uploadText').removeClass('color-secondary');
        $('#csv_input').css('border', 'dashed 1px #3aaa35');
    }
})

var vals_disabled = [];

var postcode_selected = false;
var first_selected = false;
var last_selected = false;
var dob_selected = false;

$('.attr').each(function () {
    var val = $(this).val();
    var name = $(this).attr('name');
    var selector = 'option[class="' + val + '"]';
    $('.attr').each(function () {
        if ($(this).attr('name') != name) {
            var option = $(this).find(selector)
            option.attr('disabled', 'true');
        }
    })
    
    if (val == "Postcode") {
        postcode_selected = true;
    } else if (val == "First Name") {
        first_selected = true;
    } else if (val == "Last Name") {
        last_selected = true;
    } else if (val == "Date of Birth") {
        dob_selected = true;
    }
})

if (postcode_selected && dob_selected && first_selected && last_selected) {
    $('.tip_text').text(`Click 'Import Data' to continue.`);
    $('#head_text').text(`Import`)
    $('#s2').removeClass('p_active');
    $('#s3').addClass('p_active');
    $('#import_data_btn').removeAttr('disabled');
}

$('.col_match').each(function () {
    var column = $(this).find('select').val();
    var element = $(this).find('.col_items');
    element.attr('data-sportfin-column', column);
})

$('.attr').change(function () {
    $(this).addClass('color-primary');
    var val = $(this).val();
    var name = $(this).attr('name');
    var selector = 'option[class="' + val + '"]';
    var email_selected = false;
    var first_selected = false;
    var last_selected = false;
    var dob_selected = false;
    vals_disabled.push(val);

    var column = $(this).parent().find('.col_items');
    column.attr("data-sportfin-column", val);

    $('.attr').each(function () {            
        if ($(this).attr('name') != name) {
            var option = $(this).find(selector)
            option.attr('disabled', 'true');
        }

        if ($(this).val() == "Email") {
            email_selected = true;
        } else if ($(this).val() == "First Name") {
            first_selected = true;
        } else if ($(this).val() == "Last Name") {
            last_selected = true;
        } else if ($(this).val() == "Date of Birth") {
            dob_selected = true;
        }
    })

    $.each(vals_disabled, function (index, value) {
        var exists = false;
        $('.attr').each(function () {
            if (value == $(this).val()) {
                exists = true;                
            }
        })
        if (!exists) {
            var attribute = 'option[class="' + value + '"]';
            $(attribute).removeAttr('disabled');
            vals_disabled.splice(index, 1);
        }        
    })

    if (email_selected && dob_selected && first_selected && last_selected) {
        $('.tip_text').text(`Click 'Import Data' to continue.`);
        $('#head_text').text(`Import`)
        $('#s2').removeClass('p_active');
        $('#s3').addClass('p_active');
        $('#import_data_btn').removeAttr('disabled');
    }
})

$('#fix_cell').submit(function (e) {
    e.preventDefault();
    var data = $(this).serialize();
    $('.spinner').addClass('hidden');
    $('#fixer_btn').prop('disabled', true);
    $('#fix_spinner').removeClass('hidden');
    $('#fixer_btn').text('Fixing...');
    $('#load_spin_text').text('Checking and importing your data...');
    $.ajax({
        url: $(this).attr('action'),
        type: 'POST',
        data: data,
        success: function (res) {
            $('#fix_error').hide();
            var column = 'div[data-sportfin-column="' + res.column + '"]'
            var span = $(column);
            span.html('');
            var items_html = "";
            for (var i = 0; i < 4; i++) {
                items_html += res.items[i] + `<hr style="background-color: #1d71b850" />`;
            }
            span.html(items_html);
            $('.attr').each(function () {
                var el = $(this)
                var val = el.val();
                if (val) {
                    el.attr('name', val);
                }
            })
            $('#markAttr').submit();
            // $('#errorModal').modal('hide');
        },
        error: function (res) {
            var error = 'Server error: ' + res.error;
            $('#fix_error').text(error);
            $('#fix_error').show();
            $('#fixer_btn').prop('disabled', false);
            $('#fix_spinner').removeClass('hidden');
            $('#fixer_btn').text('Fix data');
        }
    })
})

$('#cell').change(function () {
    $('#fixer_btn').prop('disabled', false);
    $(this).removeClass('text-danger');
})

$('#cell_select').change(function () {
    $('#fixer_btn').prop('disabled', false);
    $(this).removeClass('border-danger');
})

$('#continue').click(function () {
    $('#load_spin_text').text('Checking and importing your data...');
    $('#markAttr').submit();
})

$('#markAttr').submit(function (e) {
    e.preventDefault();
    var data = $(this).serialize();
    var url = $(this).attr('action')
    $('#import_data_btn').prop('disabled', true);
    $('#import_spinner').removeClass('hidden');
    $('.spinner').removeClass('hidden');
    setTimeout(function () {
        $('#load_spin_text').text('Please be paitent, this might take a few minutes for larger amounts of data...')
    }, 4000)
    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        success: function (res) {
            if (res.success) {
                setTimeout(function () {
                    $('#load_spin_text').text('Please be paitent this may take a while for larger data...')
                }, 4000);
                swal('Success!', 'Added successfully', 'success')
                    .then((value) => {
                        var url = window.opener.location.href.split('?')[0] + "?ppl=true#members";
                        window.opener.history.pushState({}, '', url);
                        window.opener.location.reload();
                        window.close();
                    });
            } else if (res.error) {
                $('#cell').addClass('text-danger');
                var title = 'Fix ' + res.error + ' Error.';
                $('#fixModalTitle').html(title);
                $('#error_body').html(res.error_text);
                $('#error_h2').removeClass('hidden');
                $('fix_dismiss').addClass('hidden');
                $('#continue').addClass('hidden');
                $('#fixer_btn').removeClass('hidden');
                if (res.noFix) {
                    $('#fixModalTitle').html(res.error);
                    $('#fixer_div').addClass('hidden');
                    $('#fixer_footer').addClass('hidden');
                    $('#error_h2').addClass('hidden');
                    $('fix_dismiss').removeClass('hidden');
                    if (res.continue) {
                        $('#continue').removeClass('hidden');
                        $('#fixer_btn').addClass('hidden');
                        $('#fixer_footer').removeClass('hidden');
                    }
                } else if (res.select) {
                    $('#fixer_btn').prop('disabled', false);
                    $('#fix_spinner').removeClass('hidden');
                    $('#fixer_btn').text('Fix data');
                    $('#fixer_div').removeClass('hidden');
                    $('#fixer_footer').removeClass('hidden');
                    $('#cell').addClass('hidden');
                    var options = '<option disabled selected class="text-danger">' + res.cell + '</option>'
                    for (var i = 0; i < res.select.length; i++) {
                        options += '<option>' + res.select[i] + '</option>';
                    }
                    $('#cell_select').html(options);
                    $('#cell_select').removeClass('hidden');
                } else {
                    $('#fixer_btn').prop('disabled', false);
                    $('#fix_spinner').removeClass('hidden');
                    $('#fixer_btn').text('Fix data');
                    $('#fixer_div').removeClass('hidden');
                    $('#fixer_footer').removeClass('hidden');
                    $('#cell_select').addClass('hidden');
                    $('#cell').val(res.cell);
                    $('#cell').removeClass('hidden');
                }
                $('#col_name').text(res.error);
                $('#col_input').val(res.error);
                $('#row_no').text(res.row);
                $('#row_input').val(res.row);
                $('#errorModal').modal('show');
                setTimeout(function () { $('#cell').focus(); }, 500);
                $('#import_data_btn').prop('disabled', false);
                $('#import_spinner').addClass('hidden');
                $('.spinner').addClass('hidden');
            }
        },
        error: function (res) {
            swal('Error', 'Server error', 'error');
            $('#import_data_btn').prop('disabled', false);
            $('#import_spinner').addClass('hidden');
            $('.spinner').addClass('hidden');
        }
    })
})

$('#mul_check_ins').submit(function (e) {
    e.preventDefault()
    var url = $(this).attr('action');
    var data = $(this).serialize();
    $('#check_in_spinner').removeClass('hidden');
    $('#add_check_ins').prop('disabled', true);
    $('#load_spin_text').text('Adding your check ins...');
    $('.spinner').removeClass('hidden');
    setTimeout(function () {
        $('#load_spin_text').text('Please be paitent, this might take a few minutes for larger amounts of data...')
    }, 4000)
    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        success: function (res) {
            if (res.success) {
                $('#check_in_spinner').addClass('hidden');
                $('#add_check_ins').prop('disabled', false);
                $('.spinner').addClass('hidden')
                swal('Success', res.success, 'success')
                    .then((value) => {
                        window.opener.history.pushState({}, '', res.success_url);
                        window.opener.location.reload();
                        window.close();
                    });
            } else if (res.error) {
                $('#check_in_spinner').addClass('hidden');
                $('#add_check_ins').prop('disabled', false);
                $('.spinner').addClass('hidden');
                swal('Error', res.error, 'error');
            }
        },
        error: function (res) {
            $('#check_in_spinner').hide();
            $('#add_check_ins').prop('disabled', false);
            $('.spinner').addClass('hidden');
            swal('Error', 'Server Error', 'error');
        }
    })
})
