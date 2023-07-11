var express = require('express');
const request = require('request');
var router = express.Router();
const connection = require('../connection')
const database = connection.db('Project');
const projectdb = database.collection('ProjectDetails');
const contributiondb = database.collection('Contributions');
const userdatabase = connection.db('User');
const userdb = userdatabase.collection('UserDetails');
const proofdb = database.collection('Proof');
const contract = require('../web3/contract');
var schedule = require('node-schedule');


/*var date = new Date(new Date().getTime() +10000);
console.log(date)
var j = schedule.scheduleJob(date, function(){
  console.log('job is running');
});
var date = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
console.log(date)
var date = new Date(2012, 11, 21, 5, 30, 0);
console.log(date)
var date = new Date().getTime();
console.log(date)
*/
const rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 0;
//rule.second = null;
rule.tz = 'Asia/Kuala_Lumpur'
//var date = new Date(new Date().getTime() + 1000);
//Verify if campaigns are successfully funded
const verifySuccess = schedule.scheduleJob(rule, async function(){
    //console.log('This job runs every day at 9:00 AM in Malaysia timezone.');
    let query = { status : 'Approved' };
    const body = await projectdb.find(query).toArray();
    //const element =  await projectdb.findOne({_id: new ObjectId('649edd7a700d692f8e8012e0')})
    body.forEach(element => {
        //var day = 24 * 60 * 60 * 1000;
        //var now = new Date().getTime() + 8 * 60 * 60 * 1000;
        var end = new Date(element.end)
        /*const deadline = new Date(
            end.getFullYear(),
            end.getMonth(),
            end.getDate(),
            23,
            59,
            0
        ).getTime();*/
        const currentTime = new Date().getTime();
        if( end.getTime() <= currentTime ){
            let query = { _id : element._id };
            let update
            if(element.totalfund <= element.pledged){
                update = { $set: { status: 'Claimable' } };
            } else {
                update = { $set: { status: 'Unsuccessful' } };
                returnAllFund(element._id.toString())
            }
            try{
                projectdb.updateOne(query, update);
            } catch (err) {
                console.log("Failed because", err);
            }
        }
    });
});

async function returnAllFund(projectid){
    let query = { projectid : projectid };
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
              contract_address: { $arrayElemAt: ["$result.contract_address", 0] },
              caller_address: 1,
              amount: 1,
              uid: { $arrayElemAt: ["$result.uid", 0] },
            }
        },
        {
            $project: {
                contract_address: 1,
                caller_address: 1,
                amount: 1,
                uid: 1
            }
        }
    ]).toArray();
    body.forEach(async(element) => {
        //console.log(element)
        // To get wallet address of project owner
        //const userbody = await userdb.findOne({ _id : element.uid }, {projection: {wallet_address: 1}});

        // To transfer remaining fund
        contract.transfer({contract_address: element.contract_address, caller_address: element.caller_address, revaddress : element.caller_address, amount : element.amount}, function(value){
            let query = { _id : element._id };
            let update = { $set: { status: 'All returned' } }
            try{
                contributiondb.updateOne(query, update);
                
            } catch (err) {
                console.log("Failed because", err);
            }
        });
        //console.log(userbody)
    })
}

async function returnHalfFund(projectid){
    let query = { projectid : projectid };
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
              contract_address: { $arrayElemAt: ["$result.contract_address", 0] },
              caller_address: 1,
              amount: 1,
              uid: { $arrayElemAt: ["$result.uid", 0] },
              currentmil: { $arrayElemAt: ["$result.current_mil", 0] },
              milestones: { $arrayElemAt: ["$result.milestone", 0] },
            }
        },
        {
            $project: {
                contract_address: 1,
                caller_address: 1,
                amount: 1,
                uid: 1,
                currentmil: 1,
                milestones: 1
            }
        }
    ]).toArray();
    //console.log(body[0].milestones)
    body.forEach(async(element) => {
        //console.log(element)
        // Get the remaining percentage
        let remaining = 1
        for (let i=0; i<element.currentmil; i++){
            remaining = remaining - element.milestones[i].percentage
        }

        // Calculate how much should be returned
        let amount = element.amount * remaining;

        // To get wallet address of project owner
        //const userbody = await userdb.findOne({ _id : element.uid }, {projection: {wallet_address: 1}});

        // Transfer remaining fund
        contract.transfer({contract_address: element.contract_address, caller_address: element.caller_address, revaddress : element.caller_address, amount : amount.toFixed(5)}, function(value){
            let query = { _id : element._id };
            let update = { $set: { status: 'Half returned' } }
            console.log('returned successfully')
            try{
                contributiondb.updateOne(query, update);
                
            } catch (err) {
                console.log("Failed because", err);
            }
        });
    })
}

// Verify approval of proof of completion
const verifyComplete = schedule.scheduleJob(rule, async function(){
    let query = { status : 'Pending' };
    const body = await proofdb.find(query).toArray();
    
    body.forEach(element => {
        var end = new Date(element.end)
        /*const deadline = new Date(
            end.getFullYear(),
            end.getMonth(),
            end.getDate(),
            23,
            59,
            0
        ).getTime();*/
        const currentTime = new Date().getTime();
        if( end.getTime() <= currentTime ){
            const options = {
                url: 'http://localhost:3001/proof/conclude',
                method: 'PUT',
                json: true,
                body: { 
                    milestone: element.milestone,
                    pid: element.projectid
                }
            };
            request.put(options, (error, response, body) => {
                if (error) {
                  // Handle any errors that occur during the request
                  console.error(error);
                } else {
                  // Handle the response from the PUT request
                  console.log(body);
                  if(body){
                    //Approve
                  }else{
                    //Reject
                    returnHalfFund(element.projectid)
                  }
                }
            });
        }
    })
        
})


router.put('/:pid/test', async function(req, res){
    let pid = req.params.pid.toString();
    returnAllFund(pid)
    res.sendStatus(200)
});

module.exports = router;