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

          //Get distance and time
          const output = document.querySelector('#googleMapOutput');
          output.innerHTML = "<div class='alert-info'>From: " + document.getElementById("from").value + ".<br />To: " + document.getElementById("to").value + ".<br /> Driving distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + result.routes[0].legs[0].duration.text + ".</div>";
          var dis = result.routes[0].legs[0].distance.text ;
          var x = dis.substring(0, dis.length - 3);
          var a = parseInt(x);
         //display route
          directionsDisplay.setDirections(result);
          console.log(a);
          return a;
      } else {
          //delete route from map
          directionsDisplay.setDirections({ routes: [] });
          //center map in London
          map.setCenter(myLatLng);

          //show error message
          output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
      }
      
  });

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
function totalDistance() {
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

          var dis = result.routes[0].legs[0].distance.text ;
          var x = dis.substring(0, dis.length - 3);
          var a = parseInt(x);
         //display route
          directionsDisplay.setDirections(result);
          console.log(a);
          return a;
      } 
      
  });

}
