var express = require('express'),
    router  = express.Router(),
    admin   = require("firebase-admin");
    
var db = admin.database();    
  
router.get("/3dmodel", function(request, response){
    db.ref('/locations/').once('value', function(snapshot) {
        var locArray = [];
        for(var key in snapshot.val()){
            var dataObj = {
                id : key,
                data : snapshot.val()[key]
            }
            locArray.push(dataObj);
        }
        response.render('../views/3dmodel/3dmodel', {locationArray : locArray});
    }, function(error){
        if(error){
            response.redirect('/');
        }
    });
});

router.get("/locationdata", function(request, response){
    db.ref('/locations/').once('value', function(snapshot) {
        var locArray = [];
        for(var key in snapshot.val()){
            var dataObj = {
                id : key,
                data : snapshot.val()[key]
            }
            locArray.push(dataObj);
        }
        response.send(locArray);
    }, function(error){
        if(error){
            response.redirect('/');
        } 
    });
});

module.exports = router;