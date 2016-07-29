var showMarkers = {
  trainingClasses: new Boolean(),
  computerRetail: new Boolean(),
  freeWifi: new Boolean(),
  publicComputers: new Boolean()
};



function onGoogleReady() {
  angular.bootstrap(document.getElementById("customMap"), ['core.map']);
  showMarkers.freeWifi        = true;
  showMarkers.publicComputers = false;
  showMarkers.computerRetail  = false;
  showMarkers.trainingClasses = false;
}

var list = {};
	list.access = [];
	list.wifi = [];

function sortListToArrays(places) {
	      console.log("sortListToArrays");
	      console.log(places.length);
	     
	      var lng = places.length;
	      console.log(lng);
	      var i;
	      for (i = 0; i < lng; i++) {
	        var place = places[i];
	        console.log(place);
	        var category = place.primaryCategory;
	        if (category === "computers-access") {
	           list.access.push(place);
	           // $scope.array.computers.access.push(place);
	        } else if (category === "training-day") {
	           $scope.array.training.day.push(place);
	        } else if (category === "training-night") {
	           $scope.array.training.night.push(place);
	        } else if (category === "wifi-free") {
	           $scope.array.wifi.free.push(place);
	        } else if (category === "wifi-customer") {
	          $scope.array.wifi.customer.push(place);
	        } else if (category === "computers-retail") {
	          $scope.array.computers.retail.push(place);
	        } else if (category === "isp") {
	          $scope.array.isps.push(place);
	        };
	      }
	    }
		
(function () {
	'use strict';

	angular
		.module('core.map')
		.controller('MapController', MapController);
		
	MapController.$inject = ['$scope', '$window', '$timeout', '$http', '$location', 'zipcode', 'PlacesService', 'zcPosition'];
	// console.log("map.client.controller - 1");
	function MapController($scope, $window, $timeout, $http, $location, zipcode, PlacesService, zcPosition) {
		// console.log("map.client.controller - 2");
	    $scope.array              =    { 
	                                     wifi      : { free  : [], customer: [] },
	                                     computers : { retail: [], access  : [] },
	                                     training  : { day   : [], night   : [] }, 
	                                     isps      : []
	                                    };

	    $scope.markers            =  { 
	                                   wifi      : { free   : [], customer : [] },
	                                   computers : { retail : [], access   : [] },
	                                   training  : { day    : [], night    : [] }, 
	                                   isps      : []
	                                 };

      $scope.places = [];


	    $scope.mapMarkers = [];
	    $scope.viewportActiveLocations = [];
	    $scope.closest = [];
	    $scope.closestMap = [];

      $scope.showMapControls = false

      $scope.bool = false

	    var net = document.getElementById("net");
      var headerToggleId = document.getElementById('headerToggleId');

      var zipcodes = zipcode.getZipcodes();
      
	    var e1                    = angular.element(document.getElementById("e1"));
	    var e2                    = angular.element(document.getElementById("e2"));
	    var e3                    = angular.element(document.getElementById("e3"));
	    var e4                    = angular.element(document.getElementById("e4"));

      //  var e1                   = document.getElementById("e1");
      // var e2                    = document.getElementById("e2");
      // var e3                    = document.getElementById("e3");
      // var e4                    = document.getElementById("e4");

      var frontdoor             = angular.element(document.getElementById("frontdoor"));

	    var mapCanvasElement      = document.getElementById("customMap");
	    var sideWindowElement     = document.getElementById("sw");
      var mobileWindowElement   = document.getElementById("wrapMobileWindow");
      var closeWinTag           = document.getElementById('closeWindow');
	    var resultsHtml           = document.getElementById("kv");
	    var iconoriginx           = null;
	    var iconoriginy           = null;
	    var iconSize              = new google.maps.Size(30, 30);
	    var iconAnchor            = new google.maps.Point(15, 30);

	    $scope.browserSupportFlag = false;
	    $scope.lat                = "0";
	    $scope.lng                = "0";
	    $scope.accuracy           = "0";
	    $scope.error              = "";
	    $scope.siteVisitor;
	    $scope.id;
	    $scope.watchOptions;


	    resultsHtml.style.display = "none";

	    Array.prototype.unique = function() {
		    var a = [];
		    var i;
		    for ( i = 0; i < this.length; i++ ) {
		        var current = this[i];
		        if (a.indexOf(current) < 0) a.push(current);
		    }

		    this.length = 0;
		    for ( i = 0; i < a.length; i++ ) {
		        this.push( a[i] );
		    }

		    return this;
		}


     var svgW  = angular.element(document.getElementById("svgWrap"));
    

    setTimeout(function() {
        svgW.removeClass("vis-off");
        svgW.addClass("vis-on");
        $scope.loading = true;
        // header.addClass("pt-page-moveToRightEasing");
    }, 100);
    
    var vm = this;

      // var allPlaces = PlacesService.query();
      $scope.places = $http.get('/api/places').success(function(data){
        sortResponses(data);
      }).error(function(err) {
        console.log(err);
        return err;
      });


      function sortResponses(places) {
        var length = places.length;
        var i;
        for (i = 0; i < length; i++) {
            var place = places[i];
            // console.log(place);
            var category = place.primaryCategory;
            if (category === "computers-access") {
               // list.access.push(place);
               $scope.array.computers.access.push(place);
            } else if (category === "training-day") {
               $scope.array.training.day.push(place);
            } else if (category === "training-night") {
               $scope.array.training.night.push(place);
            } else if (category === "wifi-free") {
               $scope.array.wifi.free.push(place);
            } else if (category === "wifi-customer") {
              $scope.array.wifi.customer.push(place);
            } else if (category === "computers-retail") {
              $scope.array.computers.retail.push(place);
            } else if (category === "isp") {
              $scope.array.isps.push(place);
            };
          }

        
      }





function getZipBounds(zip) {
  console.log("getZipBounds");
  console.log(zip);
  var zip2 = parseInt(zip);
  var i;
  var l = zipBounds.length;
  for (i=0;i<l;i++) {
    var z = zipBounds[i].zip;
    // console.log('z');
    // console.log(z);
    // console.log('zip2');
    // console.log(zip2);
    if (z === zip2) {
      console.log("what if");
      return stackChips(zipBounds[i]);
    } else {
      console.log('not if');
    }
  }
}


$scope.thisBounds;

function stackChips(obj) {
  console.log("stackChips");
  console.log(obj);
  var i; 
  var j;
  var l = obj.data.length;
  var geodesicPoly = new google.maps.Polyline({
                            strokeColor: '#CC0099',
                            strokeOpacity: 1.0,
                            strokeWeight: 3,
                            geodesic: true,
                            map: $scope.map
                          });
  for (i=0;i<l;i++) {
    var bounds = [];
    var m = zipBounds[i].data.length;
    // console.log(m);
    // console.log(zipBounds[i].data);
    for (j=0;j<m;j++) {
      // console.log(zipBounds[i].data[j]);
      var lat = zipBounds[i].data[j].match(/(-9.[.].{5,6})/g);
      var lng = zipBounds[i].data[j].match(/(3.[.].{4,6})/g);
      // console.log('lat, lng');
      // console.log(lat);
      // console.log(lng);
      
      var lat2 = parseFloat(lat[0]);
      var lng2 = parseFloat(lng[0]);
      // console.log('lat2, lng2');
      // console.log(lat2);
      // console.log(lng2);

      // var lat = parseFloat(zipBounds[i].data[j][1]);
      // var lng = parseFloat(zipBounds[i].data[j][0]);
      // console.log(lat);
      // console.log(lng);
      var p = new google.maps.LatLng(lng2,lat2);
      // console.log('p');
      // console.log(p);
      bounds.push(p);
    }

  }
  console.log("bounds");
  console.log(bounds);
  geodesicPoly.setPath(bounds);
}









setTimeout(function(){
              console.log("?P");
              console.log(svgW[0]);
              svgW.removeClass("vis-off");
              svgW.addClass("vis-on");
              $scope.loading = false;
                 var cMap = angular.element(document.getElementById("customMap"));
        // svgW.removeClass("vis-on");
        //   svgW.addClass("vis-off");
          cMap.removeClass("vis-off");
          cMap.addClass('vis-on');
         


              // header.addClass("pt-page-moveToRightEasing");
          }, 2000);




























		// var z66207 = [];
		// var z1 = new google.maps.LatLng(38.933139,-94.630097);
		// var z2 = new google.maps.LatLng(38.934788,-94.65814);
		// var z3 = new google.maps.LatLng(38.978778,-94.65814);
		// var z4 = new google.maps.LatLng(38.978778,-94.630097);
		// var z5 = new google.maps.LatLng(38.933139,-94.630097);
		// z66207.push(z1, z2, z3, z4, z5);


	    function resetToNormal() {
	      var arr = [e1,e2,e3,e4];
	      var i; 
	      var n = arr.length;
	      var elem;
	      for (i=0;i<4;i++) {
	        arr[i].removeClass('special') && arr[i].addClass('normal');
	      }
	    }

	    function clearAll() {
	      clearWifiMarkers(); 
	      clearAccessMarkers();
	      clearTrainingMarkers();
	      clearRetailMarkers();
	    }


      function setButtonState(buttonType) {

      }


      function isStateActive(buttonType) {

      }
	    

	    function callback(data) {



	      var i;
	      var length = data.length;
	      resetToNormal();
	      for (i = 0; i < length; i++) {
	        var place = data[i];
          console.log(place);
	        createMarker(place);
	      }
	    }

	    
      function getAll() {
        var all = [];
        var arr1 = $scope.markers.wifi.free;
        var arr2 = $scope.markers.wifi.customer;
        var arr3 = $scope.markers.training.day;
        var arr4 = $scope.markers.training.night;
        var arr5 = $scope.markers.computers.access;
        var arr6 = $scope.markers.computers.retail;
        all.push(arr1, arr2, arr3, arr4, arr5, arr6);
        return all.reduce(function(prev, curr) {
          return prev.concat(curr);
        });
      }

      function removeAllMapData() {
        var all = getAll();
        console.log("removeAllMapData");
        console.log(all);
        // var arr1 = $scope.markers.wifi.free;
        // var arr2 = $scope.markers.wifi.customer;
        // var arr3 = $scope.markers.training.day;
        // var arr4 = $scope.markers.training.night;
        // var arr5 = $scope.markers.computers.access;
        // var arr6 = $scope.markers.computers.retail;
        // all.push(arr1, arr2, arr3, arr4, arr5, arr6);
        var l = all.length;
        var i;
        for (i=0;i<l;i++) {
          var l2 = all[i].length;
          var j;
          for (j=0;j<l2;j++) {
            // $scope.map.setMap()
            // console.log(all[i][j]);
            all[i][j].setMap(null);
          }
        }
      }

      $scope.zoomOut = function() {
        $scope.map.setZoom(13);
        setTimeout(function(){
            console.log("timeout");
            $scope.map.setZoom(12);
        }, 200);
      }

      $scope.zoomIn = function() {
        $scope.map.setZoom(14);
        setTimeout(function(){
            console.log("timeout");
            $scope.map.setZoom(15);
        }, 100);
      }



	    function recenterMap(latlng) {
	    	// var center = marker.getPosition();
        // console.log($scope.map);
        // console.log($scope.markers);
        removeAllMapData();
  			// $scope.map.setZoom(13);
        $scope.zoomIn();
  			$scope.map.setCenter(latlng);

  			// var eid = "1fzwSGnxD0xzJaiYXYX66zuYvG0c5wcEUi5ZI0Q";
  			// var geodesicPoly = new google.maps.Polyline({
    	// 											    strokeColor: '#CC0099',
    	// 											    strokeOpacity: 1.0,
    	// 											    strokeWeight: 3,
    	// 											    geodesic: true,
    	// 											    map: $scope.map
    	// 											  });

  			// var p1 = new google.maps.LatLng(38.978778,-94.630097);
  			// var p2 = new google.maps.LatLng(38.978778,-94.65814);
  			// var p3 = new google.maps.LatLng(39.007371,-94.648792);
  			// var p4 = new google.maps.LatLng(39.015069,-94.648792);
  			// var p5 = new google.maps.LatLng(39.033765,-94.607552);
  			// var p6 = new google.maps.LatLng(39.028266,-94.607552);
  			// var p7 = new google.maps.LatLng(39.000223,-94.608102);
  			// var p8 = new google.maps.LatLng(38.985376,-94.608102);
  			// var p9 = new google.maps.LatLng(38.978778,-94.630097);

  			// var path = [p1,p2,p3,p4,p5,p6,p7,p8,p9];
  			// var layer = new google.maps.FusionTablesLayer({
  			// 											    query: {
  			// 													      select: 'geometry',
  			// 													      from: eid,
  			// 													      where: 'ZIP == 66208'
  			// 													    }
  			// 											  });
  			// layer.setMap($scope.map);
  			// geodesicPoly.setPath(path);
  			// var path66207 = z66207;
  			// new google.maps.Polyline({
  			// 									    strokeColor: '#CC0099',
  			// 									    strokeOpacity: 1.0,
  			// 									    strokeWeight: 3,
  			// 									    geodesic: true,
  			// 									    map: $scope.map
  			// 									  }).setPath(path66207);

	    }

      var mainPageEl = angular.element(document.getElementById("main-page"))[0];

      $scope.setPageHeightNormal = function() {
        mainPageEl.style.height = "638px";
      }

      // $scope.setPageHeightLong = function() {
      //   mainPageEl.style.height = "800px";
      //   document.getElementById('wrapper').style.height = "1024px";
      //   setTimeout(function(){
      //       console.log("timeout");
      //       $scope.map.setZoom(14);
      //   }, 500);
      // }

      function setPageHeightLong() {
        mainPageEl.style.height = "800px";
        document.getElementById('wrapper').style.height = "1024px";
        setTimeout(function(){
            console.log("timeout");
            $scope.map.setZoom(14);
        }, 500);
      }


      function validZipcode(zc) {
        // var pattern = {};
        console.log("validating zipcode");
        // var zi = parseInt(zc);
        console.log(zc);
        var pattern = new RegExp(/^\d{5}$/);
        if (zc.match(pattern)) {
          return true;
        } else {
          return false;
        }
      }



      var zse = document.getElementById('zipSearchError');
      $scope.zipSearchError = false;



      $scope.closeErrorWindow = function() {
        zse.style.display = "none";
        $scope.zipSearchError = false;
      }



	    $scope.searchByZip = function(zipcode) {
	      resetForm();
        $scope.zipSearchError = false;
	      // console.log(masterZips);
        var valid = validZipcode(zipcode);
        console.log("valid?");
        console.log(valid);

        if (valid) {
          var zc = zcPosition.getZcPosition(zipcode);
          var goTo = new google.maps.LatLng(zc[0], zc[1]);
          recenterMap(goTo);
          setPageHeightLong();
          var body = {zip: zipcode};
          $http.post('/api/places/query', body).success(function(data) {
            console.log('zip');
            console.log(data);
            callback(data);
          });
        } else {
          $scope.zipSearchError = true;
          zse.style.display = "block";
          $scope.zipSearchErrorMessage = "Error: Not a valid zipcode";
          return recenterMap($scope.currentLocation);
        }

	      // var ll = checkForZip(zipcode);
        

	    }

	    $scope.place = {
	      zip: ""
	    }

	    function resetForm() {
	      $scope.place.zip = '';
	    };


	    var callMethod = function() {
	       console.log("search results");
	       console.log($scope.searchResults);
	    };


	    var counter = 0;
	    function incrementToLimit(num) {
	      console.log(num + " reaching limit =>" + limit);
	    }

	    

	  	$scope.isps = [];

	  	function getIsps(array) {
	  		var i;
	  		var l = array.length;

	  		for (i=0;i<l;i++) {
	  			if (array[i].primaryCategory === "isp") {
	  				$scope.isps.push(array[i]);
	  			}
	  		}
	  	}


	    // console.log(allPlaces);
	    // console.log(allPlaces.length);
	    // $scope.places;
	    // allPlaces.then(function() {
	    // 	console.log("then");
	    // 	console.log(allPlaces);
	    // })

	    // sortListToArrays(allPlaces);

	  //   $scope.places = getPlacesService.getPlaces(function(places) {
	      
		 // });

	    function setWifiMarkers() {
	      console.log("setWifiMarkers");
	      var frLocations = $scope.array.wifi.free;
	      var coLocations = $scope.array.wifi.customer;
	      var i;
	      var n;
	      var frLength = frLocations.length;
	      var coLength = coLocations.length;
	      for (i=0; i<frLength; i++) {
	        var place = frLocations[i];
	        // console.log(place);
	        createMarker(place);
	        
	      }
	      for (n=0;n<coLength;n++){
	        var place = coLocations[n];
	        createMarker(place);
	      }
	    }

	    $scope.setInitial = function() {
	      setWifiMarkers();
	    }

	    function setTrainingMarkers() {
	      console.log("setTrainingMarkers");
	      var dayLocations = $scope.array.training.day;
	      var nightLocations = $scope.array.training.night;
	      // console.log(dayLocations);
	      // console.log(nightLocations);
	      var i;
	      var n;
	      var dayLength=dayLocations.length;
	      var nightLength = nightLocations.length;
	      for (i=0;i<dayLength;i++){
	        var place = dayLocations[i];
	        createMarker(place);
	      }
	      for (n=0;n<nightLength;n++){
	        var place = nightLocations[n];
	        createMarker(place);
	      }
	    }

	    function setAccessMarkers(){
	      var locations = $scope.array.computers.access;
	      var i;
	      var length = locations.length;
	      for (i=0;i<length;i++){
	        var place = locations[i];
	        createMarker(place);
	      }
	    }

	    function setRetailMarkers(){
	      var locations = $scope.array.computers.retail;
	      var i;
	      var length = locations.length;
	      for (i=0;i<length;i++){
	        var place = locations[i];
	        createMarker(place);
	      }
	    }



	    function getIcon(category) {
	      if (category === "computers-access") {
	       // return "modules/core/client/img/computerAccess.png";
         return "modules/core/client/img/monitor-1.svg";
	      } else if (category === "training-day") {
	       return "modules/core/client/img/userOrange.png";
	      } else if (category === "training-night") {
	       return "modules/core/client/img/userBlue.png";
	      } else if (category === "wifi-free") {
          return "modules/core/client/img/wifi-free.svg";
	       // return "modules/core/client/img/wifiFree-2.png";
	      } else if (category === "wifi-customer") {
          return "modules/core/client/img/wifi-purchase.svg";
	       // return "modules/core/client/img/wifiCustomerOnly.png";
	      } else if (category === "computers-retail") {
	       return "modules/core/client/img/computerRetail.png";
	      } else if (category === "isp") {
	       return "modules/core/client/img/internetService.png";
	      };
	    }

	    function formatString(str) {
	    	var obj = str.replace(/ /g, "+");
	    	console.log(obj);
	    	return obj;
	    }

	    $scope.getDirections = function(address, city, state, zipcode) {
	    	console.log("getAddress");
	    	console.log(address);
	    	// console.log(city);
	    	// console.log(state);
	    	// console.log(zipcode);
	    	// var destination = ;
	    	var fstr = formatString(address);
	    	var fcity = formatString(city);

	    	var origin = "origin=" + $scope.lat + "," + $scope.lng;
	    	var org = { lat: $scope.lat, lng: $scope.lng };
	    	var dst = fstr + "+" + fcity + "+" + state;
	    	var destination = "destination=" + fstr + "+" + fcity + "+" + state;

	    	var url = "https://maps.googleapis.com/maps/api/directions/json?" + origin + "&" + destination + "&key=AIzaSyBqZ_zfcyUUJDi6OuXq4QYpkdHPeaqFkms";
	    	console.log(url);

	    	// $http.post(url).success(function(res){
	    	// 	console.log(res);
	    	// })	

	    	$http({
			    method: 'POST',
			    url: '/api/places/directions', 
			    data: {
			    	url: url, 
			    	origin: org, 
			    	destination: dst
			    }
			}).then(function(response) {
				// console.log(response);
			    if (response.statusText === 'OK') {
			        // success
			        console.log("ok");
			        console.log(response);
			        $scope.drawRoute(response);
			        // $scope.directionsDisplay.setDirections(response.data.bounds);
			    } else {
			       console.log("not ok");
			    }
			});
	    	// origin=24+Sussex+Drive+Ottawa+ON
	    	// https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood4&key=YOUR_API_KEY

	    }

	    $scope.steps = [];
	    var directions = [];

	    var stores = [];
	    // $scope.parseStep = function(step, i) {
	    // 	console.log("step: " + i);
	    // 	console.log(step);
	    // 	// var html 
	    // 	$scope.polyline = {};
	    // 	$scope.directions = [];
	    // 	$scope.directions.push(step);
	    // 	stores.push(step.html_instructions);
	    // }

var panel = angular.element(document.getElementById("directions-panel"));

var mapVeil = angular.element(document.getElementById("map-veil"));



	    // var desth4 = angular.element(document.getElementById("show-dest"));
	    $scope.drawRoute = function(res) {
	    	// var wps = res.
	    	var data = res.data;
	    	console.log(data);
	    	var steps = data.routes[0].legs[0].steps;
	    	$scope.directions = steps;
	    	var listo = angular.element(document.getElementById("step-array"));
	    	console.log(panel);
	    	panel[0].style.zIndex=9999;

	    	// h3.textContent = 
	    	// desth4.style.display = "block";
	    	// $scope.directionsDisplay = new google.maps.DirectionsRenderer;
      //   	$scope.directionsDisplay.setMap($scope.map);
      //       $scope.directionsDisplay.setPanel(document.getElementById('right-panel'));
      //       $scope.directionsDisplay.setDirections(res.data);

	    	// $scope.steps = steps;

	    	 var remarker = new google.maps.Marker({
												    position: $scope.map.getCenter(),
												    icon: {
												      path: google.maps.SymbolPath.CIRCLE,
												      scale: 6
												    },
								          		    map: $scope.map
												  });

	    	var pl = res.data.routes[0].overview_polyline.points;

	    	$scope.routePath = new google.maps.Polyline({
	          path: pl,
	          geodesic: true,
	          strokeColor: 'fff',
	          strokeOpacity: 1.0,
	          strokeWeight: 3
	        });


	    	$scope.requestDestination = res.config.data.destination;
	    	$scope.directions = {};
	    	$scope.directions.origin = {};
	    	$scope.directions.origin.distance = data.routes[0].legs[0].distance.text;
	    	$scope.directions.origin.startAddress = data.routes[0].legs[0].start_address;
	    	$scope.directions.origin.startLocation = data.routes[0].legs[0].start_location;
	    	// console.log(steps);


	    	// var originMarker = new google.maps.Marker({
	     //      position: $scope.directions.origin.startLocation,
	     //      animation: google.maps.Animation.DROP,
	     //      map: $scope.map,
	     //      icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
		    // });

	    	var i;
	    	
	    	var routePlanCoordinates = [
	          // {lat: 37.772, lng: -122.214},
	          // {lat: 21.291, lng: -157.821},
	          // {lat: -18.142, lng: 178.431},
	          // {lat: -27.467, lng: 153.027}
	        ];

	        for (i=0;i<steps.length;i++) {
	    		// console.log(steps[i]);
	    		var step = steps[i];
	    		var start = step.start_location;
	    		var end = step.end_location;
	    		routePlanCoordinates.push(start,end);
	    		listo.append(step.html_instructions + '<br>');
	    		// $scope.parseStep(step, i);
	    	}

	   		console.log(listo);

	        $scope.routePath = new google.maps.Polyline({
	          path: routePlanCoordinates,
	          geodesic: true,
	          strokeColor: '#000000',
	          strokeOpacity: 1.0,
	          strokeWeight: 3
	        });
	        removeWindow();
        	$scope.routePath.setMap($scope.map);
	    	
        
	    }


// distance
// duration
// end_location
// html_instructions
// "Turn <b>left</b> at the 1st cross street onto <b>E 51st St</b>"
// maneuver
// "turn-left"
// polyline
// start_location
// travel_mode

		// function addBounce 
		function toggleBounce() {
		  if (marker.getAnimation() !== null) {
		    marker.setAnimation(null);
		  } else {
		    // marker.setAnimation(google.maps.Animation.BOUNCE);
		  }
		}

		var markerIndex = {};

		function setActive(marker, latLng, category) {
	      $scope.map.setZoom(14);
	      setTimeout(function() {
	            console.log("timeout1");
	            $scope.map.setZoom(16);
	       }, 150);
	      setTimeout(function() {
	            console.log("timeout2");
	            $scope.map.setZoom(17);
	       }, 150);
	      setTimeout(function() {
	            console.log("timeout");
	            $scope.map.setZoom(18);
	       }, 150);





			// set marker to highlight active location 

			// console.log("setActive");
			// console.log(latLng);
			// var point = latLng.fromLatLngToPoint(latLng:latLng, point?:"");
			// console.log(point);
			var color = getColor(category);
			var spot = new google.maps.Marker({
								    position: latLng,
								    icon: {
								      path: google.maps.SymbolPath.CIRCLE,
								      scale: 13, 
								      anchor: new google.maps.Point(.4, 1.6),
								      strokeColor: color,
								      strokeWeight: 1.5
				  			       },
				          		    map: $scope.map
							 	   })
			$scope.activeSpot = spot;
			console.log("spot");
			console.log(spot);


		}

		function removeMarker(marker) {
			marker.setMap(null);
		}

		function setInactiveListener(marker) {

		}

		function findActive() {
			if ($scope.activeSpot == null) {
				
			} else {
				$scope.activeSpot.setMap(null);
			}
			
		}

		function markAsBouncing(marker) {
			$scope.bouncingMarker = marker;
		}

		function removeBouncing() {
			if ($scope.bouncingMarker == null) {

			} else {
				$scope.bouncingMarker.setAnimation(null);
			}
			
		}


		function sortByProximity(position) {
			var currentPos = position;
			// console.log("sortByProximity");
			// console.log(currentPos);
		}



		function recenterToMarker() {

			var center = $scope.bouncingMarker.getPosition();
			 $scope.map.setZoom(17);
			    $scope.map.setCenter(center);

			// marker.addListener('click', function() {
			   
			// })
		}






		function getColor(str) {
			if (str === "wifi-free") {
	    		return "green";
	    	} else if (str === "wifi-customer") {
	    		return "#000000";
	    	} else if (str === "computers-access") {
 				return "#000000";
	    	} else if (str === "computers-retail") {
	    		return "#000000"
	    	} else if (str === "training-day") {
	    		return "#b37503";
	    	} else if (str === "training-night") {
	    		return "blue";
	    	} else if (str === "isp") {
	    		return "firebrick";
	    	}
		}

		function togglePulse(marker) {
			console.log("toggle pulse");

			 var contentString = '<div id="content">'+ 'hi</div>';

	        var infowindow = new google.maps.InfoWindow({
	          content: contentString,
	          maxWidth: 200
	        });

	
	        infowindow.open($scope.map, marker);

	        google.maps.event.addListener(marker, 'mouseout', function() {
			    infowindow.close();
			});
			// marker.setAnimation(google.maps.Animation.BOUNCE);
	        // if (marker.getAnimation() !== null) {
	        //   console.log("set animation to null");
	        //   marker.setAnimation(null);
	        // } else {
	        //   console.log("else pulse");
	        //   marker.setAnimation(google.maps.Animation.BOUNCE);
	        // }
	      


	       

	    }

	    function addInfoWin(marker) {

	    	
	        
	    }

		function addHoverListener(json, marker) {
			// marker.addListener('mousover', togglePulse);

			google.maps.event.addListener(marker, 'mouseover', function() {
					togglePulse(marker);
			})


		}



    $scope.mobileWindowOpen = false;
    var innerWidth = $window.innerWidth;
    var winWrapper = angular.element(document.getElementById("pseudoWrapWindow"));
    console.log("CHECK FOR MOBILE WIDTH");
    console.log(innerWidth);


    $scope.closeMobileWindow = function() {
      html.style.overflowY = 'visible';
      headerToggleId.style.display = "initial";
      mobileWindowElement.style.display = "none";
    }


    function getCurrentWidth() {
      console.log("getCurrentWidth");
      console.log($window.innerWidth);
      return $window.innerWidth;
    }

	    function addListener(json, marker) {

	      // console.log("listener");
	      // console.log(marker);
	      // marker.addListener('click', toggleBounce);
        // var isMobile;
        // if (innerWidth <= 768) {
        //   isMobile = true;
        // } else if (innerWidth > 768) {
        //   isMobile = false;
        // }

	      google.maps.event.addListener(marker, 'click', function() {
          // if (innerWidth < 768) {
          //   $scope.mobileWindowOpen = true;
          // }
          setMobileInfoWindowData(json);
          var c = getCurrentWidth();
          console.log(c);
          if (c <= 768) {
            console.log("c <= 768");
          } else {
            console.log("c > 768");
          }

	        resizeMap();	
	        findActive();
	
	        var lat = json.location[0].lat;
	        var lng = json.location[0].lng;
	        var ll = new google.maps.LatLng(lat,lng);
	        var cat = json.primaryCategory;
	        setActive(marker, ll, cat);
          // $scope.windowOpen = true;
          
	        // var highlightCircle           =  new google.maps.Marker({
									// 			    position: ll,
									// 			    icon: {
									// 			      path: google.maps.SymbolPath.CIRCLE,
									// 			      scale: 5, 
									// 			      anchor: new google.maps.Point(.75, 2),
									// 			      strokeColor: "firebrick", 
									// 			      strokeWeight: 2
								 //  			      },
								 //          		    map: $scope.map
									// 		 });

	       



	        if (marker.getAnimation() !== null) {
				marker.setAnimation(null);
			} else {
				removeBouncing();
				// marker.setAnimation(google.maps.Animation.BOUNCE);
				markAsBouncing(marker);
				recenterToMarker();
			}



	        var anchor = new google.maps.MVCObject();
	        anchor.set("position",event.latLng);
	        var target = json.url;
	        var html = "<a ng-href='" + target +"'>" + "Visit website" + "</a>";
	        var container = document.getElementById('info-wrapper');
	        var desc = json.description;
	        var descriptor = document.getElementById('placeDescription');
	        var l = desc.length;
	        if (l < 42 || l === null) {
	          descriptor.style.textAlign = "center";
	        } else {
	          descriptor.style.textAlign = "justify";
	        }

	        var catDom = document.getElementById('placeCategory');
	        var ico = getIcon(json.primaryCategory);

	        $scope.currentCategory = ico;


          $scope.selected = {};
          $scope.selected.hoursOpen = json.hoursOpen;
          $scope.selected.zip = json.zip;
          $scope.selected.title = json.title;
          // $scope.selected.


	        document.getElementById('placeCategory').textContent = categoryIconText(json.primaryCategory);
	        document.getElementById('placeTitle').textContent = json.title;
	        descriptor.textContent = desc;
	        document.getElementById('placePhone').textContent = json.phone;
	        $scope.addr = document.getElementById('placeAddress').textContent = json.address1;
	        $scope.city = document.getElementById('placeCity').textContent = json.city;
	        $scope.state = document.getElementById('placeState').textContent = json.state;
	        $scope.zip = document.getElementById('placeZip').textContent = json.zip;
	        document.getElementById('placeHours').textContent = json.hoursOpen;
          
	      });
	    }

	    var createIcon = function(str) {

	    }

      $scope.thisPlace = {};

      function setMobileInfoWindowData(json) {
        $scope.thisPlace.title = json.title;
        $scope.thisPlace.primaryCategory = json.primaryCategory;
        // var description = document.getElementById('placeDescriptionM');
      

        // var category = document.getElementById('placeCategoryM');
        // var ico = getIcon(json.primaryCategory);

        // $scope.currentCategory = ico;

        // document.getElementById('placeCategory').textContent = categoryIconText(json.primaryCategory);
        // document.getElementById('placeTitleM').textContent = json.title;
        // descriptor.textContent = desc;
        // document.getElementById('placePhoneM').textContent = json.phone;
        // $scope.addr = document.getElementById('placeAddressM').textContent = json.address1;
        // $scope.city = document.getElementById('placeCityM').textContent = json.city;
        // $scope.state = document.getElementById('placeStateM').textContent = json.state;
        // $scope.zip = document.getElementById('placeZipM').textContent = json.zip;
        // document.getElementById('placeHours').textContent = json.hoursOpen;
      }

	    function categoryIconText(str) {
	    	if (str === "wifi-free") {
	    		return "Free Public WiFi ";
	    	} else if (str === "wifi-customer") {
	    		return "Free WiFi with purchase ";
	    	} else if (str === "computers-access") {
 				return "Public Access Computers ";
	    	} else if (str === "computers-retail") {
	    		return "Low Cost or Refurbished Computers "
	    	} else if (str === "training-day") {
	    		return "Offers Daytime Training ";
	    	} else if (str === "training-night") {
	    		return "Offers Evening Training ";
	    	} else if (str === "isp") {
	    		return "Internet Service Provider ";
	    	}
	    }


	    function createMarker(json) {
	    	// console.log("createMarker");
	     //  console.log(json);

	      var category = json.primaryCategory;
	      var iconUrl = getIcon(category);

	      var image = new google.maps.MarkerImage(
	                                               iconUrl,
	                                               new google.maps.Size(71, 71),
	                                               new google.maps.Point(0, 0),
	                                               new google.maps.Point(17, 34),
	                                               new google.maps.Size(25, 25)
	                                             );

	      var marker = new google.maps.Marker({
	        position: new google.maps.LatLng(json.location[0].lat, json.location[0].lng),
	        map: $scope.map,
	        animation: google.maps.Animation.DROP,
	        icon: image,
	        title: json.title
	      });

	      addListener(json, marker);
	      // addHoverListener(json, marker);

	      $scope.mapMarkers.push(marker);

	      if (category === "computers-access") {
	         $scope.markers.computers.access.push(marker);
	      } else if (category === "training-day") {  
	          $scope.markers.training.day.push(marker);
	      } else if (category === "training-night") {  
	          $scope.markers.training.night.push(marker);
	      } else if (category === "wifi-free") {
	         $scope.markers.wifi.free.push(marker);
	      } else if (category === "wifi-customer") {
	         $scope.markers.wifi.customer.push(marker);
	      } else if (category === "computers-retail") {
	         $scope.markers.computers.retail.push(marker);
	      } else if (category === "isp") {
	         
	      };
	    };

	    function clearWifiMarkers() {
	      console.log("clearWifiMarkers");
	      var freeWifiSpots     = $scope.markers.wifi.free;
	      var customerWifiSpots = $scope.markers.wifi.customer;
	      var i;
	      var n;
	      var l = freeWifiSpots.length; 
	      var m = customerWifiSpots.length;
	      for (i=0;i<l;i++) {
	        freeWifiSpots[i].setMap(null);
	      }
	      freeWifiSpots=[];
	      for (n=0;n<m;n++){
	        customerWifiSpots[n].setMap(null);
	      }
	      customerWifiSpots=[];
	    }
	    
	    function clearTrainingMarkers() {
	      console.log('clearTrainingMarkers');
	      var dayCourses = $scope.markers.training.day;
	      var nightCourses = $scope.markers.training.night;
	      for (var i = 0; i < dayCourses.length; i++) {
	        dayCourses[i].setMap(null);
	      }
	      for (var i = 0; i < nightCourses.length; i++) {
	        nightCourses[i].setMap(null);
	      }
	      dayCourses = [];
	      nightCourses = [];
	    }

	    function clearAccessMarkers() {
	      console.log("clearAccessMarkers");
	      var markers = $scope.markers.computers.access;
	      var i;
	      var length = $scope.markers.length;
	      for (i=0; i<length; i++) {
	        markers[i].setMap(null);
	      }
	      markers = [];
	    }

	    function clearRetailMarkers() {
	      var markers = $scope.markers.computers.retail;
	      var i; 
	      var length = $scope.markers.length;
	      for (i=0;i<length;i++){
	        markers[i].setMap(null);
	      }
	      markers = [];
	    }

	    function resetCss(elm, boolean) {
	      if (boolean) {
	        elm.removeClass('button normal fit small');
	        elm.addClass('button special fit small');
	      } else {
	        elm.removeClass('button special fit small');
	        elm.addClass('button normal fit small');
	      }
	    }

	    $scope.trainingVisibility = new Boolean();
	    $scope.toggleTrainingMarkers = function() {
	      if ($scope.trainingVisibility) {
	        resetCss(e2, true);
	        setTrainingMarkers();
	        $scope.trainingVisibility = false;
	      } else {
	        resetCss(e2, false);
	        clearTrainingMarkers();
	        $scope.trainingVisibility = true;
	      }
	    }

	    $scope.computersVisibility = new Boolean();
	    $scope.toggleComputersMarkers = function() {
	      if ($scope.computersVisibility) {
	        resetCss(e3, true);
	        setAccessMarkers();
	        $scope.computersVisibility = false;
	      } else {
	        resetCss(e3, false);
	        clearAccessMarkers();
	        $scope.computersVisibility = true;
	      }
	    }

	    $scope.wifiVisibility = new Boolean();
	    $scope.toggleWifiMarkers = function() {
	      if ($scope.wifiVisibility) {
	        resetCss(e1, true);
	        $scope.buttonToggled = true;
	        setWifiMarkers();
	        $scope.wifiVisibility = false;
	      } else {
	        resetCss(e1, false);
	        clearWifiMarkers();
	        $scope.wifiVisibility = true;
	      }
	    }

	    $scope.refurbsVisibility = new Boolean();
	    $scope.toggleRefurbsMarkers = function() {
	      if ($scope.refurbsVisibility) {
	        resetCss(e4, true);
	        setRetailMarkers();
	        $scope.refurbsVisibility = false;
	      } else {
	        resetCss(e4, false);
	        clearRetailMarkers();
	        $scope.refurbsVisibility = true;
	      }
	    }

	    $scope.success = function (pos) {
	      var coords = pos.coords;
	      if ($scope.visitor.latitude === coords.latitude && $scope.visitor.longitude === coords.longitude) {
	        console.log('$scope.visitor');
	        navigator.geolocation.clearWatch(id);
	      }
	    }

	    // $scope.geolocationError = function (err) {
	    //   console.warn('ERROR(' + err.code + '): ' + err.message);
	    // }

	    $scope.visitor = {
	      latitude : 0,
	      longitude: 0
	    };

	    $scope.watchOptions = {
	      enableHighAccuracy: true,
	      timeout: 5000,
	      maximumAge: 0
	    };

	    $scope.id = navigator.geolocation.watchPosition($scope.success, $scope.geolocationError, $scope.watchOptions);

	    $scope.showResult = function () {
	        return $scope.error == "";
	    }

	    function removeWindow() {
	      sideWindowElement.style.display = "none";
	      mapCanvasElement.style.width = "100%";
        if (innerWidth < 768) {
            $scope.mobileWindowOpen = false;
        }

	    }
      var html = document.getElementsByTagName('html')[0];
     
      console.log(html);
      console.log(document);
      console.log($window);

      function hideOverflow(element) {
        element.style.overflowY = "hidden";
      }

	    var resizeMap = function() {
        var cWidth = getCurrentWidth();
        console.log("resize map");
        console.log(cWidth);
        if (cWidth <= 768) {
          $scope.mobileMod = true;
          headerToggleId.style.display = "none";
          mobileWindowElement.style.display = "initial";
          $window.scrollTo(0,0);
          hideOverflow(html);
          var diff = (cWidth - 38);



          var x = diff + "px";
          document.getElementById('trix').style.width = x;
        } else {
          mapCanvasElement.style.width = "80%";
          mapCanvasElement.style.borderRight = "1px solid #4e4e4e";
          sideWindowElement.style.display = "initial";
        }
	      
        
	    }

	    $scope.showError = function (error) {
	      switch (error.code) {
	        case error.PERMISSION_DENIED:
	          $scope.error = "User denied the request for Geolocation."
	          break;
	        case error.POSITION_UNAVAILABLE:
	          $scope.error = "Location information is unavailable."
	          break;
	        case error.TIMEOUT:
	          $scope.error = "The request to get user location timed out."
	          break;
	        case error.UNKNOWN_ERROR:
	          $scope.error = "An unknown error occurred."
	          break;
	      }
	      $scope.$apply();
	    }

	    $scope.getLocation = function () {
	      if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition($scope.showMap, $scope.showError);
	      }
	      else {
	        $scope.error = "Geolocation is not supported by this browser.";
	      }
	    }

	    $scope.isLoaded = new Boolean(false);




	    // $scope.directionsDisplay;
     //    var directionsService = new google.maps.DirectionsService();

       //  function calculateAndDisplayRoute(directionsService, directionsDisplay) {
	      //   directionsService.route({
	      //     origin: document.getElementById('start').value,
	      //     destination: document.getElementById('end').value,
	      //     travelMode: google.maps.TravelMode.DRIVING
	      //   }, function(response, status) {
	      //     if (status === google.maps.DirectionsStatus.OK) {
	      //       directionsDisplay.setDirections(response);
	      //     } else {
	      //       window.alert('Directions request failed due to ' + status);
	      //     }
	      //   });
	      // }

	      $scope.removeWindow = function() { 
	      	console.log("?");
	        removeWindow();
	      }

	     var countMarkers = function () {
	     	// console.log("COUNT");
	     	// console.log("public wifi");
	     	// console.log($scope.markers.wifi.free.length);
	     	// console.log("customer");
	     	// console.log($scope.markers.wifi.customer.length);
	     	// console.log("public access computers");
	     	// console.log($scope.markers.computers.access.length);
	     	// console.log("low cost refurbished computers");
	     	// console.log($scope.markers.computers.retail.length);
	     	// console.log("day training");
	     	// console.log($scope.markers.training.day.length);
	     	// console.log("evening training");
	     	// console.log($scope.markers.training.night.length);
	     }

	    var loadMarkersOnInit = function (boolean) {
	    	console.log("loadMarkersOnInit");
	    	if (boolean) {
	    		console.log("init true");
	    		new google.maps.Marker({
		          position: $scope.initialLocation,
		          animation: google.maps.Animation.DROP,
		          map: $scope.map,
		          icon: 'modules/core/client/img/red-dot.png'
		      	});
	    	} else {
	    		console.log("init false");
	    	}
	    	
	    }

	    var initFreeWifiButton = function () {
	    	// console.log("initFreeWifiButton");
	    	e1.removeClass('button normal fit small') && e1.addClass('button special fit small');

	    }

	    var initTrainingButtons = function () {
	    	// console.log("initTrainingButtons");
	    	e2.removeClass('button normal fit small') && e2.addClass('button special fit small');
	    	// e4.removeClass('normal') && e4.addClass('special');

	    }



	    var inactiveCss = new RegExp('button normal fit small');
        var activeCss = new RegExp('button special fit small');

      // var pattern1 = new RegExp("normal");
      // var pattern2 = new RegExp("special");


      $scope.currentlyHighlightedButtons = [];


      var callbackStatus = function(button, boolean) {
      	if (boolean) {
      		$scope.currentlyHighlightedButtons.push(button);
      	} 
      }



	    var getBtnStatus = function(btn) {
	    	console.log("getBtnStatus");
	    	var css = btn.className;
	    	var id = btn.id;
	    	console.log(btn.className);
	    	// console.log(btn.id);
	    	if (css.match(activeCss)) {
	    		// console.log("css matches, is highlighted")
	    		return true;
	    	} else {
	    		// console.log("css not a match, not highlighted");
	    		return false;
	    	}
	    	// if (btn === )
	    }

	    var checkActiveArray = function() {
	    	// console.log("checkActiveArray");
	    	// console.log($scope.currentlyHighlightedButtons.length);
	    	return $scope.currentlyHighlightedButtons
	    }

	    var getCurrentlyHighlighted = function() {
	    	// console.log("getCurrentlyHighlighted");
	    	$scope.activeNow = [];
	    	// console.log($scope.activeNow);
	    	var btns = [e1,e2,e3,e4];
	    	var i;
	    	for (i=0;i<4;i++) {
	    		var btn = btns[i][0];
	    		var s = getBtnStatus(btns[i][0]);
	    		console.log("is btn highlighted");
          console.log(btn.id);
	    		console.log(s);
	    		callbackStatus(btn, s);
	    		// if s.css matches string special -- depnds on getBtnStatus console.log obj
	    	}
	    	var arc = checkActiveArray();
	    	lookupActive(arc);
	 
	    	var returnVal = parseActive();
	    	// console.log("returnVal");
	    	return returnVal;
	    	// console.log(returnVal);
	    	// var w;
	    	// for (w=0;w<returnVal.length;w++) {
	    	// 	console.log(returnVal[w]);
	    	// }
	    }	


      $scope.switchToggleState = function() {
        getCurrentlyHighlighted();
      }

	    var parseActive = function() {
	    	var all = $scope.activeNow;
	    	var i;
	    	var res = [];
	    	for (i=0;i<all.length;i++) {
	    		// console.log(all[i]);
	    		res.push(all[i].location[0]);
	    		// var l = {lat: all[i].latLng[0], lng: all[i].latLng[1]};
	    		// res.push(l);
	    	}
	    	return res;
	    }
 
 		// marker, model, year
	    function Port() {
		  // this.make = make;
		  // this.model = model;
		  // this.year = year;
		}

	    var getAllCurrentlyHighlightedInViewport = function () {
	    	// var cr = getCurrentlyHighlighted();
	    	// console.log("getAllCurrentlyHighlightedInViewport");
	    	// console.log($scope.viewportActiveLocations);

	    }

	    // $scope.onLoadTimeout = 
	    var setViewportData = function () {
	    	$scope.numberOfLocationsInViewport = "12 locations";
	    	$scope.closestLocation = "Somewhere under the rainbow";
	    }

	    var recheckViewport = function() {
	    	console.log("recheck");
	    	console.log($scope.map.getBounds());
	    }


	    var checkViewport = function() {
	    	console.log("checkViewport");
	    	$scope.currentBounds = $scope.map.getBounds();
	    	console.log($scope.currentBounds);
	    	getAllLocationsInViewport($scope.currentBounds);
	    	// return $scope.currentBounds;
	    	// console.log("current bounds");
	    	// console.log(bounds);
	    	// var nw = {lat: bounds.getNorthEast().lat(), lng: bounds.getNorthEast().lng()};
	    	// console.log("nw");
	    	// console.log(nw);
	    }



	    var readStatus = function(string) {
	    	console.log("readStatus");
	    	console.log(e1[0]);
	    	var res = [];
	    	if (string === e1[0].id) {
	    		return "free-wifi";
	    		// res.push($scope.markers.wifi.free);
	    		// res.push($scope.markers.wifi.customer);
	    	} else if (string === e2[0].id) {
	    		console.log("rs e2");
	    		return "training";
	    		// res.push($scope.markers.training.day);
	    		// res.push($scope.markers.training.night);
	    	} else if (string === e3[0].id) {
	    		return "computers-access";
	    		// res.push($scope.markers.computers.access);
	    	} else if (string === e4[0].id) {
	    		return "computers-retail";
	    		// res.push($scope.markers.computers.retail);
	    	}
	    }

	    $scope.activeNow = [];

	    var sendResults = function(string) {
	    	// var all = $scope.places;
        var all = getAll();
	    	console.log("sendResults");
	    	console.log(all.length);
	    	if (string === "free-wifi") {
	    	 	var i;
	    	 	var free = $scope.array.wifi.free;
	    	 	for (i=0;i<free.length;i++) {
	    	 		$scope.activeNow.push(free[i]);
	    	 	}
	    	 	var w; 
	    	 	var customer = $scope.array.wifi.customer;
	    	 	for (i=0;i<customer.length;i++) {
	    	 		$scope.activeNow.push(customer[i]);
	    	 	}
	    		// var i;
	    		// for (i=0;i<all.length)
	    		// return ;
	    		// res.push($scope.markers.wifi.free);
	    		// res.push($scope.markers.wifi.customer);
	    	} else if (string === "training") {
	    		var i;
	    	 	var day = $scope.array.training.day;
	    	 	for (i=0;i<day.length;i++) {
	    	 		$scope.activeNow.push(day[i]);
	    	 	}
	    	 	var w;
	    	 	var night = $scope.array.training.night;
	    	 	for (i=0;i<night.length;i++) {
	    	 		$scope.activeNow.push(night[i]);
	    	 	}
	    		// console.log("rs e2");
	    		// return ;
	    		// res.push($scope.markers.training.day);
	    		// res.push($scope.markers.training.night);
	    	} else if (string === "computers-access") {
	    		var i;
	    	 	var pc = $scope.array.computers.access;
	    	 	for (i=0;i<pc.length;i++) {
	    	 		$scope.activeNow.push(pc[i]);
	    	 	}
	    		// return ;
	    		// res.push($scope.markers.computers.access);
	    	} else if (string === "computers-retail") {
	    		var i;
	    	 	var lc = $scope.array.computers.retail;
	    	 	for (i=0;i<lc.length;i++) {
	    	 		$scope.activeNow.push(lc[i]);
	    	 	}
	    		// return ;
	    		// res.push($scope.markers.computers.retail);
	    	}
	    }

	    var lookupActive = function(array) {
	    	var i;
	    	for (i=0;i<array.length;i++) {
	    		var st = readStatus(array[i].id);
	    		console.log("lookupActive-readStatus");
	    		console.log(st);
          console.log(array[i]);
	    		sendResults(st);
	    	}
	    }

	    var checkForLocationsInViewport = function (bounds,latLng) {
	    	var loc = google.maps.LatLng(latLng.lat, latLng.lng);
	    	if (bounds.contains(loc)) {
	    		// console.log("bounds contains latLng");
	    		return [true,loc];
	    	} else {
	    		// console.log("bounds does not contain latLng");
	    		return [false,null];
	    	}
	    }


	    var refreshViewportData = function() {
	    	// console.log("refreshViewportData");
	    }



	    var resetViewportActive = function () {
	    	// console.log("reset");
	    	// console.log($scope.viewportActiveLocations.length);
	    	// $scope.viewportActiveLocations = [];
	    	getAllLocationsInViewport($scope.map.getBounds());
	    	// console.log($scope.viewportActiveLocations.length);
	    }

	    var getAllLocationsInViewport = function(bounds) {
	    	// console.log("getAllLocationsInViewport");
	    	// $scope.viewportActiveLocations = [];
	    	// console.log("bounds");
	    	// console.log(bounds);
	    	// console.log("now get current");

	    	var rectangle = new google.maps.Rectangle({
	          bounds: bounds
	        });



	    	var allCur = getCurrentlyHighlighted();

	    	// console.log(allCur);
	    	var i;
	    	for (i=0;i<allCur.length;i++){
	    		// console.log(allCur[i]);
	    		var pos = new google.maps.LatLng(allCur[i].lat, allCur[i].lng);
	    		var answer = bounds.contains(pos);

	    		// var answer = checkForLocationsInViewport(bounds,allCur[i]);
	    		// console.log("answer");
	    		// console.log(answer);
	    		if (answer) {
	    			// console.log(answer);
	    			callbackSendsData([true,allCur[i]]);
	    		} else {
	    			callbackSendsData([false,null]);
	    		}
	    		// callbackSendsData(answer);
	    	}

	    	
	    	getViewportCurrentlyActive();
	    	// var cal = $scope.viewportActiveLocations;
	    	// console.log(cal);
	    	// var w; 
	    	// for (w=0;w<cal.length;w++){
	    	// 	console.log(cal[w]);
	    	// }
	    }

	    $scope.endResult = {};

	    function getViewportCurrentlyActive() {
	    	// console.log("check for end result");
	    	// console.log($scope.index);
	    	// $scope.index = $scope.endResult;



	    }

	    var findIndexMatch = function() {

	    }

	  


	    var checkIndex = function(location) {
	    	// console.log("checkIndex");
	    	// console.log(location);
	    	// console.log(currentIndex);
	    	
	    	
	    	var lat = parseFloat(location.lat).toFixed(5);
	    	var lng = parseFloat(location.lng).toFixed(5);
	    	var ll = {lat: lat, lng: lng};
	    	// console.log(ll);
	    	var index = currentIndex;

	    	var i;

	    	for (i=0;i<index.length;i++) {
	    		// console.log("index[i].location");
	    		if (ll.lat === index[i].latlng.lat && ll.lng === index[i].latlng.lng) {
	    			// console.log("match found");
	    			// console.log(index[i].id);
	    			var gotPlace = getFromBackend(index[i].id);
	    			// console.log(gotPlace);
	    			// console.log(gotten);
	    		}
	    	}
	    	var cn = $scope.viewportActiveLocations.length;
	    	// console.log("number in array binding $scope.viewportActiveLocations");
	    	// console.log(cn);
	    }


	    var callbackSendsData = function (arr) {
	    	if (arr[0]) {
	    		// console.log("true --33");
	    		// console.log(arr[1].lat);
	    		checkIndex(arr[1]);
	    		// getFromBackend(arr[1]);
	    	} 
	    }
	    var viewIndex = [];
	    var cbReturns = function (obj) {
	    	// console.log("cbReturns");
	    	// console.log(obj);
	    	$scope.viewportActiveLocations.push(obj);
	    	viewIndex.push(obj);
	    	viewIndex.unique();

	    	// currentIndex.push(obj);
	    }

	    var getFromBackend = function (id) {
	    	$http({
			    method: 'GET',
			    url: '/api/places/' + id
			}).then(function(response) {
				// console.log(response);
			    if (response.statusText === 'OK') {
			        // success
			        // console.log("ok");
			        // console.log(response.data);
			        // $scope.viewportActiveLocations.push(response.data);
			         cbReturns(response.data);
			         // console.log($scope.viewportActiveLocations.unique());
			        // $scope.directionsDisplay.setDirections(response.data.bounds);
			    } else {
			       // console.log("not ok");
			    }
			});
	    }

	    
	    var buildIndex = function() {
	    	// console.log("buildingIndex");
	    	// console.log($scope.places);
	    	var pl = $scope.places;
	    	var i;
	    	for (i=0;i<pl.length;i++) {
	    		formatToIndex(pl[i].location[0], pl[i]._id, pl[i].title, pl[i].readableAddress);
	    	}
	    }

	    $scope.index = [];  

	    $scope.viewportIndex = new Array;

	    $scope.getViewportIndexData = function () {

	    }
	    // Array.prototype.push = function() {

	    // }
	    var currentIndex = [];

	    var formatToIndex = function (loc, id, name, address) {
	    	// console.log("formatToIndex");
	    	// console.log(loc);
	    	var lat = parseFloat(loc.lat).toFixed(5);
		    var lng = parseFloat(loc.lng).toFixed(5);
		    var location = {lat: lat, lng: lng};
		    var indexed = {latlng: location, id: id, title: name, address: address};
		    // console.log($scope.index);
		   currentIndex.push(indexed);
		   // console.log("currentIndex");
		   // console.log(currentIndex);
	    }


	    var triggerReporting = function () {

	    }





	    var reportView = function () {
	    	// console.log("reportView");
	    	// console.log(currentIndex);
	    	// console.log(viewIndex);

	    }



	    // https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=Washington,DC&destinations=New+York+City,NY&key=YOUR_API_KEY


	  //   var args = {
		 //   origins: $scope.initialLocation,
		 //   destinations: $scope.destinations
		 // };

	    // $scope.matrixData = GoogleDistanceAPI
	    //   .getDistanceMatrix(args)
	    //   .then(function(distanceMatrix) {
	    //     return distanceMatrix;
	    //  });
	   
		   	// $scope.matrixData = GoogleDistanceAPI
	    //   .getDistanceMatrix(args)
	    //   .then(function(distanceMatrix) {
	    //     return distanceMatrix;
	    //  });

	    var scanIndex = function(item, indexArray) {
	    	console.log("scanIndex");
	    	console.log(item);
	    	var i; 
	    	for (i=0;i<indexArray.length;i++) {
	    		console.log(indexArray[i]);
	    		// if (item === indexArray[i].)
	    	}
	    }


	    // arr1 is currentIndex
	    // arr2 is viewIndex
	    $scope.inViewNow = [];
	    var reportViewIndex = function(arr1, arr2) {
	    	console.log("reportIndex");
	    	var ci = arr1;
	    	var vi = arr2;
	    	console.log(ci);
	    	console.log(vi);

	    	var i;
	    	for (i=0;i<vi.length;i++) {
	    		var v = vi[i];
	    		console.log(v.title);
	    		$scope.inViewNow.push(v);
	    	}
	    	// measureDistances($scope.inViewNow);
	    }



	    var callDistanceApi = function(place) {
	    	console.log("callDistanceApi");
	    	console.log(place);
	    	console.log($scope.currentLocation);
	    	var data = {
	    		origin: 	{
	    			location: place.location[0]
	    		},
	    		target: 	{
	    			location: $scope.currentLocation
	    		}
	    	}

	    	$http({
			    method: 'POST',
			    url: '/api/places/matrix', 
			    data: data 
			}).then(function(response) {
				// console.log(response);
			    if (response.statusText === 'OK') {
			        // success
			        console.log("ok");
			        // console.log(response.data);
			        // $scope.viewportActiveLocations.push(response.data);
			       
			        // $scope.directionsDisplay.setDirections(response.data.bounds);
			    } else {
			       console.log("not ok");
			    }
			});
	    }

	    var getZip = function(zip) {
	    	if (zip === "undefined") {
	    		return "+";
	    		} else {
	    			return zip;	
	    		}
	    }

	    var removeUndefined = function(str) {
	    	var fix = str.replace(/,undefined/g, "");
	    	console.log(fix);
	    	return fix;
	    }

	    var measureDistances = function(array) {
	    	console.log("measureDistances");
	    	console.log(array);
	    	var results = [];
	    	var i;
	    	var destinations = [];
	    	var arrayLength = array.length;
	    		var mapIndex = [];

	    	var toFormattedString = function(string) {
	    		var obj = string.replace(/ /g, "+");
		    	console.log(obj);
		    	return obj;
	    	}

	    	var checkForLast = function(num) {
	    		if (num === arrayLength) {
	    			return true;
	    		} else {
	    			return false;
	    		}
	    	}	

	    	var buildResultsIndex = function(array) {
	    		var index = [];
	    	
	    		var i; 
	    		// console.log("resultsIndex");
	    		// console.log(array);
	    		for (i=0;i<array.length;i++) {
	    			var val = array[i].data.elements[0].distance.value;
	    			// var key = val.;
	    			// console.log(val.toString());
	    			var vs = val.toString();
	    			var dest = array[i].config.data.destination_addresses;
	    			// console.log("ri");
	    			// console.log(vs);
	    			// console.log(dest);
	    			var ds = dest.replace(/\+/g, " ");
	    			index.push(vs);
	    			var object = {key: vs, address: ds}
	    			mapIndex.push(object);
	    			// var fixD = dest.replace(/+/g, " ");credit514
	    			// var obj = {distance: vs, address: fixD, data: results[i]}
	    			// var obj = {val.toString(): results[i]}
	    			// console.log(obj);
	    			// index.push(obj);
	    		}
	    	}

	    	function sortNumber(a,b) {
			    return a > b;
			}

			function startTable(value, index) {
				var num = (index + 1);
				return {position: num, distance: value};
			}

			function buildHashTable(arr1, arr2) {
				//arr1 is values
				//arr2 is kv pairs
				console.log("buildHashTable");
				console.log(arr2);
				var tmp = [];
				var i;
				for (i=0;i<arr1.length;i++) {
					// arr1[i]
					// addKeyValue(arr2[i].key, arr2[i].address);
					var row = startTable(arr1[i], i);
					console.log("row");
					console.log(row);
					addKeyValue(row, arr2)
				}
			}
			var c = 0;

			function addKeyValue(row1, array) {
				console.log("addKeyValue");
				// console.log(row1);
				var d = row1.distance.toString();
				console.log(d);
				var i;
				for (i=0;i<array.length;i++) {
					console.log(array[i]);
					if(array[i].key === d) {
						console.log("distance match found");
						
						row1.address = array[i].address;
						console.log(row1);
						$scope.closest.push(row1);
					}
				}
				// c+=1;
				// var r = {position: c, distance: k, address: v};
				// console.log("addKeyValue");
				// console.log(r);
				// return r;
			}

			var readTable = function() {
				console.log("readTable");
				console.log($scope.closest);
				console.log($scope.closestMap);

				$scope.proximity1 = $scope.closest[0];
				$scope.proximity2 = $scope.closest[1];
				// console.log($scope.proximity1);

			}







// var numArray = [140000, 104, 99];
// numArray.sort(sortNumber);
// alert(numArray.join(","));

	    	var executeLast = function(boolean, results) {

	    		var i;
	    		if (boolean) {
	    			var allDistances = [];
	    			var ri = buildResultsIndex(results);
	    			console.log(ri);
	    			for (i=0;i<results.length;i++) {
	    				var val = results[i].data.elements[0].distance.value;
	    				console.log(val);
	    				allDistances.push(val);
	    				// console.log(results[i].data.elements[0].distance.value);
	    			}
	    			var asc = allDistances.sort(sortNumber);
	    			console.log(asc);
	    			console.log(mapIndex);
	    			buildHashTable(asc,mapIndex);
	    			readTable();
	    			// return allDistances.sort();
	    		}
	    	}

	    	for (i=0;i<array.length;i++) {
	    		// results.push(callDistanceApi(array[i]));

	    		var add1 = toFormattedString(array[i].address1);
	    		var city = toFormattedString(array[i].city);
	    		var state = array[i].state;
	    		var zip = getZip(array[i].zip);
	    		console.log(zip);
	    		var counter = 0;
	    		
	    		var str = add1 + "," + city + "," + state + "," + zip;
	    		var newStr = removeUndefined(str);
	    		console.log(newStr);
	    		$http({
					    method: 'POST',
					    url: '/api/places/matrix', 
					    data: {
					    	origin_addresses: [$scope.currentLocation],
					    	destination_addresses: newStr
					    } 
				}).then(function(response) {
						// console.log(response);
					    if (response.statusText === 'OK') {
					        // success
					        console.log("ok");
					        console.log(response);
					        results.push(response);
					        // $scope.viewportActiveLocations.push(response.data);
					       
					        // $scope.directionsDisplay.setDirections(response.data.bounds);
					    } else {
					       console.log("not ok");
					    }
					    counter = (counter+=1);
					    console.log(counter);
					    var bool = checkForLast(counter);
					    executeLast(bool, results);


				});
	    		
	    	}


	    	// var destAdds = destinations.toString();
	    	// var fixed = removeUndefined(destAdds);
	    	// console.log(fixed);
	    	

	    	// console.log(results);
	    }
	



      function zoomEnter() {
        setTimeout(function(){
            console.log("timeout");
            $scope.map.setZoom(14);
        }, 200);
        setTimeout(function(){
            console.log("timeout");
            $scope.map.setZoom(15);
        }, 400);
        setTimeout(function(){
            console.log("timeout");
            $scope.map.setZoom(16);
        }, 800);
      }

      function fadeOutElement(element) {
        console.log("fadeOut");
        console.log(element)
        // element.addClass("fade");
        // element.removeClass("veil");
        // var current = element[0];
        // console.log(current);
        // element.addClass("am-flip-x-linear");
        element.addClass("am-fade-and-slide-bottom-remove")
      }
      

	    $scope.showMap = function(position) {


	      $scope.lat = position.coords.latitude;
	      $scope.lng = position.coords.longitude;
	      $scope.accuracy = position.coords.accuracy;

	      $scope.mapOptions = {
	        center: {lat: $scope.lat, lng: $scope.lng},
	        zoom: 14,
	        mapTypeId: google.maps.MapTypeId.ROADMAP
	      };


    

	      $scope.map = new google.maps.Map(document.getElementById('customMap'), $scope.mapOptions);
	      // $scope.input = document.getElementById('plac');
	      // $scope.searchBox = new google.maps.places.SearchBox($scope.input);
	      $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push($scope.input);




	      // $scope.input = document.getElementById('pac-input');
          // $scope.searchBox = new google.maps.places.SearchBox($scope.input);

          $scope.initialLocation = new google.maps.LatLng($scope.lat, $scope.lng);
          // console.log("&&&&&&&&&&&&&&&&&&&&&");
          // console.log("$scope.initialLocation");
          // console.log($scope.initialLocation);
	      $scope.currentLocation = $scope.initialLocation;


	      google.maps.event.addListenerOnce($scope.map, 'tilesloaded', function(){
			    // do something only the first time the map is loaded
          $scope.showMapControls = true
          zoomEnter()
			    console.log("============================tilesloaded")
			    $timeout(6000, loadMarkersOnInit(true), true)
			    initFreeWifiButton()
			    setWifiMarkers()
			    // initTrainingButtons()
			    // setTrainingMarkers()

          // svgW.removeClass("vis-on");
          // svgW.addClass("vis-off");
          // cMap.removeClass("vis-off");
          // cMap.addClass('vis-on');
         
          setTimeout(function() {
              console.log("timeout");

              // cMap.removeClass("vis-off");
              // cMap.addClass('vis-on');
          }, 100);
			    // buildIndex();
			    // setViewportData();
			    // checkViewport();
			    // console.log('vp');
			    // console.log(viewIndex);
			    // console.log($scope.map);
			    // console.log($scope.map.data);

			    // reportView();
			    // executes getAllLocationsInViewport($scope.currentBounds);
			    	// gets getCurrentlyHighlighted(); 
			    		// iterates results array
			    			// if location is within bounds 
			    				// then executes callbackSendsData with arg ([boolean,location or null])
			    			// executes getViewportCurrentlyActive();




			    











	       		// sortByProximity($scope.initialLocation);
	       		
				// countMarkers();
				
				// getAllCurrentlyHighlightedInViewport();
				
		  });


          google.maps.event.addListenerOnce($scope.map, 'idle', function(){
			    // console.log("***********************************idle");
			    // console.log("map");
			    // console.log($scope.map);
			    // console.log("tilesloaded");
			    // console.log($scope.map.tilesloaded);
			    // setViewportData();
			    // checkViewport();





			 //    $timeout(6000, loadMarkersOnInit(true), true);
			 //    initFreeWifiButton();
			 //    setWifiMarkers();
			 //    initTrainingButtons();

			 //    setTrainingMarkers();
			 //    buildIndex();
	   //     		sortByProximity($scope.initialLocation);
	   //     		setViewportData();
				// countMarkers();
			
				// getAllCurrentlyHighlightedInViewport();
				
		  });



          google.maps.event.addListener(net, 'mouseover', function() {
          	// console.log("mouse in net");
          	// console.log(viewIndex);
          })

          google.maps.event.addListenerOnce($scope.map, 'mouseover', function() {
          	// console.log("mousover map");
          	// console.log(currentIndex);
          	// console.log(viewIndex);

          	// reportViewIndex(currentIndex, viewIndex);
          	// measureDistances($scope.inViewNow);
          })





        // Bias the SearchBox results towards current map's viewport.
          // $scope.map.addListener('bounds_changed', function() {
            // $scope.searchBox.setBounds($scope.map.getBounds());
            // resetViewportActive();
            // console.log("BOUNDS CHANGED");
            // checkViewport();
          // });

          $scope.mapReady = true;

          

          
          // $scope.onLoadTimeout();



	      

	      
	      // loadMarkersOnInit();

	      // var marker = new google.maps.Marker({
	      //     posiion: $scope.initialLocation,
	      //     animation: google.maps.Animation.DROP,
	      //     map: $scope.map,
	      //     icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
	      // });


	      // $scope.directionsDisplay.setMap($scope.map);

	      // var onChangeHandler = function() {
	      //   calculateAndDisplayRoute(directionsService, $scope.directionsDisplay);
	      //  };
	      //  document.getElementById('start').addEventListener('change', onChangeHandler);
	      //  document.getElementById('end').addEventListener('change', onChangeHandler);

	      // $scope.isLoaded = true;
	      // console.log('isLoaded2');
	      // console.log($scope.isLoaded);



	      // $scope.
	      $scope.clearAll = function() {
	      	clearAll();
	      }

	      

	      var center;

	      function calculateCenter() {
	        center = $scope.map.getCenter();
	      }

	      google.maps.event.addDomListener($scope.map, 'idle', function() {
	        calculateCenter();
	      });
 
	      google.maps.event.addDomListener(window, 'resize', function() {
	        console.log("resizing");
	        $scope.map.setCenter(center);
	        var bounds = $scope.map.getBounds();
	        console.log(bounds);
	        // refreshViewportData();
	      });
	        
	      $scope.$apply();
	    };





    $scope.getLocation();
  }



	
}());
