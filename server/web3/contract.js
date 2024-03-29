const Web3 = require('web3');
const project = require('../contract/build/contracts/project')

const rpcURL = 'http://127.0.0.1:7545';
const web3 = new Web3(rpcURL);

let abi = project.abi
let bytecode = project.bytecode



const createSmartContract = ((req, callback) => {
    // Contact ABI
    let deploy_contract = new web3.eth.Contract(abi);
    // address from Ganache
    let account = '0xdbB393C2f1F81f84B3d1b86DD62cbD2bB226df36'; 
    //let account = req.owner_address;
    let parameter = {
        from: req.owner_address,
        gas: web3.utils.toHex(6721975),
        gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei'))
    }
    
    let milestone=[]; //organizeMilestonePayload({milestone: req.milestone});
    //Ori
    /*for(let i=0; i<req.milestone.length; i++){
        milestone.push([req.milestone[i].seq, web3.utils.toWei(String(req.milestone[i].amount), 'gwei')]);
    }*/
    for(let i=0; i<req.milestone.length; i++){
        milestone.push(web3.utils.toWei(String(req.milestone[i].amount), 'ether'));
    } //New

    let payload = {
        data: bytecode,
        arguments: [req.id, milestone, account]
    }

    deploy_contract.deploy(payload).send(parameter, (err, transactionHash) => {
        console.log('Transaction Hash :', transactionHash);
    }).on('confirmation', () => {}).then((newContractInstance) => {
        console.log('Deployed Contract Address : ', newContractInstance.options.address);
        callback(newContractInstance.options.address);
    })  
});

const pledge = (async (req, callback) => {
    console.log(req)
    const contract = new web3.eth.Contract(abi, req.contract_address);
    await contract.methods.pledge(web3.utils.toWei(String(req.pledge), 'ether')).send({ from: req.caller_address, value: web3.utils.toWei(req.pledge.toString(), 'ether') })
    .on('transactionHash', function(hash){
      console.log("Transaction hash:", hash);
      callback(hash)
    })
    /*.on('confirmation', function(confirmationNumber, receipt){
      //console.log("Confirmation number:", confirmationNumber);
    })
    .on('receipt', function(receipt){
      //console.log("Receipt:", receipt);
    })*/
    .on('error', function(error){
      console.error(error);
    });
});

const getPledged = (async (req, callback) => {
    const contract = new web3.eth.Contract(abi, req);
    let pledged = await contract.methods.getPledged().call();
    return Web3.utils.fromWei(pledged, 'ether');;
});

const getBalance = (async (req, callback) => {
    const contract = new web3.eth.Contract(abi, req);
    let balance = await contract.methods.getBalance().call();
    return Web3.utils.fromWei(balance, 'ether');;
});

const getProof = (async (req, callback) => {
    const contract = new web3.eth.Contract(abi, req.contract_address);
    let proof = await contract.methods.getProof(req.milestone).call()
    return proof
});

const getResponse = (async (req, callback) => {
    const contract = new web3.eth.Contract(abi, req.contract_address);
    let response = await contract.methods.getResponse(req.milestone).call()
    return response
});

const claim = (async (req, callback) => {
    const contract = new web3.eth.Contract(abi, req.contract_address);
    await contract.methods.claim(req.milestoneseq).send({ from: req.caller_address })
    .on('transactionHash', function(hash){
      console.log("Transaction hash:", hash);
      callback(hash)
    })
    .on('error', function(error){
        console.error(error);
    });
});

const transfer = (async (req, callback) => {
    const contract = new web3.eth.Contract(abi, req.contract_address);
    await contract.methods.transferFund(req.revaddress, web3.utils.toWei(String(req.amount), 'ether')).send({ from: req.caller_address})
    .on('transactionHash', function(hash){
      console.log("Transaction hash:", hash);
      callback(hash)
    })
    .on('error', function(error){
        console.error(error);
    });
});

const uploadProof = (async (req, callback) => {
    const contract = new web3.eth.Contract(abi, req.contract_address);
    //let account = req.owner_address;
    let parameter = {
        from: req.owner_address,
        gas: web3.utils.toHex(6721975),
        gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei'))
    }
    await contract.methods.uploadProof(req.milestone, req.proofs).send(parameter)
    .on('transactionHash', function(hash){
      console.log("Transaction hash:", hash);
      callback(hash)
    })
    .on('error', function(error){
        console.error(error);
    });
});

const uploadResponse = (async (req, callback) => {
    const contract = new web3.eth.Contract(abi, req.contract_address);
    //let account = req.owner_address;
    let parameter = {
        from: req.owner_address,
        gas: web3.utils.toHex(6721975),
        gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei'))
    }
    console.log(req.owner_address)
    await contract.methods.uploadApproval(req.milestone, req.response, req.approved).send(parameter)
    .on('transactionHash', function(hash){
      console.log("Transaction hash:", hash);
      callback(hash)
    })
    .on('error', function(error){
        console.error(error);
    });
});

module.exports = {
    createSmartContract,
    pledge,
    getPledged,
    getBalance,
    getProof,
    getResponse,
    claim,
    transfer,
    uploadProof,
    uploadResponse
};
