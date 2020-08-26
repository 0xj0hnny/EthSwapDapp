import React, {useEffect, useState} from 'react';
import './App.css';
import {
  Grid,
  Button,
  CircularProgress,
  Typography
} from "@material-ui/core";
import Web3 from "web3";
import EthSwap from '../abis/EthSwap.json';
import Token from '../abis/Token.json';
import Navbar from './Navbar';
import SellForm from "./SellForm";
import BuyForm from "./BuyForm";

const App = () => {
  const [account, setAccount] = useState(null)
  const [ethBalance, setEthBalance] = useState(null)
  const [token, setToken] = useState(null)
  const [tokenBalance, setTokenBalance] = useState('')
  const [ethSwap, setEthSwap] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isBuyTokens, setIsBuyTokens] = useState(true)

  useEffect(async () => {
     await loadWeb3();
     await loadBlockchainData();
  }, [])

  const loadBlockchainData = async () => {
    setIsLoading(true)
    if (window.web3) {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts()
      setAccount(accounts[0])

      const ethBalance = await web3.eth.getBalance(accounts[0]);
      setEthBalance(ethBalance)

      const networkId = await web3.eth.net.getId()
      const tokenData = Token.networks[networkId]

      if(tokenData) {
        const token = new web3.eth.Contract(Token.abi, tokenData.address)
        setToken(token)
        let tokenBalance = await token.methods.balanceOf(accounts[0]).call()
        if (tokenBalance) {
          setTokenBalance(tokenBalance.toString())
        }
      } else {
        window.alert('Token contract not deployed to detected network.')
      }

      // Load EthSwap
      const ethSwapData = EthSwap.networks[networkId]
      if(ethSwapData) {
        const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address)
        setEthSwap(ethSwap)
      } else {
        window.alert('EthSwap contract not deployed to detected network.')
      }

      setIsLoading(false)
    }
  }

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected, You should consider trying MetaMask!')
    }
  }

  return (
    <React.Fragment>
      <Navbar account={account} isLoadingApp={isLoading} />
      <Grid container direction="column" justify="center" alignItems="center" style={{height: '100%', marginTop: '2rem'}}>
        <Grid item xs={6}>
          {
            isLoading ?
              <React.Fragment>
                <div className="center">
                  <CircularProgress />
                  <Typography variant={"subtitle1"}>Please connect to Metamask wallet!</Typography>
                </div>
              </React.Fragment> :
              <React.Fragment>
                <Grid container justify="space-between">
                  <Button variant="outlined" color={"primary"} onClick={() => {setIsBuyTokens(true)}}> Buy </Button>
                  <Button variant="outlined" color={"primary"} onClick={() => {setIsBuyTokens(false)}}> Sell </Button>
                </Grid>
                {
                  isBuyTokens ?
                    <BuyForm
                      account={account}
                      ethSwap={ethSwap}
                      tokenBalance={tokenBalance}
                      ethBalance={ethBalance}
                    /> :
                    <SellForm
                      account={account}
                      token={token}
                      ethSwap={ethSwap}
                      tokenBalance={tokenBalance}
                      ethBalance={ethBalance}
                    />
                }
              </React.Fragment>
          }
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default App;
