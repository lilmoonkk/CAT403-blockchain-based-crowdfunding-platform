

// 1 Initialization
var express = require('express');
var router = express.Router();
const firebase = require('../firebase');
const connection = require('../connection')
const ObjectId = require('mongodb').ObjectId; 
const database = connection.db('Project');
const projectdb = database.collection('ProjectDetails');
const contributiondb = database.collection('Contributions');
const contract = require('../web3/contract');

const multer = require('multer')
const upload = multer();

const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const storage = getStorage(firebase.app);

// 2 Get all projects
router.get('/projects', async function(req, res){
    let query = { status : 'Approved' };
    const body = await projectdb.find(query).toArray();
    //console.log(body[0].email) //it would output email of first object
    res.send(body);
});

router.get('/projects/admin', async function(req, res){
    const body = await projectdb.find({}).sort({ _id: -1 }).toArray();
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
router.post('/add',upload.single('images'), async function(req, res){
    let images = req.file;
    let body = req.body;
    try{
        const imageRef = ref(storage, 'projectimg/'+body.uid+body.name);
        // Step 2. Upload the file in the bucket storage
        uploadBytes(imageRef, images.buffer)
        .then(() => {
            return getDownloadURL(imageRef);
        })
        .then(url => {
            let payload = reorganizePayload(body, url)
            projectdb.insertOne(payload);
            res.sendStatus(200)
        })
        
    } catch (err) {
        console.log("Failed because", err);
        res.sendStatus(500)
    }
    //res.send(body)
});

function reorganizePayload(data, url){
    let project = JSON.parse(data.project);
    let milestones = JSON.parse(data.milestones)
    let result = {};
    for(let i = 0; i<milestones.length; i++){
        milestones[i]['seq'] = i+1;
        milestones[i]['amount'] = parseFloat(milestones[i]['amount']);
        milestones[i]['percentage'] = (parseFloat(milestones[i]['amount'])/parseFloat(project.totalfund)).toFixed(5);
    }
    result = {...project};
    result['image'] = url;
    result['uid'] = data.uid;
    result['milestone'] = milestones;
    result['link'] = project.name.toLowerCase().replace(/\s+/g, '-');
    result['current_mil'] = 1;
    result['status'] = 'Submitted';
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
        const body = await projectdb.findOne(query, { projection: {milestone:1, wallet_address:1, campaign_period: 1}});
        //console.log(body);
        //need to get address from cache
        
        await contract.createSmartContract({id: projectid, milestone: body.milestone}, function(value){
            //let update = { $set: { Approved: true, contract_address: contractAddr } };
            const current = new Date().getTime() + 8 * 60 * 60 * 1000;
            const duration = 1000 * 60 * 60 * 24 * body.campaign_period;
            const end = current + duration;
            projectdb.updateOne(query, { $set: { status: 'Approved', start: current, end: end, pledged: 0, contract_address: value } });
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
    let timestamp = new Date().getTime() + 8 * 60 * 60 * 1000;
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
    //console.log(result);
    res.send(result);
});

// 8 Get balance of a project
router.get('/:id/balance', async function(req, res){
    let projectid = req.params.id.toString();
    let query = { _id : new ObjectId(projectid) };
    const body = await projectdb.findOne(query, { projection: {contract_address:1}});
    let result = await contract.getBalance(body.contract_address);
    //console.log(result);
    res.send(result);
});

// 9 CLaim fund from smart contract
router.put('/claim', async function(req, res){
    let body = req.body;
    await contract.claim({contract_address:body.contract_address, caller_address:body.caller_address, milestoneseq:body.milestoneseq}, function(value){
        console.log('value',value)
        let timestamp = new Date().getTime() + 8 * 60 * 60 * 1000;
        projectdb.updateOne({ 'contract_address':body.contract_address, 'milestone.seq': body.milestoneseq}, { $set: { 'milestone.$.txhash': value, 'milestone.$.timestamp': timestamp } });
    });
    res.sendStatus(200);
});

router.get('/:uid/contributions', async function(req, res){
    let uid = req.params.uid.toString();
    let query = { uid : uid };
    try{
        //projectdb.updateOne(query, update);
        //After approval, smart contract for the project is created
        //const body = await contributiondb.find(query).toArray();
        const body = await contributiondb.aggregate([
            { $match: query },
            { $addFields: {
                convertedId: {$toObjectId: "$projectid"}
            }},
            { $lookup: {
                from: "ProjectDetails",
                localField: "convertedId",
                foreignField: "_id",
                as: "result"
            }},
            {
                $project: {
                  amount: 1,
                  project_name: { $arrayElemAt: ["$result.name", 0] },
                  time: { $toDate: ["$timestamp"]  },
                  txhash: 1,
                  link: { $arrayElemAt: ["$result.link", 0] },
                  projectid: 1,
                  milestone: { $arrayElemAt: ["$result.milestone", 0] }
                }
            },
            {
                $project: {
                    amount: 1,
                    project_name: 1,
                    time: { "$dateToString": { "format": "%Y-%m-%d %H:%M", "timezone" : "+08:00", "date": "$_id" } },
                    txhash: 1,
                    link: 1,
                    projectid: 1,
                    milestone: 1

                }
            }
        ]).toArray();
        res.send(body)
    } catch (err) {
        console.log("Failed because", err);
    }
})

module.exports = router;