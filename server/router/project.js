

// 1 Initialization
var express = require('express');
var router = express.Router();
const connection = require('../connection')
const ObjectId = require('mongodb').ObjectId; 
const database = connection.db('Project');
const projectdb = database.collection('ProjectDetails');
const contributiondb = database.collection('Contributions');
const contract = require('../web3/contract');

// 2 Get all projects
router.get('/projects', async function(req, res){
    const body = await projectdb.find({}).toArray();
    //console.log(body[0].email) //it would output email of first object
    res.send(body);
});

// 3 Get individual project
router.get('/:link', async function(req, res){
    let projectid = req.params.link.toString();
    let query = { link : projectid };
    try{
        //projectdb.updateOne(query, update);
        //After approval, smart contract for the project is created
        const body = await projectdb.findOne(query);
        res.send(body)
    } catch (err) {
        console.log("Failed because", err);
    }
});

// 4 Add project
router.post('/add', async function(req, res){
    let body = req.body;
    try{
        let payload = await reorganizePayload(body)
        //console.log(payload)
        projectdb.insertOne(payload);
    } catch (err) {
        console.log("Failed because", err);
    }
    res.send(body)
});

function reorganizePayload(data){
    let result = {};
    for(let i = 0; i<data.milestones.length; i++){
        data.milestones[i]['seq'] = i+1;
        data.milestones[i]['amount'] = parseFloat(data.milestones[i]['amount']);
    }
    result = {...data.project};
    result['uid'] = data.uid;
    result['milestone'] = data.milestones;
    result['link'] = data.project.name.toLowerCase().replace(/\s+/g, '-');
    result['current_mil'] = 1;
    //delete data.milestones;
    return result;
}

// 5 Update project
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

// 6 Approve project and a smart contract is created
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

// 7 Get individual's projects
router.get('/:id/projects', async function(req, res){
    let uid = req.params.id.toString();
    let query = { uid : uid };
    try{
        //projectdb.updateOne(query, update);
        //After approval, smart contract for the project is created
        const body = await projectdb.find(query).toArray();
        res.send(body)
    } catch (err) {
        console.log("Failed because", err);
    }
});

// 7 Pledge to a project
router.put('/pledge', async function(req, res){
    let body = req.body;
    let timestamp = new Date().getTime();
    await contract.pledge({contract_address:body.contract_address, caller_address:body.caller_address, pledge:body.pledge}, function(value){
        contributiondb.insertOne({
            uid: body.uid,
            projectid: body.projectid,
            caller_address: body.caller_address,
            amount: body.pledge,
            timestamp: timestamp,
            txhash: value
        }) 
        projectdb.updateOne({ _id : new ObjectId(body.projectid) }, {$inc:{pledged:Number(body.pledge)}});
    });
    res.sendStatus(200);
});

// 8 Get total pledge amount to a project
router.get('/:id/pledged', async function(req, res){
    let projectid = req.params.id.toString();
    let query = { _id : new ObjectId(projectid) };
    const body = await projectdb.findOne(query, { projection: {contract_address:1}});
    let result = await contract.getPledged(body.contract_address);
    console.log(result);
    res.sendStatus(200);
});

// 9 CLaim fund from smart contract
router.put('/claim', async function(req, res){
    let body = req.body;
    await contract.claim({contract_address:body.contract_address, caller_address:body.caller_address, milestoneseq:body.milestoneseq}, function(value){
        console.log('value',value)
        let timestamp = new Date().getTime();
        projectdb.updateOne({ 'contract_address':body.contract_address, 'milestone.seq': body.milestoneseq}, { $set: { 'milestone.$.txhash': value, 'milestone.$.timestamp': timestamp } });
    });
    res.sendStatus(200);
});

module.exports = router;