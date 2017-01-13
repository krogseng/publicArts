
(function(module) {
  var findMap = {};
  var pinCoords = []



/*
a rout triggers a function call>
the call returns a filtered array of installation objs,
the array of installations we wish to pin is passed into setPinCoords
setPinCoords creates an array representing a coord pair for each obj in the array it is passed, these pairs are returned within their own array (return a2D array or coord paris that correlates to the array of objs passed in)
setPinCoords is passed into place_all_Pins, which creates and places pins at each the coord pairs
*/


findMap.setPinCoords =  function (filteredArray){
  console.log('filteredArray', filteredArray);
  var pinCoords = filteredArray.map(findMap.getLatLng);
  return pinCoords;
}


var allPins = [];
 findMap.place_all_Pins =  function(locationData){ //takes a 2d array of coords
    var opts = {};
    if (allPins.length) {
      allPins.forEach(function(pin) {
        pin.setMap(null);
      })
    }
    locationData.forEach(function(coordPair){
      opts = {}; //clear out opts obj
      opts.position = new google.maps.LatLng(coordPair[0], coordPair[1]); //grabs coordinants from each object and sets the config for each pin
      var marker = new google.maps.Marker(opts); // creats a new pin at coord currently in opt.position
       // adds each marker obj to an array for access
      marker.setMap(installationMap); // places new pin on map
      allPins.push(marker); // add to array for possible later use
    });
    return allPins; // returns array of objs, each obj is a representation of a pin now on the map
  }

findMap.getLocation = function() {
  var here;
    if (navigator.geolocation) {
      here = navigator.geolocation.getCurrentPosition(findMap.initMap);
    } else {
      console.log( "Geolocation is not supported by this browser.");
      here = 'error';
    }
    return here;
}

findMap.installationsToCoords = function(arrayOFPLaces){
var coordsArray = arrayOFPLaces.map(findMap.getLatLng);
  return coordsArray;
}

findMap.getLatLng = function(place){
  var coordinatPair= [place.lat, place.lng];
  return coordinatPair;
}


findMap.initMap = function(position) { //creates map
  var lat ;
  var lng ;
  lat = position.coords.latitude;
  lng = position.coords.longitude;
  var mapOptions = {
    zoom: 10,
    center: {lat , lng},//new google.maps.LatLng(lat,lng),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };
  var map = window.installationMap = new google.maps.Map(document.getElementById('findMap'), mapOptions);
  findMap.add_autoComplete(map);

  console.log('in initmap', map);

  pinCoords = findMap.setPinCoords(Installation.all);
  findMap.place_all_Pins(pinCoords, map);
};

findMap.clearMap = function() {

}
/* SOURCED from google tutorial@: http://gmap-tutorial-101.appspot.com/mapsapi101/toc*/
findMap.add_autoComplete = function (map){
  var map= map;
  var acOptions = {
    types: ['address']
  };
  var autocomplete = new google.maps.places.Autocomplete(document.getElementById('ac'),acOptions);

  google.maps.event.addListener(autocomplete, 'place_changed', function() {

    var place = autocomplete.getPlace();
    //console.log(place.geometry.location);
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
      map.setZoom(12);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(8);
    }

    });
  };



module.findMap = findMap;
Installation.fetchAll(findMap.getLocation); // gets location and renders map centered on that point

})(window);
