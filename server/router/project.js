

// 1 Initialization
var express = require('express');
var router = express.Router();
const connection = require('../connection')
const ObjectId = require('mongodb').ObjectId; 
const database = connection.db('Project');
const projectdb = database.collection('ProjectDetails');
const contract = require('../web3/contract');

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

function reorgranizePayload(data){
    
}

// 4 Update project
router.put('/:id/update', async function(req, res){
    let projectid = req.params.id.toString();
    let body = req.body;
    let query = { _id : new ObjectId(projectid) };
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
    let projectid = req.params.id.toString();
    let query = { _id : new ObjectId(projectid) };
    try{
        //projectdb.updateOne(query, update);
        //After approval, smart contract for the project is created
        const body = await projectdb.findOne(query, { projection: {milestone:1, wallet_address:1}});
        //console.log(body);
        //need to get address from cache
        await contract.createSmartContract({id: projectid, milestone: body.milestone}, function(value){
            //let update = { $set: { Approved: true, contract_address: contractAddr } };
            projectdb.updateOne(query, { $set: { approved: true, contract_address: value } });
        }); //get projectid, milestone and wallet address and fing variable for array of objects
        
        res.sendStatus(200);
    } catch (err) {
        console.log("Failed because", err);
    }
});

module.exports = router;