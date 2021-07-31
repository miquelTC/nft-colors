import React, { useState, useEffect } from 'react';
import web3 from './connection/web3';

import Navbar from './components/Layout/Navbar';
import Main from './components/Content/Main';
import Spinner from './components/Layout/Spinner';
import './App.css';
import ColorNFT from './abis/ColorNFT.json';

const App = () => {
  const [contract, setContract] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [account, setAccount] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [colors, setColors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);   
  
  useEffect(() => {
    // Check if the user has Metamask active
    if(!web3) {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      return;
    }
    
    // Function to fetch all the blockchain data
    const loadBlockchainData = async() => {
      // Request accounts acccess if needed
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });  
      } catch(error) {
        console.error(error);
      }
      
      // Load account
      const accounts = await web3.eth.getAccounts();       
      setAccount(accounts[0]);

      // Load Network ID
      const networkId = await web3.eth.net.getId()
      setNetworkId(networkId);      

      // Load Contract
      const deployedNetwork = ColorNFT.networks[networkId];
      const contract = deployedNetwork ? new web3.eth.Contract(ColorNFT.abi, deployedNetwork.address): '';      

      if(contract) {
        // Set contract in state
        setContract(contract); 

        // Get total supply
        const totalSupply = await contract.methods.totalSupply().call();
        setTotalSupply(totalSupply);

        // Load Colors
        for (var i = 1; i <= totalSupply; i++) {
          const color = await contract.methods.colors(i - 1).call();
          setColors(prevState => [...prevState, color]);
        }

        setIsLoading(false);

        // Event subscription to safeMint 
        contract.events.Transfer()    
        .on('data', (event) => {          
          setIsLoading(false);
        })
        .on('error', (error) => {
          console.log(error);
        });        
      } else {
        window.alert('ColorNFT contract not deployed to detected network.')
      }
    };
    
    loadBlockchainData();
    
    // Metamask Event Subscription - Account changed
    window.ethereum.on('accountsChanged', (accounts) => {
      setAccount(accounts[0]);
    });

    // Metamask Event Subscription - Network changed
    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    });
  }, []);

  const showContent = web3 && contract && account;
  
  return(
    <React.Fragment>
      <Navbar account={account} setAccount={setAccount} networkId={networkId} web3={web3} />
      {showContent && !isLoading && <Main contract={contract} setIsLoading={setIsLoading} account={account} colors={colors} setColors={setColors} />}
      {isLoading && <Spinner />}
    </React.Fragment>
  );
};

export default App;