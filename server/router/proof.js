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
        let imagesUrl = []
        let imagesHash = []
        images.forEach(element => {
            //console.log(element.buffer)
            //Store image to firestore and get URL
            // Step 1. Create reference for file name in cloud storage 
            const imageRef = ref(storage, 'proofs/'+element.originalname);
            // Step 2. Upload the file in the bucket storage
            uploadBytes(imageRef, element.buffer).then((snapshot) => {
                console.log('Uploaded a blob or file!');
                //console.log(snapshot)
                // Step 3. Grab the public url
                // Get the download URL
                getDownloadURL(imageRef)
                .then((url) => {
                // Insert url into an <img> tag to "download"
                    console.log(url)
                    imagesUrl.push(url);
                })
                
              });
            
            // Create a hash object
            const hash = crypto.createHash('sha256');

            // Update the hash with the image data
            hash.update(element.buffer);

            // Calculate the hash digest
            const hashDigest = hash.digest('hex');
            imagesHash.push(hashDigest);
            console.log('Image hash:', hashDigest);
            
        })
        
        //Store proof to database
        let payload = {
            projectid : body.projectid,
            imageUrl : imagesUrl,
            timestamp : new Date().getTime() + 8 * 60 * 60 * 1000
        }

        proofdb.insertOne(payload);

        //Organize proof payload for chain
        let payloadchain = []
        for (let i = 0; i < imagesHash.length; i++){
            payloadchain.push([i+1, imagesHash[i]])
        }
        //Store proof on chain
        await contract.uploadProof({contract_address: body.contract_address, owner_address: body.owner_address, milestone: body.milestone, proofs: payloadchain}, function(value){
            let update = { $set: { status: 'Waiting for proof approval'} };
            let query = { _id : new ObjectId(body.projectid) };
            projectdb.updateOne(query, update);
            console.log('txhash',value)
        });
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

function reorganizeImagesPayload(body){
    let result = {}

    result = {...body};
    result['timestamp'] = new Date().getTime() + 8 * 60 * 60 * 1000;

    return result
}

module.exports = router;