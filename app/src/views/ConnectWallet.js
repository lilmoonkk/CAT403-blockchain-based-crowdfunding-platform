import React, {useState, useEffect} from 'react';
import '../styles/styles.css'
import MetaMaskOnboarding from '@metamask/onboarding'
import {Metamask} from '../components/svg/Metamask.jsx'
import {useLocation} from 'react-router-dom';

const ConnectWallet = () => {
    const [account, setAccount] = useState('');
    const state = useLocation().state;

    useEffect(() => {
        //console.log(state)
    });

    const connectWallet = async () => {
        if(!MetaMaskOnboarding.isMetaMaskInstalled()){
            window.open('https://metamask.io/download/');
        } else {
            window.ethereum.request({method:'eth_requestAccounts'}).then(res=>{
                // Return the address of the wallet
                //console.log('res',res) 
                setAccount(res[0]);
            })
        }
        
    };

    const submit = async () => {
        if(account){
            //console.log('account',account);
            await fetch('/user/add',{
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    firstname: state.firstname, 
                    lastname: state.lastname, 
                    email: state.email, 
                    password: state.password,
                    wallet_address: account
                })
            }).catch(error => alert(error.message))
        } else {
            alert('Please connect wallet first!')
        }
    }
    
    return (
        <div className='background'>
            <div className='form'>
                <h1>Connect your wallet</h1>
                <p>If you don't have a wallet yet, create one now.</p>
                <div className='wallet-option' onClick={connectWallet}>
                    Metamask
                    <Metamask />
                </div>
                <button className="submit-button" onClick={submit}>Submit</button>
            </div>
        </div>
    );
};
  
export default ConnectWallet;