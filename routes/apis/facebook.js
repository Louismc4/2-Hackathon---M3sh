var express = require('express'),
    router  = express.Router(),
    admin   = require('firebase-admin'),
    graph   = require('fbgraph');

var db = admin.database();

//Facebook Page Routes
router.post("/facebook", function(request, response){
    var outerKey = '';
    var id = '';
    var email = '';
    var username = '';
    var picture = '';
    var token = '';
    
    for(var key in request.body){
        outerKey = JSON.parse(key);
    }
    
    id = outerKey['id'];
    email = outerKey['email'];
    username = outerKey['username'];
    token = outerKey['token'];
    
    graph.setAccessToken(token);
    
    graph.get("me" + "/?fields=picture", function(error, resp) {
        if(error){
            console.log(error);
            response.send(Error(error));
        } else {
            picture = resp.picture.data.url;
            if(id === '' || token === ''){
                response.send("Error! Bad Values!");
            } else {
                var dataObj = {
                    ['id'] : id,
                    ['email'] : email,
                    ['username'] : username,
                    ['picture'] : picture,
                    ['auth_token'] : token
                }
                db.ref('/users/').update({[id] : dataObj}).then(function(snapshot){
                    response.send("Success!");
                }, function(error){
                    if(error){
                        response.send(Error(error));
                    }
                });
            }
        }
    });
});

router.get("/leapmotion", function(request, response){
    console.log(request.body);
    response.send("csaba");
});

module.exports = router;