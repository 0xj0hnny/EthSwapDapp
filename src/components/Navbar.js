import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {AppBar, Toolbar, Typography} from "@material-ui/core";
import Identicon from 'identicon.js';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const truncateAddress = (str) => {
  if(str) {
    return str.slice(0, 6) + '...' + str.slice(str.length - 4);
  }
}

const Navbar = (props) => {
  const {account} = props;
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Typography variant="h6" className={classes.title}>EthSwap</Typography>
        <Typography variant="subtitle2" style={{paddingRight: '.5rem'}}>{truncateAddress(account)}</Typography>
        { account
          ? <img
            className="ml-2"
            width='22'
            height='22'
            src={`data:image/png;base64,${new Identicon(account, 30).toString()}`}
            alt=""
          />
          : null
        }
      </Toolbar>
    </AppBar>
  )
}

export default Navbar