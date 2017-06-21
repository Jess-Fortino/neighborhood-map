var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.3613689, lng: -79.9958864},
    zoom: 8
  });
}
