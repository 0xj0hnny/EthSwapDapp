pragma solidity ^0.5.0;

import './Token.sol';

contract EthSwap {
    string public name = "EthSwap Instance Exchange";
    Token public token;
    uint public rate = 100;

    event TokensPurchased(address account, address token, uint amount, uint rate);
    event TokensSold(address account, address token, uint amount, uint rate);

    constructor(
        Token _token
    ) public {
        token = _token;
    }

    function buyTokens() public payable {
        uint tokenAmount = rate * msg.value;

        require(token.balanceOf(address(this)) >= tokenAmount);

        // calculate the number of tokens to buy
        token.transfer(msg.sender, tokenAmount);

        //emit an event
        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint _amount) public {
        require(token.balanceOf(msg.sender) >= _amount);
        uint ethAmount = _amount / rate;
        require(address(this).balance >= ethAmount);
        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(ethAmount);
        emit TokensSold(msg.sender, address(token), _amount, rate);
    }

}