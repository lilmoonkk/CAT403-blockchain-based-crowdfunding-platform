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
            })
            /*.then(result => {
                imagesId.push(result.insertedId.toString());
            });*/
            
            promises.push(p);

            // Create a hash object
            const hash = crypto.createHash('sha256');

            // Update the hash with the image data
            hash.update(element.buffer);

            // Calculate the hash digest
            const hashDigest = hash.digest('hex');
            imagesHash.push(hashDigest);
            //imagesHash += hashDigest
            //console.log('Image hash:', hashDigest);
            
        })
        
        // Create a hash object
        const hash = crypto.createHash('sha256');

        // Update the hash with the image data
        hash.update(imagesHash.join());

        // Calculate the hash digest
        const allImagesHash = hash.digest('hex');
        //imagesHash.push(hashDigest);
        
        console.log('Image hash:', allImagesHash);
        Promise.all(promises)
        .then(() => {
            /*let payloadchain = []
            for (let i = 0; i < imagesHash.length; i++){
                payloadchain.push([imagesId[i], imagesHash[i]])
            }
            console.log('payloadchain',payloadchain)*/
            let payload = {
                projectid: body.projectid,
                imageUrl: imagesURL,
                timestamp: new Date().getTime() + 8 * 60 * 60 * 1000,
                milestone: parseInt(body.milestone)
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
        })
        result[0] = [] //to record approval of each milestone
        for (let i=0; i<milestone.length; i++){
            if(!result[i+1]){
                break
            }
            if(milestone[i].approved){
                //console.log(milestone[i].approved)
                result[0].push(milestone[i].approved)
            }
        }
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
            const addresses = await projectdb.findOne({_id: new ObjectId(pid)}, {projection: {contract_address: 1, owner_address: 1}});

            // Generate hash string
            const hash = crypto.createHash('sha256');

            // Update the hash with the image data
            hash.update(s);

            // Calculate the hash digest
            const hashDigest = hash.digest('hex');
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
            projectdb.updateOne({ _id : new ObjectId(pid) }, {$set: {"milestone.$[elem].approved": approved}},{arrayFilters: [{ "elem.seq": milestone }]});
        }
    } catch (err) {
        console.log("Failed because", err);
    }

}

module.exports = router;