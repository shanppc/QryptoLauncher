// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

error Unauthorized();

contract ERC721Token is ERC721 {
    address public creator;
    uint256 private nextTokenId;
    string private baseTokenURI;

    constructor(string memory _name, 
    string memory _symbol, 
    address _creator,string memory _baseTokenURI
    ) ERC721(_name, _symbol) {
    creator = _creator;
    baseTokenURI = _baseTokenURI; 
    }

    function mint(address _to) external  {
        if(msg.sender != creator) {
            revert Unauthorized(); }

        _safeMint(_to, nextTokenId);
        unchecked {
            ++nextTokenId;
        }  
    }

    function _baseURI() internal view  override returns(string memory) {
        return baseTokenURI;
    }

}

contract ERC721Factory {
    address public owner;
    address[] public collections;
    uint256 public fee; 
    
    mapping(address => address[]) public collectionsByUser;
}