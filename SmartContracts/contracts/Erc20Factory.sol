// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

error inSufficientBalance(uint256 required, uint256 available);
error inSufficientAllowance(uint256 required, uint256 available);
error InsufficientPayment();
error InvalidNameOrSymbol();
error ZeroAmount();
error unAuthorized();
error WithdrawFailed();


contract CustomERC20{
    string public  name;
    string public  symbol;
    uint256 public totalSupply; 

    mapping(address => uint256) public balances;
    mapping(address => mapping (address=> uint256)) public allowances;

    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Approval(address indexed from, address to, uint amount);


    constructor(string memory _name, string memory _symbol, uint256  _initialSupply, address creator) {
        name = _name;
        symbol = _symbol;
        totalSupply = _initialSupply;
        balances[creator] = totalSupply;

        emit Transfer(address(0), creator, totalSupply);
    }

    function transfer(address _to, uint256 _amount) public {
        if(balances[msg.sender] < _amount) {
        revert inSufficientBalance(_amount, balances[msg.sender]);}
        if ( _amount == 0) {
           revert ZeroAmount();}

        balances[msg.sender] -= _amount;
        balances[_to] += _amount;

        emit Transfer(msg.sender, _to, _amount );
    }

    function approve(address _spender, uint256 _amount) public {
        if ( _amount == 0) {
           revert ZeroAmount();}

        allowances[msg.sender][_spender] = _amount;

        emit Approval(msg.sender, _spender, _amount);
    }

    function transferFrom(address _from, address _to, uint256 _amount) public {
        if ( _amount == 0) {
           revert ZeroAmount();}   
        if (balances[_from] < _amount) {
            revert inSufficientBalance(_amount, balances[_from]);}
        if( allowances[_from][msg.sender] < _amount){
            revert inSufficientAllowance(_amount, allowances[_from][msg.sender]);}


        balances[_from] -= _amount; 
        allowances[_from][msg.sender] -=  _amount;
        balances[_to] += _amount;

        emit Transfer(_from, _to, _amount);

    }

    function balanceOf(address _address) external view returns(uint256) {
        return balances[_address];
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

        CustomERC20  erc20 = new CustomERC20(_name, _symbol, _initialSupply, msg.sender);
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

         fee = _newFee   

         emit FeeUpdated(oldFee, fee)  
      }      

      function totalTokensDeployed() external view returns(uint256) {
        return tokens.length;
      }

}