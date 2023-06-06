var express = require('express');
var router = express.Router();
const connection = require('../connection')
const database = connection.db('Project');
const projectdb = database.collection('ProjectDetails');
const contributiondb = database.collection('Contributions');
const userdatabase = connection.db('User');
const userdb = userdatabase.collection('UserDetails');
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

//Create the job with Malaysia timezone
const job = schedule.scheduleJob(rule, async function(){
    console.log('This job runs every day at 9:00 AM in Malaysia timezone.');
    let query = { status : 'Approved' };
    const body = await projectdb.find(query).toArray();
    
    body.forEach(element => {
        var day = 24 * 60 * 60 * 1000;
        var now = new Date().getTime() + 8 * 60 * 60 * 1000;
        var end = new Date(element.end)
        console.log(now - element.end )
        if( now - element.end > day ){
            let query = { _id : element._id };
            let update
            if(element.totalfund <= element.pledged){
                update = { $set: { status: 'Claimable' } };
            } else {
                update = { $set: { status: 'Unsuccessful' } };
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
        for (let i=0; i<element.currentmil-1; i++){
            remaining = remaining - element.milestones[i].percentage
        }

        // Calculate how much should be returned
        let amount = element.amount * remaining;

        // To get wallet address of project owner
        //const userbody = await userdb.findOne({ _id : element.uid }, {projection: {wallet_address: 1}});

        // Transfer remaining fund
        contract.transfer({contract_address: element.contract_address, caller_address: element.caller_address, revaddress : element.caller_address, amount : amount}, function(value){
            let query = { _id : element._id };
            let update = { $set: { status: 'Half returned' } }
            try{
                contributiondb.updateOne(query, update);
                
            } catch (err) {
                console.log("Failed because", err);
            }
        });
    })
}

router.put('/:pid/test', async function(req, res){
    let pid = req.params.pid.toString();
    returnHalfFund(pid)
    res.sendStatus(200)
});

module.exports = router;