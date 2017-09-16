var express      = require('express'),
    app          = express(),
    session      = require('express-session'),
    admin        = require("firebase-admin"),
    bodyParser   = require("body-parser");
    
//0Configurations-------------------------------------------------------------->
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.use(session({
    cookieName: 'session',
    secret: "Secret Louis P3P",
    resave: false,
    saveUninitialized: false,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    secure : true
}));

var serviceAccount = require("./private/m3sh-b7ea3-firebase-adminsdk-69vmv-ee19cdb948");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://m3sh-b7ea3.firebaseio.com"
});
//0Middleware------------------------------------------------------------------>

//0Routes---------------------------------------------------------------------->
var indexRoute = require('./routes/main/index'),
    facebookRoute = require('./routes/apis/facebook'),
    locationRoute = require('./routes/apis/location');

app.use(indexRoute);
app.use(facebookRoute);
app.use(locationRoute);

app.get('/', function(request, response){
   console.log('XD'); 
});

app.get('*', function(request, response){
    response.send(":(");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Started!");
});