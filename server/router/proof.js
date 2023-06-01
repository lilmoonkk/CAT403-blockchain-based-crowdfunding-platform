// 1 Initialization
var express = require('express');
var router = express.Router();
const firebase = require('../firebase');
const connection = require('../connection')
const ObjectId = require('mongodb').ObjectId;
const database = connection.db('Project');
const proofdb = database.collection('Proof');
const projectdb = database.collection('ProjectDetails');
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
        let imagesId = []
        let imagesHash = []
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
                let payload = {
                    projectid: body.projectid,
                    imageUrl: url,
                    timestamp: new Date().getTime() + 8 * 60 * 60 * 1000,
                    milestone: body.milestone
                };

                return proofdb.insertOne(payload);
            })
            .then(result => {
                imagesId.push(result.insertedId.toString());
            });
            
            promises.push(p);

            // Create a hash object
            const hash = crypto.createHash('sha256');

            // Update the hash with the image data
            hash.update(element.buffer);

            // Calculate the hash digest
            const hashDigest = hash.digest('hex');
            imagesHash.push(hashDigest);
            console.log('Image hash:', hashDigest);
            
        })
        
        

        Promise.all(promises)
        .then(() => {
            let payloadchain = []
            for (let i = 0; i < imagesHash.length; i++){
                payloadchain.push([imagesId[i], imagesHash[i]])
            }
            console.log('payloadchain',payloadchain)
            return Promise.all([
            Promise.resolve(imagesId),
            contract.uploadProof(
                {
                contract_address: body.contract_address,
                owner_address: body.owner_address,
                milestone: body.milestone,
                proofs: payloadchain
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
        /*
            1. Reorganize payload
            2. MOdify smart contract change uint to string for id
            3. from account
        */
        res.sendStatus(200);
        
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
        let result = {}
        body.forEach(element => {
            result[element.milestone] = result[element.milestone] || [];
            result[element.milestone].push(element);
        })
        res.send(result)
    } catch (err) {
        console.log("Failed because", err);
    }
});



module.exports = router;