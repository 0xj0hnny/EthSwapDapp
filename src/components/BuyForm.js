import React, {useState} from 'react';
import {
  Button,
  Card,
  CardContent, CircularProgress,
  FormHelperText,
  Grid,
  InputAdornment,
  OutlinedInput,
  Typography
} from "@material-ui/core";
import ethIcon from "../imgs/eth-logo.png";
import tokenIcon from "../imgs/token-logo.png";

const BuyForm = ({tokenBalance, ethBalance, ethSwap, account}) => {

  const [swapEthAmount, setSwapEthAmount] = useState(null)
  const [swapTokenAmount, setSwapTokenAmount] = useState(null)
  const [isBuyTokensInProgress, setIsBuyTokensInProgress] = useState(false)

  const buyTokens = () => {
    setIsBuyTokensInProgress(true)
    const swapEthAmount = window.web3.utils.toWei(swapTokenAmount, 'Ether')
    ethSwap.methods.buyTokens().send({ value: swapEthAmount, from: account })
      .on('confirmation', (hash) => {setIsBuyTokensInProgress(false); window.location.reload();})
      .on('error', function(error){ setIsBuyTokensInProgress(false); })
  }

  return (
    <Card style={{width: '600px', marginTop: '1rem'}}>
      <CardContent>
        <React.Fragment >
          <Grid container justify="space-between">
            <Typography variant="subtitle1" display={"inline"}  gutterBottom>
              From
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
            onChange={(event) => {
              event.preventDefault()
              setSwapTokenAmount(event.target.value)
              setSwapEthAmount(parseInt(event.target.value) * 100)
            }}
            value={swapTokenAmount}
          />
        </React.Fragment>
        <React.Fragment>
          <Grid container justify="space-between" style={{paddingTop: '1rem'}}>
            <Typography variant="subtitle1" display={"inline"}  gutterBottom>
              To
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
            value={swapEthAmount}
            disabled={true}
          />
          <Grid container justify="space-between" style={{paddingTop: '.25rem', paddingBottom: '.75rem'}}>
            <FormHelperText id="filled-weight-helper-text">Exchange Rate</FormHelperText>
            <FormHelperText id="filled-weight-helper-text">1 ETH = 100 SWP</FormHelperText>
          </Grid>
        </React.Fragment>
        <Button
          fullWidth={true}
          variant={"contained"}
          color={"primary"}
          onClick={() => {buyTokens()}}
          disabled={!(swapTokenAmount && swapTokenAmount.length >0)}
        >
          {
            isBuyTokensInProgress ?
              <CircularProgress color={'secondary'} size={26}/> :
              <Typography variant={"button"}>SWAP</Typography>
          }
        </Button>
      </CardContent>
    </Card>
  )
}

export default BuyForm