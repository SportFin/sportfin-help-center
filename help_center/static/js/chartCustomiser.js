// Select the iframe element
var iframe = document.getElementById('analytics_customiser');

$('.customiser').change(function () {
    $('#analytics_customiser').addClass('iframe-loading');
    var data_point = $(this).attr('name').split('customiser_')[1];
    var url = $('#analytics_customiser').attr('src');
    var params = new URLSearchParams(url.split('?')[1]);
    var val =  $(this).val()
    params.set(data_point, val);
    var main_data = params.get("data")
    if (main_data == "outcomes" && data_point == "data_comparitive" && val.length > 1) {
        var comp_params = val[0]
        for (var i=1; i < val.length; i++) {
            comp_params = comp_params + '_' + val[i]
        }
        params.set(data_point, comp_params);
    }
    if (data_point == "data") {
        var main_group = 'optgroup[name="' + val + '_main"]';
        $('.customiser_data_main').addClass('hidden-hard');
        $(main_group).removeClass('hidden-hard');
        var comparitive_group = 'optgroup[name="' + val + '_comparitive"]';
        $('.customiser_data_comparitive').addClass('hidden-hard');
        $('select[name="customiser_data_comparitive"]').prop('selectedIndex', 0);
        params.delete('data_comparitive');
        $(comparitive_group).removeClass('hidden-hard');
        if (val === 'people' || val === 'activities') {
            $('optgroup[name="people_comparitive"]').removeClass('hidden-hard');
            $('optgroup[name="activities_comparitive"]').removeClass('hidden-hard');
        }
        if (val == 'outcomes') {
            $('select[name="customiser_data_comparitive"]').attr('multiple', true);
            $('#comp_multiple').removeClass('hidden');
        } else {
            $('select[name="customiser_data_comparitive"]').attr('multiple', false);
            $('#comp_multiple').addClass('hidden');
        }
        var main_group_check = $(main_group).find('option').filter(
            function () {
                return $(this).val() === $('#customiser_data_main').val();
            }
        ).length > 0;
        if (!main_group_check) {
            $(main_group).find('option:first').prop('selected', true);
            group_option_value = $(main_group).find('option:first').val()
            params.set("data_main", group_option_value);
            if (group_option_value == 'historic') {
                var category = 'datetime';
            } else {
                var category = 'category';
            }
            if (params.get("graph_type") == "map" || params.get("graph") == "map") {
                category = 'category';
            }
            params.set('category', category);
        }
    }
    if (data_point == "data_main") {
        if (val == 'historic') {
            var category = 'datetime';
        } else {
            var category = 'category';
        }
        params.set('category', category);
    }

    if (data_point == "graph_type" || data_point == "graph") {
        if (val == "map") {
            $('#ext_layer_dropdown').removeClass('hidden-hard');
        } else {
            $('#ext_layer_dropdown').addClass('hidden-hard');
        }
    }

    if (data_point == "clubs") {
        var club_pks = []
        $('input[name="customiser_clubs"]:checked').map(function() {
            club_pks.push($(this).val());
        });
        var pk_string = club_pks.join(',');
        params.set('clubs', pk_string);
    }
    
    $('#analytics_customiser').attr('src', (url.split('?')[0] + '?' + params));
})

$('#all_tracked_clubs_btn').click(function () {
    var url = $('#analytics_customiser').attr('src');
    var params = new URLSearchParams(url.split('?')[1]);
    params.delete('clubs');
    $('#analytics_customiser').attr('src', (url.split('?')[0] + '?' + params));
})

$('input[name="search_cus_clubs"]').on('keyup', function() {
    var searchText = $(this).val().toLowerCase();
    
    $('input[name="customiser_clubs"]').each(function() {
        var checkboxText = $(this).next('label').text().toLowerCase();
        var display_class = '.' + $(this).attr('id');
        
        if (checkboxText.includes(searchText)) {
            $(display_class).removeClass('hidden');
        } else {
            $(display_class).addClass('hidden');
        }
    });
});

// Create a MutationObserver to observe changes to the iframe's attributes
var observer = new MutationObserver(function(mutationsList) {
  mutationsList.forEach(function(mutation) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
        $('#analytics_customiser').removeClass('iframe-loading');      
    }
  });
});

// Start observing the iframe's attributes for changes
observer.observe(iframe, { attributes: true });