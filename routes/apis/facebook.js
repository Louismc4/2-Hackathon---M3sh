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
                    ['status'] : "Safe",
                    ['auth_token'] : token
                }
                db.ref('/users/').update({[id] : dataObj}).then(function(snapshot){
                }, function(error){
                    if(error){
                        response.send(Error(error));
                    }
                });
            }
        }
    });
});

router.post("/statusupdate", function(request, response){
    var outerKey = '';
    var id = '';
    var username = '';
    var status = 0;
    var token = '';
    
    for(var key in request.body){
        outerKey = JSON.parse(key);
    }
    
    id = outerKey['id'];
    username = outerKey['username'];
    status = outerKey['status'];
    token = outerKey['token'];
    
    graph.setAccessToken(token);
    
    var statusString = '';
    
    if (status == 0){
        statusString = 'Needs Assistance';
    } else if (status == 1){
        statusString = 'Safe';
    }
    db.ref('/users/' + id + '/').update({'status' : statusString}).then(function(napshot){
        db.ref('/users/' + id + '/location').once('value').then(function(snapshot){
            var msg = username + " Status Update : In need of help. \n Address : " + snapshot.val().address + ". \n Latitude : " + snapshot.val().latitude + ".\n Longitude :  " + snapshot.val().longitude + ".\n Altitude : " + snapshot.val().altitude;
            var wallPost = {
              message: msg
            }
            graph.post("/feed/?privacy={'value':'SELF'}", wallPost, function(err, res) {
                if(err){
                    console.log(err);
                    response.send(Error(err));
                    return
                } else {
                    // returns the post id 
                    console.log(res); // { id: xxxxx} 
                    response.send({id : id, msg : "Hang on " + username + ". First responders are on their way."});
                }
            });
        }, function(error){
            if(error){
                response.send(Error(error));
            }
        });
    });
});

module.exports = router;