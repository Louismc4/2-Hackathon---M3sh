var express = require('express'),
    router  = express.Router(), 
    admin   = require('firebase-admin'),
    geocoder= require('geocoder');
    
var db = admin.database();

//Location Route
router.post('/location', function(request, response){
    var outerKey = '';
    var id = '';
    var latitude = 0;
    var longitude = 0;
    var altitude;
    
    for(var key in request.body){
        outerKey = JSON.parse(key);
    }
    
    id = outerKey['id'];
    latitude = outerKey['latitude'];
    longitude = outerKey['longitude'];
    altitude = outerKey['altitude'];
    
    if((latitude === 0 && longitude === 0)  || altitude === undefined || id === ''){
        response.send("Error! Bad Values!");
    } else {
        geocoder.reverseGeocode(latitude, longitude, function ( err, data ) {
            if(err){
                response.send("Geocoding Error!");
            } else {
                if(data.results[0] != undefined){
                    db.ref('/users/' + id + '/location/').update({['latitude'] : latitude, ['longitude'] : longitude, 
                        ['altitude'] : altitude, ['address'] : data.results[0].formatted_address}).then(function(snapshot){
                            db.ref('/locations/' + id).update({['latitude'] : latitude, ['longitude'] : longitude, 
                            ['altitude'] : altitude, ['address'] : data.results[0].formatted_address}).then(function(snapshot){
                                response.send("We are sending help your way!");
                            }, function(error){
                                if(error){
                                    response.send(Error("Error Writing To Database!"));
                                } 
                            });
                    }, function(error){
                        if(error){
                            response.send(Error("Error Writing To Database!"));
                        } 
                    });
                } else {
                    response.send(Error("Geocoded Data Returned Undefined!"));
                }
            }
        });
    }
});

module.exports = router;