// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

error InsufficientPayment();
error InvalidNameOrSymbol();
error ZeroAmount();
error unAuthorized();
error WithdrawFailed();


contract ERC20Token is ERC20 {
    constructor(string memory _name, string memory _symbol, uint256 _initialSupply, address creator)
        ERC20(_name, _symbol)
    {
        _mint(creator, _initialSupply);
    }
}

contract Erc20Factory{
    address public owner;
    address[] public tokens;
    uint256 public fee = 0.00027 ether;
    mapping(address => address[] ) public tokensByUser;

    event TokenCreated(address indexed tokenAddress, address indexed creator, string name, string symbol);
    event FeeUpdated(uint256 OldFee, uint256 Newfee);

    constructor() {
        owner = msg.sender;
    }

    function createToken(string calldata _name, string calldata _symbol, uint256 _initialSupply) public payable {
        if(msg.value < fee) {
            revert InsufficientPayment();}
        if (bytes(_name).length == 0 || bytes(_symbol).length == 0) {
            revert InvalidNameOrSymbol();}

        if (_initialSupply == 0) {
            revert ZeroAmount();}

        ERC20Token  erc20 = new ERC20Token(_name, _symbol, _initialSupply, msg.sender);
       address tokenAddress = address(erc20);

        tokensByUser[msg.sender].push(tokenAddress);

        tokens.push(tokenAddress);

        emit TokenCreated(tokenAddress, msg.sender, _name, _symbol);
    }

    function withdrawFees() external {
        if(msg.sender !=  owner) {
            revert unAuthorized();}
        uint256 amount = address(this).balance;

        (bool ok,) = owner.call{value: amount}("");
        if (!ok){
            revert WithdrawFailed();}

    }

    function setFee(uint256 _newFee) external {
        if(msg.sender != owner) {
            revert unAuthorized();}

            uint256 oldFee = fee;

         fee = _newFee;

         emit FeeUpdated(oldFee, fee);  
      }      

      function totalTokensDeployed() external view returns(uint256) {
        return tokens.length;
      }

      function getTokensByUser(address _user) public view returns(address[] memory) {
        return tokensByUser[_user];
      }

}