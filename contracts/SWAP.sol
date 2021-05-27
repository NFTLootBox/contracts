pragma solidity 0.7.3;

import "./lib/Context.sol";
import "./lib/IERC1155.sol";
import "./lib/SafeMath.sol";
import "./lib/ReentrancyGuard.sol";
import "./NFT.sol"

contract SWAP is Context, ReentrancyGuard {

    address[] public burnedNFTs;
    uint256[] public burnedAmount;
    address public awardedNFT;
    address public user;

    constructor(address[] _burnedAddresses, uint256[] _burnedAmount, address _awardedNFT){
        require(_burnedAddresses.length == _burnedAmount.length);
        //a mapping of rarities and require need to be made to ensure that the swap economy is adhered to
        //creates quantity number for the require statement
        uint quantity = 0;
        for(uint i = 0; i < _burnedAmount.length; i++){
            quantity += _burnedAmount[i];
        }
        require(quantity == 10);
        awardedNFT = _awardedNFT;

        user = _msgSender();
    }

    // This is for users to swap their nfts with the sites inventory
    // in the future users will be able to swap with one another
    function swapWithHouse(){
        //the ten nfts need to be burned
        for(uint i = 0; i < burnedNFTs.length; i++){
            IERC1155("what goes in here?")._burn(_msgSender(), burnedNFTs[i], burnedAmount[i])
        }

        // the one nft is awarded to the user
    }

}
