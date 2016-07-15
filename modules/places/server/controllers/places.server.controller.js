'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Place = mongoose.model('Place'),
  GoogleMapsAPI = require('googlemaps'),
  request  = require('request'),
  util = require('util'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var key = 'AIzaSyAaZSOnzTVjMqppRfkOQUNIiDKVGtLnjtI';
// var key = process.env.GOOGLE_MAPS_API_SERVER_KEY;
console.log("key");
console.log(key);

var publicConfig = {
  key: key,
  stagger_time:       1000, // for elevationPath 
  encode_polylines:   false,
  secure:             true // use https 
  // proxy:              'http://127.0.0.1:9999' // optional, set a proxy for HTTP requests 
};
var gm = new GoogleMapsAPI(publicConfig);

function geocode(params) {
  
}

exports.locate = function(req, res) {
    // res.json("god damn");
    // console.log(res);
    // console.log(gm);
    var lat = req.body.origin.lat;
    var lng = req.body.origin.lng;
    var latLngO = lat+','+lng;

    var dest = req.body.destination;

    var params = {
      "address": dest
    };
    var arr = [];
    // var f = geocode(params);
    var callback = function(data) {
      res.json(data);
    }

    gm.geocode(params, function(err, result) {
    
      var loc = result.results[0].geometry.location;
      var latLngD = loc.lat + ','+loc.lng;
      console.log(latLngO);
      console.log(latLngD);
      var params = {
        origin: latLngO,
        destination: latLngD
      }
      gm.directions(params, function(err,data) {
        util.puts(JSON.stringify(data));
        callback(data);
        // console.log(data);
        // res.json(data);
      });

      // var dstLat = result.geometry.latitude;
      // arr.push(loc);
    })

    // GoogleMapsAPI.directions();
     // gm.directions('31.470656,74.412929', '31.470789,74.408619', function(err, data){util.puts(JSON.stringify(data));}),
    // console.log(req.body);
};
/**
 * Create a place
 */
exports.create = function (req, res) {
  var place = new Place(req.body);
  console.log("creating place");
  
  console.log("req.body");
  console.log(req.body);
  console.log("place inspect");
  console.log(place);
  place.user = req.user;

  place.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(place);
    }
  });
};

exports.find = function (req, res) {
  console.log("finding");

  if (isNaN(req.body.zip)) {
    // get isps
   

    // var cat = req.body.primaryCategory;
    var title = req.body.title;

    Place.find().
    // where('primaryCategory').equals(cat).exec(function(err,places) {
    //   if (err) {
    //     return res.status(400).send({
    //       message: errorHandler.getErrorMessage(err)
    //     });
    //   } else {
    //     console.log(places);
    //     res.json(places);
    //   }
    // });
    where('title').equals(title).exec(function(err,place) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        console.log(place);
        res.json(place);
      }
    });
  } else {
    console.log("zip code results");
    var zip = Number(req.body.zip);
    console.log(zip);
    Place.find().
    where('zip').equals(zip).exec(function(err,places) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(places);
      }
    });
  };


  








  // var zip = Number(req.body.zip);
  // console.log(zip);
  // Place.find().
  // where('zip').equals(zip).exec(function(err,places) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     res.json(places);
  //   }
  // });
  // Place.find().sort('-zip').exec(function (err, places) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     res.json(places);
  //   }
  // });
  // res.json(req.place);
};



exports.placeByQuery = function (req, res, next, query) {
  console.log(req.body);
  console.log("pbq");
  console.log(next);
  console.log("next");
  console.log(query);
};

/**
 * Show the current place
 */

exports.read = function (req, res) {
  res.json(req.place);
};

/**
 * Update a place
 */

exports.update = function (req, res) {
  console.log("update **");
    console.log(req.body);

  var place = req.place;
  console.log(place);

  place.name = req.body.name;
  place.url = req.body.url;
  place.caption = req.body.caption;
  place.category = req.body.category;
  place.description = req.body.description;
  place.address1 = req.body.address1;
  place.address2 = req.body.address2;
  place.city = req.body.city;
  place.zip = req.body.zip;
  place.state = req.body.state;
  place.latlng = req.body.latlng;
  // place.lat = req.body.lat;
  // place.lng = req.body.lng;
  place.location = req.body.location;
  place.phone = req.body.phone;
  // place.contactName = req.body.contactName;
  // place.contactEmail = req.body.contactEmail;
  // place.contactPhone = req.body.contactPhone;
  place.hoursOpen = req.body.hoursOpen;
  // place.offersWifi = req.body.offersWifi;
  // place.wifiTerms = req.body.wifiTerms;
  // place.offersCourses = req.body.offersCourses;
  // place.computerReseller = req.body.computerReseller;
  // place.iconMatcher = req.body.iconMatcher;


  place.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(place);
    }
  });

};

/**
 * Delete an place
 */

exports.delete = function (req, res) {
  var place = req.place;

  place.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(place);
    }
  });
};

/**
 * List of Places
 */
exports.list = function (req, res) {
  Place.find().sort('-created').populate('user', 'displayName').exec(function (err, places) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(places);
    }
  });
};

 

exports.measure = function (req, res) {
  var callbackDistance = function(response) {
      res.json(response);
  }

  console.log("measure");
  console.log(req.body);
  // var params = req.body.
  var oas = req.body.origin_addresses[0].lat + ","+req.body.origin_addresses[0].lng;
  console.log(oas);
  var ads = req.body.destination_addresses.toString();
  console.log(ads);
  // var buildString = function(array) {
  //   var i;
  //   for (i=0;i<array.length;array[i]) {
  //     ads + ","
  //   }
  // }

  var params1 = {
    latlng: oas
  }

  

  gm.reverseGeocode(params1, function(err,data) {
    // util.puts(JSON.stringify(data));
    // callback(data);
    var results = JSON.stringify(data.results[0].formatted_address);
    var r2 = results.replace(/ /g, "+");
  
   
    console.log("address lookup results");
    console.log(r2);
    var base_url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=";
    var origin = r2 + "&destinations=";
    var destinations  = "304+E+51st+St,Kansas+City,MO,64112" + "&key=" + key;
    var url = base_url + origin + destinations;
    console.log(url);
    var params2 = {
      origins: r2,
      destinations: ads
    }

    gm.distance(params2, function(err, data) {
      if (err) {
        console.log(err);
        return err;
      } else {
          console.log(data.rows[0].elements);
          callbackDistance(data.rows[0]);
      }
    
    })
    // request(url, function (error, response, body) {
    //   if (!error && response.statusCode == 200) {
    //     console.log(body) // Show the HTML for the Google homepage.
    //     res.json(body);
    //   }
    // })
  })


  // console.log(addressLookup);

  
  // https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=5050+Main+St+Kansas+City+MO+64112&destinations=304+E+51st+St,Kansas+City,MO,64112,5107+Main+St,Kansas+City,MO,64112&key=YOUR_API_KEY

  // gm.distance(params, function(err, result) {
    
    
      // gm.directions(params, function(err,data) {
      //   util.puts(JSON.stringify(data));
      //   callback(data);
      //   // console.log(data);
      //   // res.json(data);
      // });

      // var dstLat = result.geometry.latitude;
      // arr.push(loc);
    // })
  // Place.find().sort('-created').populate('user', 'displayName').exec(function (err, places) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     res.json(places);
  //   }
  // });
};


exports.match = function (req, res) {

  var lat = parseFloat(req.body.location.lat).toFixed(5);
  var lng = parseFloat(req.body.location.lng).toFixed(5);
  var loc = [{lat: lat, lng: lng}];
  console.log(loc);

  var cb = function(data) {
      res.json(data);
  }

  Place.find().
    where('location').equals(loc).exec(function(err,place) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        console.log(place);
        cb(place);
      }
    });
}





/**
 * Place middleware
 */
exports.placeByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Place is invalid'
    });
  }

  Place.findById(id).populate('user', 'displayName').exec(function (err, place) {
    if (err) {
      return next(err);
    } else if (!place) {
      return res.status(404).send({
        message: 'No place with that identifier has been found'
      });
    }
    req.place = place;
    next();
  });
};