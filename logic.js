// Store our API endpoint inside queryurl

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//Perform a GET request to the query URL
d3.json(queryUrl).then(function(data){
    //Once we get a response, send the data.features object to the createFeatures funtion
    createFeatures(data.features);
});

function createFeatures(earthquakeData){
    //Define a function we want to run once for eadh feature in the features array
    //Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer){
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>"+ new Date(feature.properties.time)+"</p>")
    }

// Define function to create the circle radius based on the magnitude
function radiusSize(magnitude) {
    return magnitude * 20000;
}

// Define function to set the circle color based on the magnitude
function c_color(magnitude) {
if (magnitude <= 1) {
    return "#26d701"
}
else if (magnitude <= 2) {
    return "#b7ffbf"
}
else if (magnitude <= 3) {
    return "#f5e640"
}
else if (magnitude <= 4) {
    return "#ff7626"
}
else if (magnitude <= 5) {
    return "#f04d24" 
}
else {
    return "#d62020"
}
};
    //Create a GeoJson layer containing the features array on the earthquakeData object
    //Run the onEachFeature function once for each piece of data in the array

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature :onEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.circle(latlng, {
				radius: radiusSize(feature.properties.mag),
				color: c_color(feature.properties.mag),
				fillOpacity: 1
			});
          }
    });

    //Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes){
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
  });

    //Define a baseMaos object to hold our base layers
    var baseMaps = {
        "Street Map" : streetmap
    };

    //Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    //Create our map, giving it the street map and earthquakes layer to display on load
    var myMap = L.map("map",{
        center:[
            37.09, -100.71
        ],
        zoom:5,
        layers:[streetmap,earthquakes]
    });
    function getColor(d) {
        if (d === "0-1")
        return "#26d701";
        else if (d === "1-2")
        return "#b7ffbf";
        else if (d === "2-3")
        return "#f5e640";
        else if (d === "3-4")
        return "#ff7626";
        else if (d === "4-5")
        return "#f04d24";
        else 
        return "#d62020";
    }
    // Add legend to the map
	var legend = L.control({position: "bottomright"});
	
	legend.onAdd = function (map) {
	
		var legenddiv = L.DomUtil.create("div", "info legend"),
		
		checkins = ["0-1","1-2","2-3","3-4","4-5","5+"],
        labels = [];
		// var colors = ["#26D701", "#b7ffbf", "#f5e640", "#ff7626", "#f04d24", "#d62020"];
	
		// loop through our density intervals and generate a label with a colored square for each interval
		for (var i = 0; i < checkins.length; i++) {
			labels.push( 
                '<i class="square" style="background:' + getColor(checkins[i]) + '"></i>'+ checkins[i] + '')
        }
        legenddiv.innerHTML = labels.join('<br>');
		return legenddiv;
	};
    
   
    
    legend.addTo(myMap);

}