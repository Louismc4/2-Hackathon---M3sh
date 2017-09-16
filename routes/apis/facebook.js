var express = require('express'),
    router  = express.Router(),
    admin   = require('firebase-admin'),
    graph   = require('fbgraph');

//Main Page Routes
router.get("/facebook", function(request, response){
    var innerObj = '';
    var token = '';
    var id = '';
    var username = '';
    var email = '';
    var picture = '';
    
    for(var key in request.body){
        innerObj = JSON.parse(key);
    }
    // response.render("../views/main/index");
});

router.get("/leapmotion", function(request, response){
    response.send("csaba");
});

module.exports = router;