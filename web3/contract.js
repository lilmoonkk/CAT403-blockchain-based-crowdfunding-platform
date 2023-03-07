const Web3 = require('web3');
const project = require('../contract/build/contracts/project')

const rpcURL = 'http://127.0.0.1:7545';
const web3 = new Web3(rpcURL);

let abi = project.abi
let bytecode = project.bytecode

// Contact ABI
let deploy_contract = new web3.eth.Contract(abi);
// address from Ganache
let account = '0xdbB393C2f1F81f84B3d1b86DD62cbD2bB226df36'; 

let parameter = {
    from: account,
    gas: web3.utils.toHex(6721975),
    gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei'))
}

const createSmartContract = ((req, res) => {
    
    let milestone=[]; //organizeMilestonePayload({milestone: req.milestone});
    for(let i=0; i<req.milestone.length; i++){
        milestone.push([req.milestone[i].seq, web3.utils.toWei(String(req.milestone[i].amount), 'gwei')]);
    }

    let payload = {
        data: bytecode,
        arguments: [req.id, milestone, account]
    }

    deploy_contract.deploy(payload).send(parameter, (err, transactionHash) => {
        console.log('Transaction Hash :', transactionHash);
    }).on('confirmation', () => {}).then((newContractInstance) => {
        console.log('Deployed Contract Address : ', newContractInstance.options.address);
    })  
});

module.exports = {
    createSmartContract
};
