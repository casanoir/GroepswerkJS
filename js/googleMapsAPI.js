// Autocomplete
$(document).ready(function () {
  var autocomplete;
  autocomplete = new google.maps.places.Autocomplete((document.getElementById("from")), {
    types: ['geocode']
  });
  autocomplete = new google.maps.places.Autocomplete((document.getElementById("to")), {
    types: ['geocode']
  });
  google.maps.event.addListener(autocomplete, 'place_changed', function () {
  var near_place = autocomplete.getPlace();
  });
})
// Function for the map
  // set map options
  var myLatLng = { lat: 50.85045, lng: 4.34878 };
  
    var mapProp= {
      center:myLatLng,
      zoom:12,
      mapTypeId: 'roadmap'
    };
  // create Map
    var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
  // create a Directions service obj to use the route method and get result for our request
    var directionsService = new google.maps.DirectionsService();
  // create a DirectionsRenderer obj which we will use to display 
    var directionsDisplay = new google.maps.DirectionsRenderer();
  //blind the directionsRenderer to the map
    directionsDisplay.setMap(map);
// Set Markers : LatLng and title text for charhge palen.

async function placeMarkers() {

  var origin = document.getElementById("from").value;
  var destination = document.getElementById("to").value;
  var coder = new google.maps.Geocoder();
  coder.geocode( {address:origin}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) 
      {
        return results[0].geometry.location;
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
     }
    });
   
  const chargePalenTotal = await asyncGetChargingStations(51.23074, 5.31349, 48.864716, 2.349014);
  console.log(chargePalenTotal);
  // Create an info window to share between markers.
  const infoWindow = new google.maps.InfoWindow();
  const image="images/marker.png";
  // Create the markers.
  Object.entries(chargePalenTotal).forEach((obj, i) => {
    
    var latlng = new google.maps.LatLng(obj[1].latitude, obj[1].longitude);
    var title = obj[1].name;
    const marker = new google.maps.Marker({
      position: latlng,
      map: map,
      icon :image,
      title: `${i + 1}. ${title}`,
      label: `${i + 1}`,
      optimized: false,
    });
    // Add a click listener for each marker, and set up the info window.
    marker.addListener("click", () => {
      infoWindow.close();
      infoWindow.setContent(marker.getTitle());
      infoWindow.open(marker.getMap(), marker);
      
    });
  });
}

//define calculate Route function
function calculateRoute() {
  //create request
  var request = {
      origin: document.getElementById("from").value,
      destination: document.getElementById("to").value,
      travelMode:  google.maps.DirectionsTravelMode.DRIVING, //WALKING, BYCYCLING, TRANSIT
      unitSystem: google.maps.UnitSystem.METRIC
  }

  //pass the request to the route method
 
  directionsService.route(request, function (result, status) {
      if (status == google.maps.DirectionsStatus.OK) {

          /*Get distance and time
          const output = document.querySelector('#googleMapOutput');
          output.innerHTML = "<div class='alert-info'>From: " + document.getElementById("from").value + ".<br />To: " + document.getElementById("to").value + ".<br /> Driving distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + result.routes[0].legs[0].duration.text + ".</div>";
         
         */
         //display route
          directionsDisplay.setDirections(result);
      } else {
          //delete route from map
          directionsDisplay.setDirections({ routes: [] });
          //center map in London
          map.setCenter(myLatLng);

          //show error message
          output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
      }
      
  });
  placeMarkers();
  outPutText();
}

// Hide for container for Form
function mainHide() {
  var x = document.getElementById("main");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}    
// Show for container for googleMap
function googleMapShow() {
  var x = document.getElementById("containerForGoogleMap");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}    

//
function outPutText() {
  const instructionsElement = document.createElement("p");
  instructionsElement.id = "instructions";
  instructionsElement.innerHTML ="<strong>From</strong>: "+ document.getElementById("from").value+".<br /><strong>From</strong>: "+ document.getElementById("to").value+".<br />";
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(instructionsElement);
}


 