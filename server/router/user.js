/*
1 Initialization
2 Get all users
3 Add user
4 Update user
*/

// 1 Initialization
var express = require('express');
var router = express.Router();
const connection = require('../connection')
const ObjectId = require('mongodb').ObjectId; 
const database = connection.db('User');
const userdb = database.collection('UserDetails');
const firebase = require('../firebase');

// 2 Get all users
router.get('/users', async function(req, res){
    const body = await userdb.find({}).toArray();
    //console.log(body[0].email) //it would output email of first object
    res.send(body);
});

// 3 Add user
router.post('/add', async function(req, res){
    let body = req.body;
    //console.log(body)
    try{
        await firebase.createUser(body.email, body.password, function(value){
            //insert uid to database along with other data
            body._id = value;
            delete body.password;
            userdb.insertOne(body);
            res.send(value);
        });
    } catch (err) {
        console.log("Failed because ",err);
    }
});

router.post('/login', async function(req, res){
    let body = req.body;
    //console.log(body)
    try{
        await firebase.signInUser(body.email, body.password, function(value){
            //insert uid to database along with other data
            res.send(value);
        });
    } catch (err) {
        console.log("Failed because ",err);
    }
    
});

router.post('/signout', async function(req, res){
    //console.log(body)
    try{
        await firebase.signOutUser()
    } catch (err) {
        console.log("Failed because ",err);
    }
    res.sendStatus(200);
});

// 4 Update user
router.put('/:id/update', async function(req, res){
    let userid = req.params.id.toString();
    let body = req.body;
    let query = { _id : userid };
    let update = { $set: body };
    try{
        userdb.updateOne(query, update);
    } catch (err) {
        console.log("Failed because", err);
    }
    res.send(body)
});

module.exports = router;