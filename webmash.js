// Put your zillow.com API key here

var username = "akaadi3";
var request = new XMLHttpRequest();


//initMap() which initiates map to a location
function initMap() {

  //initialize map

  //Initialize a mouse click event on map which then calls reversegeocode function
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: {
      lat: 32.75,
      lng: -97.13
    }
  });
  var geocoder = new google.maps.Geocoder;
  var infowindow = new google.maps.InfoWindow;
  var marker = new google.maps.Marker({
    map: map
  });

  google.maps.event.addListener(map, 'click', function (event) {
    marker.setPosition(event.latLng);
    reversegeocode(geocoder, map, infowindow, marker, event.latLng);
  });

  marker.addListener('click', function () {
    infowindow.open(map, marker);
  });

  //     google.maps.event.addListener(map, 'click', function(event) {

  //     marker = new google.maps.Marker({position: event.latLng, map: map});

  // });
}

function initialize() {
  initMap();
}


// Reserse Geocoding 
function reversegeocode(geocoder, map, infowindow, marker, latLng) {

  //get the latitude and longitude from the mouse click and get the address.
  //call geoname api asynchronously with latitude and longitude 
  geocoder.geocode({
    'location': latLng
  }, function (results, status) {
    if (status === 'OK') {
      if (results[0]) {
        var address = results[0].formatted_address;
        sendRequest(address, map, marker, infowindow, latLng);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });

} // end of geocodeLatLng()



function displayResult(address, map, marker, infowindow, latLng) {
  if (request.readyState == 4) {
    xml = request.responseXML.documentElement;
    var temperature = xml.getElementsByTagName("temperature")[0].childNodes[0].nodeValue;
    var windspeed = xml.getElementsByTagName("windSpeed")[0].childNodes[0].nodeValue;
    var clouds = xml.getElementsByTagName("clouds")[0].childNodes[0].nodeValue;
    var infoData = "<strong>Address:</strong> " + address +
      "<br><strong>Temprature:</strong> " + temperature +
      "<br><strong>Wind Speed:</strong> " + windspeed +
      "<br><strong>Clouds:</strong> " + clouds;
    infowindow.setContent(infoData);
    infowindow.open(map, marker);
    addOutputText(infoData);
  }

}

function sendRequest(address, map, marker, infowindow, latLng) {
  request.onreadystatechange = function () {
    displayResult(address, map, marker, infowindow, latLng);
  };
  var lat = latLng.lat();
  var lng = latLng.lng();
  request.open("GET", "http://api.geonames.org/findNearByWeatherXML?lat=" + lat + "&lng=" + lng + "&username=" + username);
  request.send(null);
}

function clearOutput() {
  document.getElementById("output").innerHTML = "";
}

function addOutputText(data) {
  document.getElementById("output").innerHTML += "<li>" + data + "</li>";
}