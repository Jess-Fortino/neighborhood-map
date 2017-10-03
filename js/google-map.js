var map;

// Create a new blank array for all the  markers.
var markers = [];

function initMap() {
// Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 42.0114, lng: -88.0021},
      zoom: 13,
      mapTypeControl: false
    });
    $('#myalert').hide();
    ko.applyBindings(new ViewModel());
}

// Error callback for GMap API request
function mapError() {
  // Error handling
  $('#myalert').show();
};
 // This function populates the infowindow when the marker is clicked. We'll only allow one infowindow which will open at the marker that is clicked, and populate based on that markers position.
 function populateInfoWindow(marker) {
    var infowindow = new google.maps.InfoWindow();
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker !== marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div class="text-center">' + '<strong>' +marker.title + '</strong><br>' + marker.snippet +'</div>');
      infowindow.open(map, marker);
      // Add animation to the clicked marker, then stop it
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){ marker.setAnimation(null); }, 1400);
    }
      // Make sure the marker property is cleared and rge marker animation is
      // set to off when the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
}

// This function will loop through the markers array and display them all.
function showListings(queryResults) {
    var largeInfowindow = new google.maps.InfoWindow();
    //Delete previous markers from the map
    hideListings();
  // The following For loop uses the Observable venueList to create an array of markers when the list of venues is updated.
    for (var i = 0; i < queryResults.length; i++) {
    // Get the position from the location array.
        var position  = {
          lat : queryResults[i].lat,
          lng : queryResults[i].lng
        };
        var title = queryResults[i].name;
        var snippet = 'FourSquare Category:' +  queryResults[i].category;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
          position: position,
          title: title,
          snippet: snippet,
          animation: google.maps.Animation.DROP,
          id: i
        });
    // Push the marker to the array of markers.
        markers.push(marker);
    // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
          populateInfoWindow(this);
        });
    }

    var bounds = new google.maps.LatLngBounds();
// Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);

    // add DOM resize listener to adjust the markers as the screen changes.
    google.maps.event.addDomListener(window, 'resize', function() {
        map.fitBounds(bounds); // `bounds` is a `LatLngBounds` object
    });
}

// This function will loop through the listings and hide them all.
function hideListings() {
  for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
}
