//Maps API
var map;
var markers = [];
var placeMarkers = [];
var infowindow;

function initMap () {
  var pittsburgh = {lat: 40.4406, lng: -79.9959}

  map = new google.maps.Map(document.getElementById('map'), {
    center: pittsburgh,
    zoom: 13,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.RIGHT_TOP
    }
  });
  var largeInfoWindow = new google.maps.InfoWindow();
  infowindow = new google.maps.InfoWindow();

  for (var i = 0; i < places.length; i++) {
    var position = places[i].location;
    var title = places[i].title;

    var marker = new google.maps.Marker({
      position: position,
      title: title,
      map: map,
      animation: google.maps.Animation.DROP,
      id: i
    })

    markers.push(marker);

    marker.addListener('mouseover', function() {
      populateInfoWindow(this, largeInfoWindow);
    });

    marker.addListener('click', function() {
      this.setAnimation(google.maps.Animation.BOUNCE);
    })
    marker.addListener('mouseout', function() {
      this.setAnimation(null);
    })
  }

  function populateInfoWindow (marker, infowindow){
    if (infowindow.marker != marker){
      infowindow.setContent('');
      infowindow.marker = marker;
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });

      var streetViewService = new google.maps.StreetViewService();
      var radius = 50;
      function getStreetView(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
          infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 30
            }
          };
          var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
        } else {
          infowindow.setContent('<div>' + marker.title + '</div>' + '<div>No Street View Found</div>')
        }
      }
      streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
      infowindow.open(map, marker);
    }
  }

  document.getElementById('show-suggestions').addEventListener('click', showSuggestions);
  document.getElementById('hide-suggestions').addEventListener('click', function() {
    hideSuggestions(markers);
  });
} //end initMap

  //show the markers with a press of a button
  function showSuggestions() {
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
      bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
  }
  function hideSuggestions(markers) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null)
    }
  }

//Places API



  var places = [
      {
        title: 'Meat and Potatoes',
        location: {
          lat: 40.4431503,
          lng: -80.0011895
        }
      }, {
        title: 'Smoke',
        location: {
          lat: 40.4699387,
          lng: -79.9610646
        }
      }, {
        title: 'Dobra Tea House',
        location: {
          lat: 40.4349609,
          lng: -79.92263659999999
        }
      }, {
        title: 'Huszar',
        location: {
          lat: 40.4568067,
          lng: -79.99891529999999
        }
      }, {
        title: 'Cafe 33',
        location: {
          lat: 40.437668,
          lng: -79.91909199999999
        }
      }, {
        title: 'Butcher and the Rye',
        location: {
          lat: 40.4423743,
          lng: -80.0021089
        }
      }, {
        title: 'All India',
        location: {
          lat: 40.45220870000001,
          lng: -79.95263349999999
        }
      }
  ];
//Knockout
var Place = function(data) {
  this.title = ko.observable(data.title);
  this.location = ko.observable(data.location);
}

var ViewModel = function() {
  var self = this;
  this.placesList = ko.observableArray([]);
  places.forEach(function(placeItem){
    self.placesList.push( new Place(placeItem))
  });

this.currentPlace = ko.observable(this.placesList()[0]);

this.setPlace = function(clickedPlace) {
  self.currentPlace(clickedPlace);
};


}

ko.applyBindings(new ViewModel())

//jquery-- making things pretty




//in Knockout-- $root.something allows you to look outside of the current function that you are working in. E.g. if you are working in the view model and need to reference back to a function that is in the model, you owuld simply write $root.outsideFunction()

// var map;
// var markerObjects = [];
//
// function initialize() {
// //just map initialization with options in a separate object
//     // var myOptions = {
//     //   center: new google.maps.LatLng(markers[0].lat, markers[0].lng),
//     //   zoom: 7,
//     //   mapTypeId: google.maps.MapTypeId.ROADMAP,
//     //
//     //   disableDefaultUI: true
//     // };
//     //
//     // map = new google.maps.Map(document.getElementById("map"), myOptions);
//
//   	// drop markers one by one
//     var i = 0;
//     var interval = setInterval(function() {
//       var data = markers[i];
//       var myLatlng = new google.maps.LatLng(data.lat, data.lng);
//
//       // initial icon
//       var defaultMarkerColor = 'ff0000';
//       var pinImage = new google.maps.MarkerImage("https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + defaultMarkerColor);
//
//       // // marker object for the marker
//       // var marker = new google.maps.Marker({
//       //   position: myLatlng,
//       //   map: map,
//       //   title: data.title,
//       //   animation: google.maps.Animation.DROP,
//       //   // icon: pinImage
//       // });
//
//       // store in a global array
//       var markerIndex = markerObjects.push(marker) - 1;
//
//       // click listener on a marker itself
//       // google.maps.event.addListener(markerObjects[markerIndex], 'click', function() {
//       //   if (this.getAnimation() != null) {
//       //     this.setAnimation(null);
//       //   } else {
//       //     this.setAnimation(google.maps.Animation.BOUNCE);
//       //   }
//       // });
//
//       // create a row in the overlay table and bind onhover
//       var $row = $('<div>')
//         .addClass('list-group-item')
//         .html(data.title)
//         .on('mouseenter', function() {
//           var marker = markerObjects[markerIndex];
//           marker.setAnimation(google.maps.Animation.BOUNCE);
//         })
//         .on('mouseleave', function() {
//           var marker = markerObjects[markerIndex];
//           if (marker.getAnimation() != null) {
//             marker.setAnimation(null);
//           }
//         });
//
//       // create colorpicker and append to row
//       $cp_div = $('<a href="#" class="btn small pull-right colpick">#' + defaultMarkerColor + '</a>');
//       $cp_div.colorpicker().on('changeColor', function(ev) {
//         var color = ev.color.toHex();
//
//         $(this).text(color);
//
//         if (color.substring(0, 1) == '#') {
//           color = color.substring(1);
//         }
//         var marker = markerObjects[markerIndex];
//         marker.setIcon("https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + color);
//
//         console.log('changed color to ' + color);
//
//       });
//       $cp_div.appendTo($row);
//
//       $row.appendTo('#overlay');
//
//       // continue iteration
//       i++;
//       if (i == markers.length) {
//         clearInterval(interval);
//       }
//     }, 200);
//
//   } // initialize
//
// google.maps.event.addDomListener(window, 'load', initialize);
