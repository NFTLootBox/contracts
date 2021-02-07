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

    event Bet(uint256 indexed bet, uint256 amount, address account, uint256 lootboxID, uint256 seed, uint256 nonce);
    event UpdateLootbox(uint256 indexed id, address paymentToken, uint256 price);

    mapping(uint256 => address) public lootboxPaymentToken;
    mapping(uint256 => uint256) public lootboxPrice;
    address public transferAddress;
    address public authAddress;
    address private feeAddress = 0x4Cf135b4f0236B0fC55DfA9a09B25843416cE023;

    uint256 public totalBets;
    mapping(uint256 => address) public claimedBet;
    mapping(uint256 => uint256) public claimedBetAmount;

    function submitBet(uint256 lootboxID, uint256 seed, uint256 bets) public nonReentrant {
        require(lootboxPaymentToken[lootboxID] != address(0), "Invalid Lootbox");
        require(lootboxPrice[lootboxID] > 0, "Invalid Lootbox");
        require(bets > 0, "Must place bets");
        totalBets = totalBets.add(1);
        claimedBet[totalBets] = _msgSender();
        claimedBetAmount[totalBets] = bets;
        emit Bet(totalBets, bets, _msgSender(), lootboxID, seed, 1);
        uint256 cost = lootboxPrice[lootboxID].mul(1e18).mul(bets);
        uint256 keep = cost.div(10);
        IERC20(lootboxPaymentToken[lootboxID]).transferFrom(_msgSender(), feeAddress, keep);
        IERC20(lootboxPaymentToken[lootboxID]).transferFrom(_msgSender(), address(this), cost.sub(keep));
        IERC20(lootboxPaymentToken[lootboxID]).burn(cost.sub(keep));
    }

    function redeemERC1155(address asset, uint256 id, uint256 amount, uint256 bet, uint8 v, bytes32 r, bytes32 s) public nonReentrant {
        require(claimedBet[bet] == _msgSender(), "Invalid bet");
        bytes32 hash = keccak256(abi.encode(asset, id, amount, bet));
        address signer = ecrecover(hash, v, r, s);
        require(signer == authAddress, "Invalid signature");
        claimedBet[bet] = address(0);
        IERC1155(asset).safeTransferFrom(transferAddress, _msgSender(), id, amount, "");
    }

    function redeemERC1155Bulk(address asset, uint256[] calldata id, uint256[] calldata amount, uint256 bet, uint8 v, bytes32 r, bytes32 s) public nonReentrant {
        require(claimedBet[bet] == _msgSender(), "Invalid bet");
        require(id.length == amount.length, "invalid array sizes");
        bytes32 hash = keccak256(abi.encode(asset, id, amount, bet));
        address signer = ecrecover(hash, v, r, s);
        require(signer == authAddress, "Invalid signature");
        claimedBet[bet] = address(0);
        IERC1155(asset).safeBatchTransferFrom(transferAddress, _msgSender(), id, amount, "");
    }
    
    function redeemERC20(address asset, uint256 id, uint256 amount, uint256 bet, uint8 v, bytes32 r, bytes32 s) public nonReentrant {
        require(claimedBet[bet] == _msgSender(), "Invalid bet");
        bytes32 hash = keccak256(abi.encode(asset, id, amount, bet));
        address signer = ecrecover(hash, v, r, s);
        require(signer == authAddress, "Invalid signature");
        claimedBet[bet] = address(0);
        IERC20(asset).transferFrom(transferAddress, _msgSender(), amount);
    }

    // function redeemBulkERC20(address asset, uint256 id, uint256 amount, uint256[] calldata bet, uint8 v, bytes32 r, bytes32 s) public nonReentrant {
    //     bytes32 hash = keccak256(abi.encode(asset, id, amount, bet[0]));
    //     address signer = ecrecover(hash, v, r, s);
    //     require(signer == authAddress, "Invalid signature");
    //     for (uint256 i = 0; i < bet.length; i++) {
    //         require(claimedBet[bet[i]] == _msgSender(), "Invalid bet");
    //         claimedBet[bet[i]] = address(0);
    //     }
    //     IERC20(asset).transferFrom(transferAddress, _msgSender(), amount * bet.length);
    // }

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
