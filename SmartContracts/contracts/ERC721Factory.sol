// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

error InsufficientPayment();
error Unauthorized();
error WithdrawFailed();
error InvalidNameOrSymbol();
error InvalidBaseURI();
error MaxSupplyReached();

contract ERC721Token is ERC721 {
    address public creator;
    uint256 private nextTokenId;
    string private baseTokenURI;
    uint256 public immutable maxSupply;

    constructor(string memory _name, 
    string memory _symbol, 
    address _creator,
    string memory _baseTokenURI, 
    uint256 _maxSupply
    ) ERC721(_name, _symbol) {
    creator = _creator;
    baseTokenURI = _baseTokenURI; 
    maxSupply = _maxSupply;
    }

    function mint(address _to) external  {
        if(msg.sender != creator) {
            revert Unauthorized(); }
        if (nextTokenId >= maxSupply) {
            revert MaxSupplyReached();}

        _safeMint(_to, nextTokenId);
        unchecked {
            ++nextTokenId;
        }  
    }

    function _baseURI() internal view  override returns(string memory) {
        return baseTokenURI;
    }

    function totalMinted() external view returns (uint256) {
    return nextTokenId;
}

}

contract ERC721Factory {
    address public immutable owner;
    address[] public collections;
    uint256 public fee = 0.00027 ether; 
    
    mapping(address => address[]) public collectionsByUser;

    constructor() { owner = msg.sender;}

    modifier onlyOwner() {
        if(msg.sender != owner) {
        revert Unauthorized();}
        _;
    }

    event CollectionCreated(address indexed collectionAddress, string name, string symbol, address indexed creator);
    event FeeChanged(uint256 oldFee, uint256 newFee);

    function createCollection(string memory _name, string memory _symbol, string memory _baseURI, uint256 _maxSupply) external payable{
      if (msg.value < fee) {
            revert InsufficientPayment();}
      if (bytes(_name).length == 0 || bytes(_symbol).length == 0) {
            revert InvalidNameOrSymbol();}
      if (bytes(_baseURI).length == 0) {
             revert InvalidBaseURI();}
                  


        ERC721Token erc721 = new ERC721Token(_name, _symbol, msg.sender, _baseURI, _maxSupply);
        address collectionAddr = address(erc721);

        collections.push(collectionAddr);
        collectionsByUser[msg.sender].push(collectionAddr);

        emit CollectionCreated(collectionAddr, _name, _symbol, msg.sender);
    }

    function setFee(uint256 _newFee) external onlyOwner {
        uint256 oldFee = fee;
        fee = _newFee;

        emit FeeChanged(oldFee, _newFee); }

   function withdrawFees() external onlyOwner {
    uint256 balance = address(this).balance;

    (bool ok,) = owner.call{value: balance}("");
    if(!ok) {revert WithdrawFailed();}

   }     

   function getCollectionsByUser(address user) external view returns (address[] memory) {
    return collectionsByUser[user]; }

    function getAllCollections()external view returns (address[] memory){
        return collections;}
}