const Web3 = require('web3');
const project = require('../contract/build/contracts/project')

//const rpcURL = 'http://127.0.0.1:7545';
//const rpcURL = 'https://eth-sepolia.g.alchemy.com/v2/AyYKiHnStG0foZnTxiP4OvyEgal1nMsr'
//const web3 = new Web3(rpcURL);
const network = 'Ethereum Sepolia';
const web3 = new Web3(`https://eth-sepolia.g.alchemy.com/v2/AyYKiHnStG0foZnTxiP4OvyEgal1nMsr`)
let abi = project.abi
let bytecode = project.bytecode



const createSmartContract = ((req, callback) => {
  web3.eth.sendSignedTransaction(req.signtx)
  .on('transactionHash', (hash) => {
    console.log('Transaction sent:', hash);
    // Handle the transaction hash or further actions
  })
  .on('receipt', (receipt) => {
    console.log('Transaction receipt:', receipt);
    // Handle the receipt or further actions
  })
  .on('error', (error) => {
    console.error('Error sending transaction:', error);
    // Handle the error
  });
  //web3.eth.accounts.wallet.add(req.signtx);
    // Contact ABI
    /*let deploy_contract = new web3.eth.Contract(abi);
    // address from Ganache
    let account = '0xdbB393C2f1F81f84B3d1b86DD62cbD2bB226df36'; 
    //let account = req.owner_address;
    let parameter = {
        from: account,
        gas: web3.utils.toHex(6721975),
        gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei'))
    }
    
    let milestone=[]; //organizeMilestonePayload({milestone: req.milestone});
    //Ori
    /*for(let i=0; i<req.milestone.length; i++){
        milestone.push([req.milestone[i].seq, web3.utils.toWei(String(req.milestone[i].amount), 'gwei')]);
    }*/
    /*for(let i=0; i<req.milestone.length; i++){
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
    })  */
});

const pledge = (async (req, callback) => {
    let address = '0xdbB393C2f1F81f84B3d1b86DD62cbD2bB226df36'
    let privatekey = '968d705e3ba26b0e9bd682179a4f59dd89144015885e71cebcbea800d18d3e5c'
    //const signer = web3.eth.accounts.privateKeyToAccount(
      //  privatekey
      //);
      //console.log(signer)
      let parameter = {
        from: address,
        gas: web3.utils.toHex(6721975),
        gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei')),
        value: web3.utils.toWei(req.pledge.toString(), 'ether')
    }
      const signedTx = await web3.eth.accounts.signTransaction(parameter, privatekey);
      console.log(signedTx)
      //web3.eth.accounts.wallet.add(signer);
      //web3.eth.accounts.wallet.add(address);
      //console.log(web3.eth.accounts.wallet[address].privateKey)
    //console.log(req)
    /*let parameter = {
        from: signer.address,
        gas: web3.utils.toHex(6721975),
        gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei')),
        value: web3.utils.toWei(req.pledge.toString(), 'ether')
    }
    const contract = new web3.eth.Contract(abi, req.contract_address);
    await contract.methods.pledge(web3.utils.toWei(String(req.pledge), 'ether')).send(parameter)
    .on('transactionHash', function(hash){
      console.log("Transaction hash:", hash);
      callback(hash)
    })*/
    /*.on('confirmation', function(confirmationNumber, receipt){
      //console.log("Confirmation number:", confirmationNumber);
    })
    .on('receipt', function(receipt){
      //console.log("Receipt:", receipt);
    })*/
    /*.on('error', function(error){
      console.error(error);
    });*/
    
});

/*
// Function to send a transaction
const pledge = async (req, callback) => {
  try {
    const contract = new web3.eth.Contract(abi, req.contract_address);
    const transaction = contract.methods.pledge(web3.utils.toWei(String(req.pledge), 'ether'));
    // Prepare the transaction
    //const transactionObject = contract.methods.yourContractFunction(parameter1, parameter2);

    // Get the user's address from MetaMask
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];

    // Request user's signature
    const rawTransaction = {
      from: req.caller_address,
      to: req.contractAddress,
      data: transaction.encodeABI()
    };

    const signedTransaction = await web3.eth.signTransaction(rawTransaction);
    const transactionHash = await web3.eth.sendSignedTransaction(signedTransaction.raw || signedTransaction.rawTransaction);
    console.log('Transaction Hash:', transactionHash);
  } catch (error) {
    console.error('Error:', error);
  }
}
*/



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
    claim,
    transfer,
    uploadProof,
    uploadResponse
};
