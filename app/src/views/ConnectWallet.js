import React, {useEffect, useState} from 'react';
import '../styles/styles.css'
import MetaMaskOnboarding from '@metamask/onboarding'
import {Metamask} from '../components/svg/Metamask.jsx'
  
const ConnectWallet = () => {
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
    
    }, []);

    const connectWallet = async () => {
        if(!MetaMaskOnboarding.isMetaMaskInstalled()){
            window.open('https://metamask.io/download/');
        } else {
            window.ethereum.request({method:'eth_requestAccounts'}).then(res=>{
                // Return the address of the wallet
                //console.log(res) 
                setAccounts(res);
            })
        }
        
    };

    return (
        <div className='background'>
            <div className='form'>
                <h1>Connect your wallet</h1>
                <div className='wallet-option' onClick={connectWallet}>
                    Metamask
                    <Metamask />
                </div>
                <button className="submit-button">Submit</button>
            </div>
        </div>
    );
};
  
export default ConnectWallet;