// SPDX-License-Identifier: MIT

pragma solidity 0.7.3;

import "./lib/Context.sol";
import "./lib/SafeMath.sol";
import "./lib/Ownable.sol";
import "./lib/IERC20.sol";
import "./lib/ReentrancyGuard.sol";

contract NFTLootbox is Context, Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    constructor (address _transferAddress) {
        transferAddress = _transferAddress;
    }

    event Bet(address account, uint256 lootboxID, uint256 seed, uint256 bets);
    event UpdateLootbox(uint256 indexed id, address paymentToken, uint256 price);

    mapping(uint256 => address) public lootboxPaymentToken;
    mapping(uint256 => uint256) public lootboxPrice;
    address public transferAddress;

    function bet(uint256 lootboxID, uint256 seed, uint256 bets) public nonReentrant {
        require(lootboxPaymentToken[lootboxID] != address(0), "Invalid Lootbox");
        require(lootboxPrice[lootboxID] > 0, "Invalid Lootbox");
        require(bets > 0, "Must place bets");
        uint256 transferAmount = lootboxPrice[lootboxID].mul(bets);
        IERC20(lootboxPaymentToken[lootboxID]).transferFrom(_msgSender(), transferAddress, transferAmount);
        emit Bet(_msgSender(), lootboxID, seed, bets);
    }

    // function redeemERC1155()
    // function redeemERC20()

    function setTransferAddress(address _address) public onlyOwner nonReentrant {
        transferAddress = _address;
    }

    function updateLootbox(uint256 id, address paymentTokenAddress, uint256 price) public onlyOwner nonReentrant {
        lootboxPrice[id] = price;
        lootboxPaymentToken[id] = paymentTokenAddress;
        emit UpdateLootbox(id, paymentTokenAddress, price);
    }
}
