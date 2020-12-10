// SPDX-License-Identifier: MIT

pragma solidity 0.7.3;

import "./lib/Context.sol";
import "./lib/SafeMath.sol";
import "./lib/Ownable.sol";
import "./lib/IERC20.sol";
import "./lib/IERC1155.sol";
import "./lib/ReentrancyGuard.sol";

contract NFTLootbox is Context, Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    constructor (address _transferAddress) {
        transferAddress = _transferAddress;
    }

    event Bet(address account, uint256 lootboxID, uint256 seed, uint256 nonce);
    event UpdateLootbox(uint256 indexed id, address paymentToken, uint256 price);

    mapping(uint256 => address) public lootboxPaymentToken;
    mapping(uint256 => uint256) public lootboxPrice;
    address public transferAddress;
    address public authAddress;

    uint256 public totalBets;
    mapping(uint256 => address) public claimedBet;

    function submitBet(uint256 lootboxID, uint256 seed, uint256 bets) public nonReentrant {
        require(lootboxPaymentToken[lootboxID] != address(0), "Invalid Lootbox");
        require(lootboxPrice[lootboxID] > 0, "Invalid Lootbox");
        require(bets > 0, "Must place bets");
        for (uint256 i; i < bets; i++) {
            claimedBet[totalBets.add(i)] = _msgSender();
            emit Bet(_msgSender(), lootboxID, seed, i);
        }
        totalBets = totalBets.add(bets);
        uint256 transferAmount = lootboxPrice[lootboxID].mul(bets);
        IERC20(lootboxPaymentToken[lootboxID]).transferFrom(_msgSender(), transferAddress, transferAmount);
    }

    function redeemERC1155(address asset, uint256 id, uint256 amount, uint256 bet, uint8 v, bytes32 r, bytes32 s) public nonReentrant {
        require(claimedBet[bet] == _msgSender(), "Invalid bet");
        bytes32 hash = keccak256(abi.encode(asset, id, amount, bet));
        address signer = ecrecover(hash, v, r, s);
        require(signer == authAddress, "Invalid signature");
        claimedBet[bet] = address(0);
        IERC1155(asset).safeTransferFrom(address(this), _msgSender(), id, amount, "");
    }
    
    function redeemERC20(address asset, uint256 id, uint256 amount, uint256 bet, uint8 v, bytes32 r, bytes32 s) public nonReentrant {
        require(claimedBet[bet] == _msgSender(), "Invalid bet");
        bytes32 hash = keccak256(abi.encode(asset, id, amount, bet));
        address signer = ecrecover(hash, v, r, s);
        require(signer == authAddress, "Invalid signature");
        claimedBet[bet] = address(0);
        IERC20(asset).transferFrom(address(this), _msgSender(), amount);
    }

    function setTransferAddress(address _address) public onlyOwner nonReentrant {
        transferAddress = _address;
    }

    function setAuthAddress(address _address) public onlyOwner nonReentrant {
        authAddress = _address;
    }

    function updateLootbox(uint256 id, address paymentTokenAddress, uint256 price) public onlyOwner nonReentrant {
        lootboxPrice[id] = price;
        lootboxPaymentToken[id] = paymentTokenAddress;
        emit UpdateLootbox(id, paymentTokenAddress, price);
    }
}
