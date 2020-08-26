import React, {useState, useEffect} from 'react';
import {
  Button,
  Card,
  CardContent,
  FormHelperText,
  Grid,
  InputAdornment,
  OutlinedInput,
  Typography,
  CircularProgress
} from "@material-ui/core";
import tokenIcon from "../imgs/token-logo.png";
import ethIcon from "../imgs/eth-logo.png";

const SellForm = ({tokenBalance, ethBalance, token, ethSwap, account }) => {
  const [swapEthAmount, setSwapEthAmount] = useState(null)
  const [swapTokenAmount, setSwapTokenAmount] = useState(null)
  const [isSellTokensInProgress, setIsSellTokensInProgress] = useState(false)

  const sellTokensFunc = () => {
    setIsSellTokensInProgress(true)
    const convertToEthAmount = window.web3.utils.toWei(swapTokenAmount, 'Ether')
      token.methods.approve(ethSwap.address, convertToEthAmount).send({ from: account }).on('transactionHash', (hash) => {
        ethSwap.methods.sellTokens(convertToEthAmount).send({ from: account })
          .on('confirmation', (hash) => {
            setIsSellTokensInProgress(false);
            window.location.reload();
          })
          .on('error', function(error){ setIsSellTokensInProgress(false); })
      })
  }

  return (
    <Card style={{width: '600px', marginTop: '1rem'}}>
      <CardContent>
        <React.Fragment>
          <Grid container justify="space-between">
            <Typography variant="subtitle1" display={"inline"}  gutterBottom>
              Input
            </Typography>
            <Typography variant="subtitle1" display={"inline"} gutterBottom>
              Balance: {tokenBalance ? window.web3.utils.fromWei(tokenBalance, 'Ether') : 0}
            </Typography>
          </Grid>
          <OutlinedInput
            margin={'dense'}
            endAdornment={
              <InputAdornment position="end" variant="filled">
                <img src={tokenIcon} style={{width: '20px', height: '20px', paddingRight: '1rem'}} />
                <Typography component={'h6'}>SWP</Typography>
              </InputAdornment>
            }
            aria-describedby="outlined-weight-helper-text"
            labelWidth={0}
            style={{width: '100%'}}
            onChange={(event) => {
              event.preventDefault()
              setSwapEthAmount((parseInt(event.target.value) / 100).toString())
              setSwapTokenAmount(event.target.value)
            }}
            value={swapTokenAmount}
          />
        </React.Fragment>
        <React.Fragment>
          <Grid container justify="space-between" style={{paddingTop: '1rem'}}>
            <Typography variant="subtitle1" display={"inline"}  gutterBottom>
              Output
            </Typography>
            <Typography variant="subtitle1" display={"inline"} gutterBottom>
              Balance: {ethBalance ? window.web3.utils.fromWei(ethBalance, 'Ether') : 0}
            </Typography>
          </Grid>
          <OutlinedInput
            margin={'dense'}
            endAdornment={
              <InputAdornment position="end" variant="filled">
                <img src={ethIcon} style={{width: '20px', height: '20px', paddingRight: '1rem'}} />
                <Typography component={'h6'}>ETH</Typography>
              </InputAdornment>
            }
            aria-describedby="outlined-weight-helper-text"
            labelWidth={0}
            style={{width: '100%'}}
            value={swapEthAmount}
            disabled={true}
          />
          <Grid container justify="space-between" style={{paddingTop: '.25rem', paddingBottom: '.75rem'}}>
            <FormHelperText id="filled-weight-helper-text">Exchange Rate</FormHelperText>
            <FormHelperText id="filled-weight-helper-text">100 SWP = 1 ETH</FormHelperText>
          </Grid>
        </React.Fragment>
        <Button
          fullWidth={true}
          variant={"contained"}
          color={"primary"}
          onClick={() => {sellTokensFunc()}}
          disabled={!(swapTokenAmount && swapTokenAmount.length >0)}
        >
          {
            isSellTokensInProgress ?
              <CircularProgress color={'secondary'} size={26}/> :
              <Typography variant={"button"}>SWAP</Typography>
          }
        </Button>
      </CardContent>
    </Card>
  )
}

export default SellForm