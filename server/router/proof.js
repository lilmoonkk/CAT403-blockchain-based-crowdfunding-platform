// 1 Initialization
var express = require('express');
var router = express.Router();
const firebase = require('../firebase');
const connection = require('../connection')
const ObjectId = require('mongodb').ObjectId;
const database = connection.db('Project');
const proofdb = database.collection('Proof');
const projectdb = database.collection('ProjectDetails');
const responsedb = database.collection('Response');
const contract = require('../web3/contract');


const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const storage = getStorage(firebase.app);
const storageRef = ref(storage, 'proofs');

const multer = require('multer')

//const upload = multer({ dest: 'images/' });
const upload = multer();

const crypto = require('crypto');

router.post('/add', upload.array('images', 10), async function(req, res){
    let images = req.files;
    let body = req.body;
    //console.log(req.body)
    
    try{
        const promises = [];
        let imagesURL = []
        let imagesHash = []
        //let imagesHash = ""
        images.forEach(element => {
            //console.log(element.buffer)
            //Store image to firestore and get URL
            // Step 1. Create reference for file name in cloud storage 
            const imageRef = ref(storage, 'proofs/'+element.originalname);
            // Step 2. Upload the file in the bucket storage
            const p = uploadBytes(imageRef, element.buffer)
            .then(() => {
                return getDownloadURL(imageRef);
            })
            .then(url => {
                /*let payload = {
                    projectid: body.projectid,
                    imageUrl: url,
                    timestamp: new Date().getTime() + 8 * 60 * 60 * 1000,
                    milestone: parseInt(body.milestone)
                };

                return proofdb.insertOne(payload);*/
                imagesURL.push(url)
                // Create a hash object
                const hash = crypto.createHash('sha256');

                // Update the hash with the image data
                hash.update(url);
                // Calculate the hash digest
                const hashDigest = hash.digest('hex');
                imagesHash.push(hashDigest);
                //imagesHash += hashDigest
            })
            /*.then(result => {
                imagesId.push(result.insertedId.toString());
            });*/
            
            promises.push(p);
/*
            // Create a hash object
            const hash = crypto.createHash('sha256');

            // Update the hash with the image data
            hash.update(element.buffer);

            // Calculate the hash digest
            const hashDigest = hash.digest('hex');
            imagesHash.push(hashDigest);*/
            //imagesHash += hashDigest
            //console.log('Image hash:', hashDigest);
            
        })
        
        let allImagesHash
        Promise.all(promises)
        .then(() => {
            // Create a hash object
            const hash = crypto.createHash('sha256');

            // Update the hash with the image data
            hash.update(imagesHash.join());

            // Calculate the hash digest
            allImagesHash = hash.digest('hex');
            //imagesHash.push(hashDigest);
            
            console.log('Image hash:', allImagesHash);
            /*let payloadchain = []
            for (let i = 0; i < imagesHash.length; i++){
                payloadchain.push([imagesId[i], imagesHash[i]])
            }
            console.log('payloadchain',payloadchain)*/
            const current = new Date().getTime() //+ 8 * 60 * 60 * 1000;
            const duration = 1000 * 60 * 60 * 24 * 3; // 3 days period to get approval
            const end = current + duration;
            let payload = {
                projectid: body.projectid,
                imageUrl: imagesURL,
                timestamp: current,
                milestone: parseInt(body.milestone),
                end: end,
                status: 'Pending'
            };

            return proofdb.insertOne(payload);
        }).then(() => {
            contract.uploadProof(
                {
                contract_address: body.contract_address,
                owner_address: body.owner_address,
                milestone: body.milestone,
                proofs: allImagesHash
                },
                function (value) {
                let update = { $set: { status: 'Waiting for proof approval' } };
                let query = { _id: new ObjectId(body.projectid) };
                projectdb.updateOne(query, update);
                console.log('txhash', value);
                }
            )
            res.sendStatus(200);
        })
            /*return Promise.all([
            Promise.resolve(imagesURL),
            contract.uploadProof(
                {
                contract_address: body.contract_address,
                owner_address: body.owner_address,
                milestone: body.milestone,
                proofs: allImagesHash
                },
                function (value) {
                let update = { $set: { status: 'Waiting for proof approval' } };
                let query = { _id: new ObjectId(body.projectid) };
                projectdb.updateOne(query, update);
                console.log('txhash', value);
                }
            )
            ]);
        })
        res.sendStatus(200);*/
        
    } catch (err) {
        console.log("Failed because", err);
        res.send(body)
    }
    //res.send(body)
    
});

router.get('/:id/proofs', async function(req, res){
    let pid = req.params.id.toString();
    let query = { projectid : pid };
    try{
        //projectdb.updateOne(query, update);
        //After approval, smart contract for the project is created
        const body = await proofdb.find(query).toArray();
        const projectbody = await projectdb.findOne({ _id : new ObjectId(pid) }, {projection: {milestone: 1}})
        const milestone = projectbody.milestone
        let result = {}
        body.forEach(element => {
            //result[element.milestone] = result[element.milestone] || [];
            //result[element.milestone].push(element);
            //console.log(element)
            result[element.milestone] = element.imageUrl
            if(element.status == 'Pending'){
                result[0] = {milestone:element.milestone, end:element.end}
            }
        })
        /*result[0] = [] //to record approval of each milestone
        for (let i=0; i<milestone.length; i++){
            if(!result[i+1]){
                break
            }
            if(milestone[i].approved){
                //console.log(milestone[i].approved)
                result[0].push(milestone[i].approved)
            }
        }*/
        //console.log(result)
        res.send(result)
    } catch (err) {
        console.log("Failed because", err);
    }
});

router.post('/approve', async function(req, res){
    let body = req.body;
    try{
        responsedb.insertOne(body);
    } catch (err) {
        console.log("Failed because", err);
    }
    res.send(body)
});

router.post('/reject', async function(req, res){
    let body = req.body;
    try{
        responsedb.insertOne(body);
    } catch (err) {
        console.log("Failed because", err);
    }
    res.send(body)
});

router.put('/conclude', async function(req, res){
    let body = req.body
    concludeApproval(body.milestone, body.pid)
    res.sendStatus(200)
});

async function concludeApproval(milestone, pid){
    let query = { projectid : pid, milestone: milestone };
    try{
        const body = await responsedb.find(query).toArray();
        let approve = 0
        let reject = 0
        let s = ""
        // Count the result
        body.forEach(element => {
            //Generate hashing material
            s += element.uid
            s += element.approved

            if(element.approved){
                approve += 1
            } else {
                reject += 1
            }
        })
        // Conclude the result
        let overall = approve + reject
        let approved = false
        if(approve >= (overall / 3 * 2)){
            approved = true
            projectdb.updateOne({ _id : new ObjectId(pid) }, {$set: {"milestone.$[elem].approved": approved, "current_mil": milestone+1}},{arrayFilters: [{ "elem.seq": milestone }]});
            proofdb.updateOne({ projectid : pid, milestone: parseInt(milestone) }, {$set: {status: 'Approved'}});
            const addresses = await projectdb.findOne({_id: new ObjectId(pid)}, {projection: {contract_address: 1, owner_address: 1}});
            s = approved + s
            // Generate hash string
            const hash = crypto.createHash('sha256');

            // Update the hash with the image data
            hash.update(s);

            // Calculate the hash digest
            const hashDigest = hash.digest('hex');
            console.log('hash', hashDigest)
            contract.uploadResponse(
                {
                contract_address: addresses.contract_address,
                owner_address: addresses.owner_address,
                milestone: milestone,
                response: hashDigest,
                approved: approved
                },
                function (value) {
                console.log('txhash', value);
                }
            )

        } else {
            projectdb.updateOne({ _id : new ObjectId(pid) }, {$set: {"milestone.$[elem].approved": approved, status: 'Milestone Rejected'}},{arrayFilters: [{ "elem.seq": milestone }]});
            proofdb.updateOne({ projectid : pid, milestone: parseInt(milestone) }, {$set: {status: 'Rejected'}});
        }
    } catch (err) {
        console.log("Failed because", err);
    }

}

router.get('/verify/:pid/:milestone', async function(req, res){
    // Verify proof
    let pid = req.params.pid.toString();
    let milestone = parseInt(req.params.milestone);
    let query = { projectid : pid, milestone: milestone };
    const proof = await proofdb.findOne(query);
    const imageUrl = proof.imageUrl
    let proofsame
    let responsesame
    //Organise proof
    let imageHash = []
    for(let i = 0; i<imageUrl.length; i++){
        const hash = crypto.createHash('sha256');

        // Update the hash with the image data
        hash.update(imageUrl[i]);
        //console.log(imageUrl[i])
        // Calculate the hash digest
        const hashDigest = hash.digest('hex')
        imageHash.push(hashDigest)
    }
    //console.log(imageHash.join())
    //const hash = createHash(imageHash.join())
    //console.log(hash)
    //res.sendStatus(200)
    
    await createHash(imageHash.join()).then(async(hash) => {
        // Use the resolved hash here
        //console.log(hash)
        query = { _id : new ObjectId(pid) };
        const body = await projectdb.findOne(query, { projection: {contract_address:1}});
        let compareresult = await contract.getProof({contract_address:body.contract_address, milestone: milestone});
        proofsame = (hash==compareresult)
    });

    //Verify response
    const response = await responsedb.find(query).toArray();
    let approve = 0
    let reject = 0
    let s = ""
    // Count the result
    response.forEach(element => {
        //Generate hashing material
        s += element.uid
        s += element.approved

        if(element.approved){
            approve += 1
        } else {
            reject += 1
        }
    })
    // Conclude the result
    let overall = approve + reject
    let approved = false
    if(approve >= (overall / 3 * 2)){
        approved = true
        s = approved + s
        await createHash(s).then(async(hash) => {
            // Use the resolved hash here
            console.log(hash)
            query = { _id : new ObjectId(pid) };
            const body = await projectdb.findOne(query, { projection: {contract_address:1}});
            let compareresult = await contract.getResponse({contract_address:body.contract_address, milestone: milestone});
            responsesame = (hash==compareresult)
        });

    }
    if(proofsame && responsesame){
        res.send(true)
    }else{
        res.send(false)
    }
    
})

async function createHash(body){
    // Create a hash object
    const hash = crypto.createHash('sha256');
    // Update the hash with the image data
    hash.update(body);
    // Calculate the hash digest
    return hash.digest('hex')
}

module.exports = router;