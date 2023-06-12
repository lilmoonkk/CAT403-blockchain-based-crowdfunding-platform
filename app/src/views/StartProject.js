import React, {useEffect, useState} from 'react';
import '../styles/styles.css';
import Milestone from '../components/Milestone';
import {useNavigate} from 'react-router-dom';
import Web3 from 'web3'
  
const StartProject = () => {
    const navigate = useNavigate();
    const [project, setproject] = useState({
        name: '',
        desc: '',
        category: 'tech&innovation',
        location: '',
        image: '',
        video: '',
        campaign_period: 0,
        totalfund: 0.00,
        owner_address: sessionStorage.getItem('wallet_address')
    });
    const [milestones, setmilestones] = useState([]);
    const [numMilestone, setnumMilestone] = useState(1);
    const [myr, setmyr] = useState((0).toFixed(2))

    useEffect(() => {
        if(!sessionStorage.getItem('uid')){
            alert(`Oops! You haven't logged in yet. Please log in to continue.`)
            navigate('/login')
        }
    }, []);

    useEffect(() => {
        const updateTotalFund = () => {
            let result = 0
            for(let i=0; i<milestones.length; i++){
                //console.log(milestones[i].amount)
                result += parseFloat(milestones[i].amount)
            }
            
            setproject((prevState) => {
                return({
                  ...prevState,
                  totalfund: result.toFixed(5)
                });
            });
            
            convertEthMyr(result)
        }

        updateTotalFund()
    }, [milestones]);
    
    const web3 = new Web3(window.ethereum);
    const handleSubmit = async(e) =>{
        e.preventDefault()
        // Frontend

        // Connect to MetaMask provider
        if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        } else {
        console.log('Please install MetaMask.');
        }

        // Define transaction parameters
        //const contractAddress = '0x...'; // Smart contract address
        const abi = [
            {
              "inputs": [
                {
                  "internalType": "string",
                  "name": "_projectId",
                  "type": "string"
                },
                {
                  "internalType": "uint256[]",
                  "name": "_milestone",
                  "type": "uint256[]"
                },
                {
                  "internalType": "address payable",
                  "name": "_company",
                  "type": "address"
                }
              ],
              "stateMutability": "payable",
              "type": "constructor"
            },
            {
              "anonymous": false,
              "inputs": [],
              "name": "Claim",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "caller",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                }
              ],
              "name": "Pledge",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "target",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                }
              ],
              "name": "Transfer",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "target",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                }
              ],
              "name": "Unpledge",
              "type": "event"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "name": "proofs",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_amount",
                  "type": "uint256"
                }
              ],
              "name": "pledge",
              "outputs": [],
              "stateMutability": "payable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address payable",
                  "name": "backer",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "_amount",
                  "type": "uint256"
                }
              ],
              "name": "unpledge",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address payable",
                  "name": "backer",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "_amount",
                  "type": "uint256"
                }
              ],
              "name": "transferFund",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "getPledged",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "getBalance",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "getProof",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "milestoneseq",
                  "type": "uint256"
                }
              ],
              "name": "claim",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "milestoneseq",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "_proof",
                  "type": "string"
                }
              ],
              "name": "uploadProof",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "milestoneseq",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "_response",
                  "type": "string"
                },
                {
                  "internalType": "bool",
                  "name": "approved",
                  "type": "bool"
                }
              ],
              "name": "uploadApproval",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            }
          ]; // ABI definition of the smart contract
        const contractInstance = new web3.eth.Contract(abi);
        let bytecode = "0x6080604052604051620018ad380380620018ad833981810160405281019062000029919062000490565b82600090816200003a91906200076b565b506000600190505b82518111620001375760405180606001604052808460018462000066919062000881565b815181106200007a5762000079620008bc565b5b60200260200101518152602001600260038111156200009e576200009d620008eb565b5b815260200160405180602001604052806000815250815250600560008381526020019081526020016000206000820151816000015560208201518160010160006101000a81548160ff02191690836003811115620001015762000100620008eb565b5b021790555060408201518160020190816200011d91906200076b565b5090505080806200012e906200091a565b91505062000042565b5080600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505062000967565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620001eb82620001a0565b810181811067ffffffffffffffff821117156200020d576200020c620001b1565b5b80604052505050565b60006200022262000182565b9050620002308282620001e0565b919050565b600067ffffffffffffffff821115620002535762000252620001b1565b5b6200025e82620001a0565b9050602081019050919050565b60005b838110156200028b5780820151818401526020810190506200026e565b60008484015250505050565b6000620002ae620002a88462000235565b62000216565b905082815260208101848484011115620002cd57620002cc6200019b565b5b620002da8482856200026b565b509392505050565b600082601f830112620002fa57620002f962000196565b5b81516200030c84826020860162000297565b91505092915050565b600067ffffffffffffffff821115620003335762000332620001b1565b5b602082029050602081019050919050565b600080fd5b6000819050919050565b6200035e8162000349565b81146200036a57600080fd5b50565b6000815190506200037e8162000353565b92915050565b60006200039b620003958462000315565b62000216565b90508083825260208201905060208402830185811115620003c157620003c062000344565b5b835b81811015620003ee5780620003d988826200036d565b845260208401935050602081019050620003c3565b5050509392505050565b600082601f83011262000410576200040f62000196565b5b81516200042284826020860162000384565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600062000458826200042b565b9050919050565b6200046a816200044b565b81146200047657600080fd5b50565b6000815190506200048a816200045f565b92915050565b600080600060608486031215620004ac57620004ab6200018c565b5b600084015167ffffffffffffffff811115620004cd57620004cc62000191565b5b620004db86828701620002e2565b935050602084015167ffffffffffffffff811115620004ff57620004fe62000191565b5b6200050d86828701620003f8565b9250506040620005208682870162000479565b9150509250925092565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200057d57607f821691505b60208210810362000593576200059262000535565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620005fd7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620005be565b620006098683620005be565b95508019841693508086168417925050509392505050565b6000819050919050565b60006200064c62000646620006408462000349565b62000621565b62000349565b9050919050565b6000819050919050565b62000668836200062b565b62000680620006778262000653565b848454620005cb565b825550505050565b600090565b6200069762000688565b620006a48184846200065d565b505050565b5b81811015620006cc57620006c06000826200068d565b600181019050620006aa565b5050565b601f8211156200071b57620006e58162000599565b620006f084620005ae565b8101602085101562000700578190505b620007186200070f85620005ae565b830182620006a9565b50505b505050565b600082821c905092915050565b6000620007406000198460080262000720565b1980831691505092915050565b60006200075b83836200072d565b9150826002028217905092915050565b62000776826200052a565b67ffffffffffffffff811115620007925762000791620001b1565b5b6200079e825462000564565b620007ab828285620006d0565b600060209050601f831160018114620007e35760008415620007ce578287015190505b620007da85826200074d565b8655506200084a565b601f198416620007f38662000599565b60005b828110156200081d57848901518255600182019150602085019450602081019050620007f6565b868310156200083d578489015162000839601f8916826200072d565b8355505b6001600288020188555050505b505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006200088e8262000349565b91506200089b8362000349565b9250828203905081811115620008b657620008b562000852565b5b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b6000620009278262000349565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82036200095c576200095b62000852565b5b600182019050919050565b610f3680620009776000396000f3fe6080604052600436106100915760003560e01c80637326c9c0116100595780637326c9c0146101695780639ddaf5aa14610185578063c4839975146101c2578063e2dc35e0146101eb578063fc0990fe1461021457610091565b806303e17ee01461009657806312065fe0146100bf57806328c2cd40146100ea578063379607f5146101155780635c5d625e1461013e575b600080fd5b3480156100a257600080fd5b506100bd60048036038101906100b891906108fb565b61023d565b005b3480156100cb57600080fd5b506100d46102f0565b6040516100e19190610979565b60405180910390f35b3480156100f657600080fd5b506100ff6102f8565b60405161010c9190610979565b60405180910390f35b34801561012157600080fd5b5061013c60048036038101906101379190610994565b610302565b005b34801561014a57600080fd5b506101536103b0565b6040516101609190610a40565b60405180910390f35b610183600480360381019061017e9190610994565b610454565b005b34801561019157600080fd5b506101ac60048036038101906101a79190610994565b6104be565b6040516101b99190610a40565b60405180910390f35b3480156101ce57600080fd5b506101e960048036038101906101e49190610ac0565b61055e565b005b3480156101f757600080fd5b50610212600480360381019061020d9190610ac0565b610610565b005b34801561022057600080fd5b5061023b60048036038101906102369190610b00565b6106cf565b005b816005600085815260200190815260200160002060020190816102609190610d68565b5080156102ab5760016005600085815260200190815260200160002060010160006101000a81548160ff021916908360038111156102a1576102a0610e3a565b5b02179055506102eb565b60036005600085815260200190815260200160002060010160006101000a81548160ff021916908360038111156102e5576102e4610e3a565b5b02179055505b505050565b600047905090565b6000600354905090565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc60056000848152602001908152602001600020600001549081150290604051600060405180830381858888f19350505050158015610380573d6000803e3d6000fd5b507f3158952e7c791deb52750003dbcb0fb942106f2bcd1005fb946a83cd6646fdc460405160405180910390a150565b6060600660006001815260200190815260200160002080546103d190610b8b565b80601f01602080910402602001604051908101604052809291908181526020018280546103fd90610b8b565b801561044a5780601f1061041f5761010080835404028352916020019161044a565b820191906000526020600020905b81548152906001019060200180831161042d57829003601f168201915b5050505050905090565b80600360008282546104669190610e98565b925050819055503373ffffffffffffffffffffffffffffffffffffffff167f5e91ea8ea1c46300eb761859be01d7b16d44389ef91e03a163a87413cbf55b95346040516104b39190610979565b60405180910390a250565b600660205280600052604060002060009150905080546104dd90610b8b565b80601f016020809104026020016040519081016040528092919081815260200182805461050990610b8b565b80156105565780601f1061052b57610100808354040283529160200191610556565b820191906000526020600020905b81548152906001019060200180831161053957829003601f168201915b505050505081565b80600360008282546105709190610ecc565b925050819055508173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f193505050501580156105bd573d6000803e3d6000fd5b508173ffffffffffffffffffffffffffffffffffffffff167f0cdb7e259318c69f16c8770399e09f5531befac5033bf7c447e3bc2961169295826040516106049190610979565b60405180910390a25050565b8047101561061d57600080fd5b806003600082825461062f9190610ecc565b925050819055508173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015801561067c573d6000803e3d6000fd5b508173ffffffffffffffffffffffffffffffffffffffff167f69ca02dd4edd7bf0a4abb9ed3b7af3f14778db5d61921c7dc7cd545266326de2826040516106c39190610979565b60405180910390a25050565b806006600084815260200190815260200160002090816106ef9190610d68565b5060006005600084815260200190815260200160002060010160006101000a81548160ff0219169083600381111561072a57610729610e3a565b5b02179055505050565b6000604051905090565b600080fd5b600080fd5b6000819050919050565b61075a81610747565b811461076557600080fd5b50565b60008135905061077781610751565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6107d082610787565b810181811067ffffffffffffffff821117156107ef576107ee610798565b5b80604052505050565b6000610802610733565b905061080e82826107c7565b919050565b600067ffffffffffffffff82111561082e5761082d610798565b5b61083782610787565b9050602081019050919050565b82818337600083830152505050565b600061086661086184610813565b6107f8565b90508281526020810184848401111561088257610881610782565b5b61088d848285610844565b509392505050565b600082601f8301126108aa576108a961077d565b5b81356108ba848260208601610853565b91505092915050565b60008115159050919050565b6108d8816108c3565b81146108e357600080fd5b50565b6000813590506108f5816108cf565b92915050565b6000806000606084860312156109145761091361073d565b5b600061092286828701610768565b935050602084013567ffffffffffffffff81111561094357610942610742565b5b61094f86828701610895565b9250506040610960868287016108e6565b9150509250925092565b61097381610747565b82525050565b600060208201905061098e600083018461096a565b92915050565b6000602082840312156109aa576109a961073d565b5b60006109b884828501610768565b91505092915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156109fb5780820151818401526020810190506109e0565b60008484015250505050565b6000610a12826109c1565b610a1c81856109cc565b9350610a2c8185602086016109dd565b610a3581610787565b840191505092915050565b60006020820190508181036000830152610a5a8184610a07565b905092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610a8d82610a62565b9050919050565b610a9d81610a82565b8114610aa857600080fd5b50565b600081359050610aba81610a94565b92915050565b60008060408385031215610ad757610ad661073d565b5b6000610ae585828601610aab565b9250506020610af685828601610768565b9150509250929050565b60008060408385031215610b1757610b1661073d565b5b6000610b2585828601610768565b925050602083013567ffffffffffffffff811115610b4657610b45610742565b5b610b5285828601610895565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680610ba357607f821691505b602082108103610bb657610bb5610b5c565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302610c1e7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610be1565b610c288683610be1565b95508019841693508086168417925050509392505050565b6000819050919050565b6000610c65610c60610c5b84610747565b610c40565b610747565b9050919050565b6000819050919050565b610c7f83610c4a565b610c93610c8b82610c6c565b848454610bee565b825550505050565b600090565b610ca8610c9b565b610cb3818484610c76565b505050565b5b81811015610cd757610ccc600082610ca0565b600181019050610cb9565b5050565b601f821115610d1c57610ced81610bbc565b610cf684610bd1565b81016020851015610d05578190505b610d19610d1185610bd1565b830182610cb8565b50505b505050565b600082821c905092915050565b6000610d3f60001984600802610d21565b1980831691505092915050565b6000610d588383610d2e565b9150826002028217905092915050565b610d71826109c1565b67ffffffffffffffff811115610d8a57610d89610798565b5b610d948254610b8b565b610d9f828285610cdb565b600060209050601f831160018114610dd25760008415610dc0578287015190505b610dca8582610d4c565b865550610e32565b601f198416610de086610bbc565b60005b82811015610e0857848901518255600182019150602085019450602081019050610de3565b86831015610e255784890151610e21601f891682610d2e565b8355505b6001600288020188555050505b505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610ea382610747565b9150610eae83610747565b9250828201905080821115610ec657610ec5610e69565b5b92915050565b6000610ed782610747565b9150610ee283610747565b9250828203905081811115610efa57610ef9610e69565b5b9291505056fea264697066735822122057237f0420ecb5f4b2157d54c180adf5103280079946c1f74fde791a3187461b64736f6c63430008110033"
        let payload = {
            data: bytecode,
            arguments: ['12gfs', [100000,20000,4000000], '0xdbB393C2f1F81f84B3d1b86DD62cbD2bB226df36']
        }
    
        //const recipientAddress = '0x...'; // Address of the contract method recipient
        const method = contractInstance.deploy(payload) // Method to call on the smart contract
        const transactionParams = {
        from: '0xdbB393C2f1F81f84B3d1b86DD62cbD2bB226df36', // User's Ethereum address from MetaMask
       // to: contractAddress,
        gas: 200000,
        data: method.encodeABI()
        };

        // Send the transaction
        web3.eth.sendTransaction(transactionParams)
        .on('transactionHash', function(hash) {
            console.log('Transaction hash:', hash);
        })
        .on('confirmation', function(confirmationNumber, receipt) {
            console.log('Confirmation number:', confirmationNumber);
            console.log('Transaction receipt:', receipt);
        })
        .on('error', function(error) {
            console.error('Error:', error);
        });

        // Send the signed raw transaction object to the backend using an HTTP request or any other method

        // Get the user's selected Ethereum address
        /*const accounts = await web3.eth.getAccounts();
        const senderAddress = accounts[0];

        // Prepare the transaction object
        const transaction = {
        from: senderAddress
        };
        console.log('step1')
        // Sign the transaction using MetaMask
        //const signedTransaction = await web3.eth.signTransaction(transaction);
        const signedTransaction = await window.ethereum.request({
            method: 'personal_sign',
            params: ['Smart contract will be creating for your project', senderAddress],
        })
        console.log('signedtransaction',signedTransaction)*/
        /*const res = await fetch('/project/add',{
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                uid: sessionStorage.getItem('uid'), 
                project: project,
                milestones: milestones,
                signtx: signedTransaction
            })
        }).catch(error => alert(error.message));
        if(res.ok){
            alert('Your project have been submitted.')
            //window.location.replace('/')
        }*/
      
        
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setproject({
          ...project,
          [name]: value,
        });
    };

    const addMilestone = () => {
        setnumMilestone(numMilestone + 1);
    };

    const handleMilestonesChange = (index, data) => {
        setmilestones((prevData) => {
            const newData = [...prevData];
            newData[index] = data;
            return newData;
        });
    }

    const convertEthMyr = (amount) => {
        setmyr((amount * 8000).toFixed(2));
    }

    return (
        <div className='background' style={{background: 'rgb(254,248,246)'}}>
            <div className='project-form'>
                <h1>Let's get ready to start your project!</h1>
                <form className='form-body'>
                    <div className='project-input'>
                        <label className='project-form-label'>Name</label>
                        <input className='project-form-input' type='text' name='name' id='name' value={project.name} onChange={handleInputChange}/>
                    </div>
                    <div className='project-input'>
                        <label className='project-form-label'>Description</label>
                        <textarea className='project-form-input' name='desc' id='desc' value={project.desc} onChange={handleInputChange}/>
                    </div>
                    <div className='project-input'>
                        <label className='project-form-label'>Category</label>
                        <select className='project-form-input' name='category' style={{width: 'calc(80% + 20px)'}} onChange={handleInputChange}>
                            <option value='tech&innovation'>Tech and Innovation</option>
                            <option value='creativeworks'>Creative Works</option>
                            <option value='communityprojects'>Community Projects</option>
                        </select>
                    </div>
                    <div className='project-input'>
                        <label className='project-form-label'>Campaign period (day)</label>
                        <input className="project-form-input" type='number' min='0' name='campaign_period' id='campaign_period' value={project.campaign_period} onChange={handleInputChange}/>
                    </div>
                    <p className='conversion-text'>* Your campaign will be started after admin has approved your submission.</p>
                </form>
                <div>
                    <h3 className='milestone-title'>Milestones</h3>
                    {[...Array(numMilestone)].map((_, index) => (
                    <><p className='milestone-title'>Milestone {index+1}</p><Milestone key={index} onChange={(data) => handleMilestonesChange(index, data)} /></>))}
                    <button className='add-milestone-button' onClick={addMilestone}>Add Milestone</button>
                </div>
                
                <p className='total-fund-text'>Total fund: {project.totalfund} ETH</p>
                <p className='conversion-text'> ≈ RM {myr}</p>
                
                <button className='create-button' onClick={handleSubmit}>Create</button>
            </div>
        </div>
    );
};
  
export default StartProject;