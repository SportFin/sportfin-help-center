//Chart colors
var colors = [];
var no_of_colors = 2;
var iterations = 33;
function rand(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}
var hue1 = hslToHex(207, 73, 42);
colors.push(hue1);
var hue2 = hslToHex(117, 52, 44);
colors.push(hue2);
var hue3 = hslToHex(234, 50, 33);
colors.push(hue3);
for(var it=0; it<iterations;it++){
    for(var i=0; i<no_of_colors; i++){      // Create shades!
        var h = 234;
        var s = rand(10, 90);
        var l = rand(10, 70);
        var hex = hslToHex(h, s, l);
        colors.push(hex);
    }
    for(var i=0; i<no_of_colors; i++){      // Create shades!
        var h = 207;
        var s = rand(10, 90);
        var l = rand(10, 70);
        var hex = hslToHex(h, s, l);
        colors.push(hex);
    }
    for(var i=0; i<no_of_colors; i++){      // Create shades!
        var h = 117;
        var s = rand(10, 90);
        var l = rand(10, 70);
        var hex = hslToHex(h, s, l);
        colors.push(hex);
    }
}
//Create function for graphing apexcharts
//data needs to be a list of {name: '', data: []} for each series
function apexOptions(data, type, category, height, custom_total = NaN, inframe = NaN, legend = NaN, axis_labels = NaN) {
    if (legend == true) {
        var legend = true
    } else {
        var legend = false
    }
    if (axis_labels == true) {
        var axis_labels = true
    } else {
        var axis_labels = false
    }
    if(type == "treemap") {
        var data_labels = true
    } else {
        var data_labels = false
    }
    if (type == "donut") {
        var donutData = [];
        if (custom_total) {
            var donutTotal = custom_total;
        } else {
            var donutTotal = 0;
        }
        var labels = [];
        for (let a=0; a < data.length; a++) {
            for (let i=0; i < data[a].data.length; i++) {
                donutData.push(data[a].data[i].y);
                labels.push(data[a].data[i].x);
                if (!custom_total) {
                    donutTotal = donutTotal + data[a].data[i].y;
                }
            }
        }
        var options = {
            chart: {
                type: type,
                height: height,
                fontFamily: 'Poppins, Helvetica, Arial, sans-serif',
                toolbar: {
                    show: true,
                }
            },
            series: donutData,
            xaxis: {
                type: category,
                tickPlacement: 'between',
                labels: {
                    show: axis_labels,
                }
            },
            yaxis: {
                show: axis_labels 
            },
            colors: colors,
            dataLabels: {
                enabled: false,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '80%',
                        labels: {
                            show: true,
                            name: {
                                show: false
                            },
                            value: {
                                fontSize: 'calc(1.75rem + 1vw)',
                                color: '#1D71B8',
                                fontWeight: '700',
                                formatter: function (val) {
                                    return val;
                                }
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                formatter: function (w) {
                                    return [donutTotal]
                                }
                            }
                        }
                    },
                }
            },
            labels: labels,
            legend: {
                show: legend,
                position: 'bottom',
                horizontalAlign: 'center', 
            },
        }
    } else {
        var options = {
            chart: {
                type: type,
                height: height,
                fontFamily: 'Poppins, Helvetica, Arial, sans-serif',
                toolbar: {
                    show: true,
                }
            },
            series: data,
            xaxis: {
                type: category,
                tickPlacement: 'between',
                labels: {
                    show: axis_labels,
                    trim: true,
                }
            },
            yaxis: {
                show: axis_labels,
                labels: {
                    formatter: function (val, opts) {
                        var label = val;
                        var maxLabelLength = 10; // Set your max label length here
                        if (val.length > maxLabelLength) {
                          label = val.substring(0, maxLabelLength) + '...';
                        }
                        return label
                    }
                }
            },
            colors: colors,
            dataLabels: {
                enabled: data_labels,
            },
            legend: {
                show: legend,
                position: 'bottom',
                horizontalAlign: 'center', 
            },
        }
    }
    
    return options
}

function generateMap(id, token, zoom, center) {
    mapboxgl.accessToken = token;
    var map = new mapboxgl.Map({
        container: id,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: zoom
    });

    return map;
}

const data_layers = {
    'IMDDec0': 'Index of Multiple Deprivation (IMD) Decile (where 1 is most deprived 10% of LSOAs)',
    'IncDec': 'Income Decile (where 1 is most deprived 10% of LSOAs)',
    'EmpDec': 'Employment Decile (where 1 is most deprived 10% of LSOAs)',
    'EduDec': 'Education, Skills and Training Decile (where 1 is most deprived 10% of LSOAs)',
    'HDDDec': 'Health Deprivation and Disability Decile (where 1 is most deprived 10% of LSOAs)',
    'CriDec': 'Crime Decile (where 1 is most deprived 10% of LSOAs)',
    'BHSDec': 'Barriers to Housing and Services Decile (where 1 is most deprived 10% of LSOAs)',
    'EnvDec': 'Living Environment Decile (where 1 is most deprived 10% of LSOAs)',
    'IDCDec': 'Income Deprivation Affecting Children Index (IDACI) Decile (where 1 is most deprived 10% of LSOAs)',
    'IDODec': 'Income Deprivation Affecting Older People (IDAOPI) Decile (where 1 is most deprived 10% of LSOAs)',
    'CYPDec': 'Children and Young People Sub-domain Decile (where 1 is most deprived 10% of LSOAs)',
    'ASDec': 'Adult Skills Sub-domain Decile (where 1 is most deprived 10% of LSOAs)',
    'GBDec': 'Geographical Barriers Sub-domain Decile (where 1 is most deprived 10% of LSOAs)',
    'WBDec': 'Wider Barriers Sub-domain Decile (where 1 is most deprived 10% of LSOAs)',
    'IndDec': 'Indoors Sub-domain Decile (where 1 is most deprived 10% of LSOAs)',
    'OutDec': 'Outdoors Sub-domain Decile (where 1 is most deprived 10% of LSOAs)',
    'TotPop': 'Total population: mid 2015 (excluding prisoners)',
    'DepChi': 'Dependent Children aged 0-15: mid 2015 (excluding prisoners)',
    'Pop16_59': 'Population aged 16-59: mid 2015 (excluding prisoners)',
    'Pop60+': 'Older population aged 60 and over: mid 2015 (excluding prisoners)',
    'WorkPop': 'Working age population 18-59/64: for use with Employment Deprivation Domain (excluding prisoners)'
};

const fetchPostcodeData = async (postcodes, ext_layer = NaN) => {
    //Split postcodes by the 100s to fit rate limit
    const postcode_queries = []
    for (let i=0; i < postcodes.length; i += 100) {
        const chunk = postcodes.slice(i, i + 100);
        postcode_queries.push(chunk)
    }
    //Get Postcode Data
    const postcodeResponses = await Promise.all(postcode_queries.map(postcode_chunks => {
        var query_data = {
            "postcodes": postcode_chunks
        }
        const url = `https://api.postcodes.io/postcodes/`;
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(query_data)
        })
        .then(response => response.json())
    }));

    // Extract the `result` property from each valid postcode response
    const postcodeResults = []
    postcodeResponses.filter(response => response && response.status === 200)
    .filter(response => response && response.result)
    .map((response) => {
        response.result.map((result) => {
            if (result.result) {
                postcodeResults.push(result.result);
            }
        })
    });
    if (ext_layer) {
        //Get location of deprivation data
        const fetchDeprivationData = async (lsoas) => {
            const response = await fetch(`https://services3.arcgis.com/ivmBBrHfQfDnDf8Q/arcgis/rest/services/Indices_of_Multiple_Deprivation_(IMD)_2019/FeatureServer/0/query?where=lsoa11cd%20IN%20%28${lsoas}%29&outFields=lsoa11cd%2C${ext_layer}&outSR=4326&f=json`);
            const data = await response.json();
            return data.features;
        };
        //Split postcodes by the 90s to fit rate limit of service3.arcgis.com
        const deprivationPostcodeQueries = []
        for (let i=0; i < postcodeResults.length; i += 90) {
            const chunk = postcodeResults.slice(i, i + 90);
            deprivationPostcodeQueries.push(chunk)
        }
        var deprivationPromises = deprivationPostcodeQueries.map((postcodeChunk) => {
            // Extract the `admin_ward` code from each postcode result
            const lsoas = postcodeChunk.map(result => result.codes.lsoa)
            const lsoas_string = '%27' + lsoas.join('%27%2C%20%27') + '%27';

            // Fetch deprivation data for all LSOAs in parallel
            const deprivationArray = fetchDeprivationData(lsoas_string).then((res) => res);
            return deprivationArray;
        })
        const deprivationResponses = await Promise.all(deprivationPromises)
            .then((resolvedArrays) => resolvedArrays.flat());


        // Merge postcode results and deprivation data
        const results = postcodeResults.map((result) => {
            if (result.country == 'England') {
                var deprivation = deprivationResponses.find(feature => feature.attributes.lsoa11cd === result.codes.lsoa);
                return {
                    ...result,
                    deprivation: deprivation.attributes,
                    deprivation_geometry: deprivation.geometry
                };
            } else {
                return {
                    ...result,
                    deprivation: "No Data",
                    deprivation_geometry: "No Data",
                };
            }
        });
        return results;
    } else {
        return postcodeResults;
    }
};

function addLayers(map, postcodes, ext_layer = NaN) {
    fetchPostcodeData(postcodes, ext_layer = ext_layer).then(locations => {
        // Define a GeoJSON FeatureCollection from the fetched locations
        const features = locations.map((location) => {
            if (location && location.lsoa) {
                if (ext_layer) {
                    var description = '<table class="table_borders"><tr><th>Local Area name</th><th>' + data_layers[ext_layer] + '</th></tr><tr><td>' + location.lsoa + '</td><td>' + location.deprivation[ext_layer] + '</td></tr>'
                } else {
                    var description = '<table class="table_borders"><tr><th>Local Area name</th></tr><tr><td>' + location.lsoa + '</td></tr>'
                }
                var feature = {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [location.longitude, location.latitude]
                    },
                    properties: {
                        postcode: '<strong>' + location.postcode + '</strong>',
                        description: description
                    }
                }
                return feature
            }
        });
        //Add location source
        map.addSource('locations', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: features
            }
        });
        if (!ext_layer) {
            //Add heatmap layer
            map.addLayer(
                {
                    'id': 'locations-heat',
                    'type': 'heatmap',
                    'source': 'locations',
                    'maxzoom': 10,
                    'paint': {
                        'heatmap-weight': [
                            'interpolate',
                            ['linear'],
                            ['get', 'mag'],
                            0,
                            0,
                            6,
                            1
                        ],
                        'heatmap-intensity': 3.5,
                        'heatmap-color': [
                            'interpolate',
                            ['linear'],
                            ['heatmap-density'],
                            0,
                            'rgba(33,102,172,0)',
                            0.2,
                            'rgb(103,169,207)',
                            0.4,
                            'rgb(209,229,240)',
                            0.6,
                            '#2a327d',
                            0.8,
                            '#1d71b8',
                            1,
                            '#3aaa35'
                        ],                    
                        'heatmap-radius': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            0,
                            2,
                            9,
                            24
                        ],
                        'heatmap-opacity': [
                            'interpolate',
                            ['linear'],
                            ['heatmap-density'],
                            8,
                            1,
                            15,
                            0
                        ]
                    },
                },
                'waterway-label'
            );
        } else {
            //Define LOD geometry
            const lod_geometry = locations.map(location => ({
                type: 'Feature',
                geometry: {
                    'type': 'Polygon',
                    'coordinates': location.deprivation_geometry.rings
                },
                properties: {
                    shadeId: location.deprivation[ext_layer]
                }
            }))
            //Add LOD source
            map.addSource('lods', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: lod_geometry
                }
            })
            // Calculate the minimum and maximum shadeIds
            const minShadeId = Math.min(...lod_geometry.map(location => location.properties.shadeId));
            const maxShadeId = Math.max(...lod_geometry.map(location => location.properties.shadeId));
            //Add LOD Layer 
            map.addLayer({
                'id': 'lod-layer',
                'type': 'fill',
                'source': 'lods',
                'paint': {
                    //interpolate by min and max value
                    'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'shadeId'],
                        minShadeId, '#ff0000',
                        maxShadeId, '#1d71b8',
                    ],
                    'fill-opacity': 0.7
                }
            });
            //Add postcode circle over polygon
            var layer = {
                id: 'circles',
                type: 'circle',
                source: 'locations',
                paint: {
                    'circle-color': 'rgba(58, 170, 53, 0.5)',
                    'circle-radius': 10,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff'
                }
            }
            if (!ext_layer) {
                layer.minzoom = 10
            }
            map.addLayer(layer);
        }
    });

    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });
    
    map.on('mouseenter', 'circles', (e) => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
        
        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;
        
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        
        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML(description).addTo(map);
    });
    
    map.on('mouseleave', 'circles', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
}