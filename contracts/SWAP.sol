pragma solidity 0.7.3;

import "./lib/Context.sol";
import "./lib/IERC1155.sol";
import "./lib/SafeMath.sol";
import "./lib/ReentrancyGuard.sol";
import "./NFT.sol"

contract SWAP is Context, ReentrancyGuard {
    
    mapping(address => uint256) public swappedNFTs;
    // this should have an array of each nft that is to be swapped along with the quantity of each
    address public awardedNFT;
    address public user

    constructor(){

    }

    //the ten nfts need to be burned
    // the one nft is awarded to the user
}