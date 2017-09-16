var express = require('express'),
    router  = express.Router();    

//Main Page Routes
router.get("/", function(request, response){
    // response.render("../views/main/index");
});

module.exports = router;