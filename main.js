

const apiKey = 'pk.eyJ1IjoibHN0YW5maWxsIiwiYSI6ImNsaGN2MHAyczBnb3EzcHBncGJlNDViaW8ifQ.JhLl4klqWv1uthdUf7p4Rg';


const map = L.map('map').setView([41.880608, -87.631835], 9);

var littleton = L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.'),
    denver    = L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.'),
    aurora    = L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.'),
    golden    = L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.');

var cities = L.layerGroup([littleton, denver, aurora, golden]);


var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.control.scale().addTo(map);

//var geoJsonLayer = L.layerGroup();
//
//fetch("patched.geojson")
//    .then(response => response.json())
//    .then(data => {
//        var geoJsonMarkers = L.geoJSON(data, {
//            onEachFeature: function (feature, layer) {
//                var properties = feature.properties;
//                var popupContent = "<b>Address:<b>" + properties.address +
//                                   "<br><b>Number of potholes filled on block:" + properties.number_of_potholes_filled_on_block;
//                layer.bindPopup(popupContent);
//            }
//        });
//    geoJsonLayer.addLayer(geoJsonMarkers);
//
//});

//////////////////////////////////////////// CLUSTER //////////////////////////
// Create a marker cluster group
var markers = L.markerClusterGroup();

// Fetch GeoJSON data and add it to the marker cluster group
fetch("patched.geojson")
    .then(response => response.json())
    .then(data => {
        var geoJsonMarkers = L.geoJSON(data, {
            // Add each point to the marker cluster group
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng);
            },
            // Add popup content to each marker
            onEachFeature: function (feature, layer) {
                var properties = feature.properties;
                var popupContent = "<b>Address: <b>" + properties.address +
                                   "<br><b>Number of potholes filled on block: " + properties.number_of_potholes_filled_on_block;
                layer.bindPopup(popupContent);
            }
            });
            markers.addLayer(geoJsonMarkers).addTo(map);

        });

//////////////////////////////////////// CLUSTER 2 ////////////////////////////////

var unfin_markers = L.markerClusterGroup();

// Fetch GeoJSON data and add it to the marker cluster group
fetch("ignored.geojson")
    .then(response => response.json())
    .then(data => {
        var geoJsonUnfinMarkers = L.geoJSON(data, {
            // Add each point to the marker cluster group
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng);
            },
            // Add popup content to each marker
            onEachFeature: function (feature, layer) {
                var properties = feature.properties;
                var popupContent = "<b>Address: <b>" + properties.STREET_ADDRESS
                layer.bindPopup(popupContent);
            }
            });
            unfin_markers.addLayer(geoJsonUnfinMarkers);

        });

// Add the marker cluster group to the map
//markers.addTo(map);

//////////////////////////////////////////// HEATMAP ///////////////////////////////////
var geoJsonHeat = L.layerGroup();

fetch("patched.geojson")
    .then(response => response.json())
    .then(data => {
        var filteredData = data.features.filter(feature => feature.geometry !== null && feature.geometry !== undefined);
        var heatMarkers = L.heatLayer(filteredData.map(feature => feature.geometry.coordinates), { radius: 30 });
        geoJsonHeat.addLayer(heatMarkers);
        });





var base = {
    'Chicago City Potholes': osm
}
var options = {
    'Potholes Patched': markers,
    'Potholes Ignored': unfin_markers
};

L.control.layers(base, options).addTo(map);