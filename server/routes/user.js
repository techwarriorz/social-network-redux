var express = require('express');
var router = express.Router();
var db = require('../database/database')
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.use(function(req,res,next){
    var token = req.headers['auth-token'];
    jwt.verify(token, process.env.SECRET, function(err, decoded){
        if (err){
            res.status(400).send("The token is invalid");
        } else {
            console.log("This is the users ID", decoded.id);
            req.user_id = decoded.id;
            next();
        }
    })
});

//GET ENDPOINTS
router.get('/get_friends', function(req, res){
    var query = "SELECT * FROM user_friends WHERE user_id=" + req.user_id;
    db.query(query).spread(function(result, metadata){
        res.json({
            data: result
        });
    }).catch(function(err){
        res.status(500).send(err);
    })
});
router.get('/get_friend_requests', function(req, res){
    console.log("this is the user's ID " + req.user_id);
    var query = "SELECT * FROM user_friend_requests WHERE received_id=" + req.user_id + " AND status='pending'";
    
    db.query(query).spread(function(result, metadata){
        res.json({
            data: result
        })
    }).catch(function(err){
        res.status(500).send("Unable to get friend requests at this time")
    });
});
router.get('/get_users_by_quantity', function(req, res){
    var query = "SELECT id, username, first_name, last_name FROM users WHERE id != " + req.user_id;
    
    db.query(query).spread(function(result, metadata){
        res.json({
            data: result
        });
    }).catch(function(err){
        res.status(500).send("unable to query DB at this time");
    })
})

//POST ENDPOINTS
router.post('/request_friend', function(req, res){
    //Check to see if a request has already been sent... OR if they are already friends
    var query =  "SELECT * FROM user_friend_requests WHERE sender_id=" + req.user_id + " AND received_id=" + req.body.received_id;
    
    db.query(query).spread(function(result, metadata){
       if (result.length === 0){
           insertRequest();
       }
    }).catch(function(err){
        res.status(500).send(err);
    });
    
    function insertRequest(){
        var query = "INSERT INTO user_friend_requests (sender_id, received_id, status) VALUES(" + req.user_id + "," + req.body.received_id + ",'pending')";
        
        db.query(query).spread(function(result, metadata){
            res.status(200).send("Friend Request Created Successfully.")
        }).catch(function(err){
            res.status(500).send(err)
        })
    }
    
});
router.post('/request_friend_respond', function(req, res){
    //Check To See if the Request even exists
    var query = "SELECT * FROM user_friend_requests WHERE id=" + req.body.request_id;
    var senderId;
    var receivedId;
    
    db.query(query).spread(function(result, metadata){
        if (result.length > 0){
            senderId = result[0].sender_id;
            receivedId = result[0].received_id;
            updateRequest();
        } else {
            res.status(400).send("Request Doesn't Exist :(")
        }
    });
    
    function updateRequest(){
        var isAccepted = req.body.confirmation === 'confirmed';
        var query;
        
        if(isAccepted){
            query = "UPDATE user_friend_requests SET status='confirmed' WHERE id=" + req.body.request_id;
        } else {
            query = "DELETE FROM user_friend_requests WHERE id=" + req.body.request_id;
        }
        
        db.query(query).spread(function(){
            if (isAccepted){
                performSenderInsert();
            } else {
                res.status(200).send("We have successfully deleted the request.")
            }
        }).catch(function(){
            res.status(400).send("Unable to process Update to User_Friend_Requests at this time")
        })
    }
    
    function performSenderInsert(){
        var query = "INSERT INTO user_friends (user_id, friend_id, date_friended) VALUES (" + senderId + ", " + receivedId + ", now())";
        
        db.query(query).spread(function(){
            performReceiverInsert();
        }).catch(function(){
            res.status(500).send("Unable to send a friend request at this time.")
        })
    }
    
    function performReceiverInsert(){
        var query = "INSERT INTO user_friends (user_id, friend_id, date_friended) VALUES (" + receivedId + ", " + senderId + ", now())";
        
        db.query(query).spread(function(){
            res.status(200).send("The user was successfully confirmed")
        }).catch(function(){
            res.status(500).send("Unable to send a friend request at this time.")
        })
    }
    
});


module.exports = router;