

// 1 Initialization
var express = require('express');
var router = express.Router();
const connection = require('../connection')
const ObjectId = require('mongodb').ObjectId; 
const database = connection.db('Project');
const projectdb = database.collection('ProjectDetails');

// 2 Get all projects
router.get('/projects', async function(req, res){
    const body = await projectdb.find({}).toArray();
    //console.log(body[0].email) //it would output email of first object
    res.send(body);
});

// 3 Add project
router.post('/add', async function(req, res){
    let body = req.body;
    try{
        projectdb.insertOne(body);
    } catch (err) {
        console.log("Failed because ${err}");
    }
    res.send(body)
});

// 4 Update project
router.put('/:id/update', async function(req, res){
    let userid = req.params.id.toString();
    let body = req.body;
    let query = { _id : new ObjectId(userid) };
    let update = { $set: body };
    try{
        projectdb.updateOne(query, update);
    } catch (err) {
        console.log("Failed because", err);
    }
    res.send(body)
});

// 5 Approve project
router.put('/:id/approve', async function(req, res){
    let userid = req.params.id.toString();
    let query = { _id : new ObjectId(userid) };
    let update = { $set: { Approved: true } };
    try{
        projectdb.updateOne(query, update);
    } catch (err) {
        console.log("Failed because", err);
    }
    res.send(body)
});

module.exports = router;