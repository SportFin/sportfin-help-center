// JavaScript source code


var current_url = window.location.href;
$('#club_card').click(function () {
    $('#choice').hide();
    $('#club_div').show();
    $('#steps').removeClass('hidden');
    $('.imp_text').text('club members/participants');
})


$('.imp_back').click(function () {
    $('#choice').show();
    $('#upload_csv').hide();
    $('#check_ins_div').hide();
    $('#steps').addClass('hidden');
    $('.imp_text').text('data');
    window.history.pushState({}, '', '/club_management/1/import-people')
})

$('#demo_club').submit(function (e) {
    e.preventDefault()
    var url = $(this).attr('action');
    var data = $(this).serialize();
    setTimeout(function () {
        $('#load_spin_text').text('Please be paitent, this might take a few minutes...')
    }, 4000)
    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        success: function (res) {
            if (res.success) {
                swal('Success', res.success, 'success')
                    .then((value) => {
                        window.opener.history.pushState({}, '', res.success_url);
                        window.opener.location.reload();
                        window.close();
                    });
            } else if (res.error) {
                swal('Error', res.error, 'error');
            }
        },
        error: function (res) {
            swal('Error', 'Server Error', 'error');
        }
    })
})
