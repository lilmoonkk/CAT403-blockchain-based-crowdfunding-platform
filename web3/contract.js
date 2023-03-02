// 1 Initialization
var express = require('express');
var router = express.Router();

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

let payload = {
    data: bytecode,
    arguments: [1, 1, account]
}

let parameter = {
    from: account,
    gas: web3.utils.toHex(800000),
    gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei'))
}

router.post('/', async function(req, res){
    deploy_contract.deploy(payload).send(parameter, (err, transactionHash) => {
        console.log('Transaction Hash :', transactionHash);
    }).on('confirmation', () => {}).then((newContractInstance) => {
        console.log('Deployed Contract Address : ', newContractInstance.options.address);
    })  
});

module.exports = router;
