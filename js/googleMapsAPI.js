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
    mapTypeControl: false,
    zoomControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: true,
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

  /*var origin = document.getElementById("from").value;
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
 */
  //get lat lng from From to To
  var geocoder = new google.maps.Geocoder();
  var addressFrom= document.getElementById("from").value;
  var addressTo= document.getElementById("to").value;

  geocoder.geocode( { 'addressFrom': address}, function(results, status) {

  if (status == google.maps.GeocoderStatus.OK) {
    var latitudeFrom = results[0].geometry.location.latitude;
    var longitudeFrom = results[0].geometry.location.longitude;

    } 
});
  geocoder.geocode( { 'addressTo': address}, function(results, status) {

if (status == google.maps.GeocoderStatus.OK) {
    var latitudeTo = results[0].geometry.location.latitude;
    var longitudeTo= results[0].geometry.location.longitude;
    
    } 
});
const chargePalenTotal = await asyncGetChargingStations(latitudeFrom, longitudeFrom, latitudeTo, longitudeTo);
  //Marker Icon
  const image="images/marker.png";
  // Create the markers.
  Object.entries(chargePalenTotal).forEach((obj, i) => {
    
    var latlng = new google.maps.LatLng(obj[1].latitude, obj[1].longitude);
    var title = obj[1].name;
    const marker = new google.maps.Marker({
      position: latlng,
      map: map,
      icon :image,
      title: `${title}`,
      optimized: false,
    });
    // Create an info window to share between markers.
    
  const infoWindow = new google.maps.InfoWindow();
    // Add a click listener for each marker, and set up the info window.
    marker.addListener("click", () => {
      infoWindow.close();
      infoWindow.setContent(marker.getTitle());
      infoWindow.open(marker.getMap(), marker);
      calculateRouteToMarker(latlng);
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

          let travelTimeString = result.routes[0].legs[0].duration.text;
          arr = travelTimeString.split(' ');
          sessionStorage.setItem("travelTimeHour", arr[0]);
          sessionStorage.setItem("travelTimeMinute", arr[2]);

          sessionStorage.setItem("totalDistance", result.routes[0].legs[0].distance.text);

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

// show the Output 
function outPutText() {

  var output = document.createElement("div");
  output.id = "instructions";
  // From
  const From = document.createElement("p");
  var value = document.getElementById("from").value;
  From.id = "from";
  From.innerHTML ="<strong>From</strong>: " + value + "<br />";
  output.appendChild(From);
  //map.controls[google.maps.ControlPosition.LEFT_TOP].push(From);

  // To
  const To = document.createElement("p");
  value = document.getElementById("to").value;
  To.id = "to";
  To.innerHTML ="<strong>To</strong>: " + value + "<br />";
  output.appendChild(To);
  //map.controls[google.maps.ControlPosition.LEFT_TOP].push(To);

  // Model and make
  const ModelMake = document.createElement("p");
  value = document.getElementById("make").value;
  var valueB = document.getElementById("model").value;
  ModelMake.id = "modelMake";
  ModelMake.innerHTML ="<strong>Vehicle</strong>: "+ value +" "+ valueB +"<br />";
  output.appendChild(ModelMake);
  //map.controls[google.maps.ControlPosition.LEFT_TOP].push(ModelMake);

  // Range
  const Range = document.createElement("p");
  value = parseInt(calculateRange()) + " km";
  
  Range.id = "range";
  Range.innerHTML ="<strong>Range</strong>: "+ value +"<hr />";
  output.appendChild(Range);
  //map.controls[google.maps.ControlPosition.LEFT_TOP].push(Range);

  // # of charge-stops
  const AmountOfStops = document.createElement("h1");
  value = numberOfStops();
  AmountOfStops.id = "numberOfStops";
  AmountOfStops.innerHTML ="Number of Stops: <strong>"+ value +"</strong><br />";
  output.appendChild(AmountOfStops);
  //map.controls[google.maps.ControlPosition.LEFT_TOP].push(AmountOfStops);

  // Total charge time
  const ChargeTime = document.createElement("h1");
  value = calculateChargeTime();
  ChargeTime.id = "chargeTime";
  ChargeTime.innerHTML ="Charge time: <strong>"+ value +"</strong><br />";
  output.appendChild(ChargeTime);
  //map.controls[google.maps.ControlPosition.LEFT_TOP].push(ChargeTime);

  // Total charge price
  const ChargePrice = document.createElement("h1");
  value = calculateChargePrice();
  ChargePrice.id = "chargePrice";
  ChargePrice.innerHTML ="Charge price: <strong>€"+ value +"</strong><br />";
  output.appendChild(ChargePrice);
  //map.controls[google.maps.ControlPosition.LEFT_TOP].push(ChargePrice);

  // Total distance
  const TotalDistance = document.createElement("h1");
  value = sessionStorage.getItem("totalDistance");
  TotalDistance.id = "totalDistance";
  TotalDistance.innerHTML ="Distance: <strong>"+ value +"</strong><br />";
  output.appendChild(TotalDistance);
  //map.controls[google.maps.ControlPosition.LEFT_TOP].push(TotalDistance);

  // Total time
  const TotalTime = document.createElement("h1");
  value = totalTravelTime();
  TotalTime.id = "totalTime";
  TotalTime.innerHTML ="Total time: <strong>"+ value.hour + ":" + value.minute + "</strong><br />";
  output.appendChild(TotalTime);
  
  
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(output);
}


 
