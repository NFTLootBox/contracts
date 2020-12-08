// SPDX-License-Identifier: MIT

pragma solidity 0.7.3;

import "./lib/SafeMath.sol";
import "./lib/IERC20.sol";
import "./lib/Context.sol";
import "./lib/ReentrancyGuard.sol";

contract LPStakingPool is ReentrancyGuard, Context {
  using SafeMath for uint256;

  constructor(address _lp, address _gold) {
    LP = IERC20(_lp);
    GOLD = IERC20(_gold);
  }

  IERC20 private LP;
  IERC20 private GOLD;

  address private feeAddress = 0x4Cf135b4f0236B0fC55DfA9a09B25843416cE023;

  mapping(address => uint256) private stakedBalance;
  mapping(address => uint256) public lastUpdateTime;
  mapping(address => uint256) public reward;

  event Staked(address indexed user, uint256 amount);
  event Unstake(address indexed user, uint256 amount);
  event Redeem(address indexed user, uint256 amount);

  modifier updateReward(address account) {
    if (account != address(0)) {
      reward[account] = earned(account);
      lastUpdateTime[account] = block.timestamp;
    }
    _;
  }

  function balanceOf(address account) public view returns (uint256) {
    return stakedBalance[account];
  }

  function earned(address account) public view returns (uint256) {
    uint256 blockTime = block.timestamp;
    return reward[account].add(blockTime.sub(lastUpdateTime[account]).mul(1e18).div(43200).mul(balanceOf(account).div(1e19)));
  }

  function stake(uint256 amount) public updateReward(_msgSender()) nonReentrant {
    require(amount >= 100, "Too small stake");
    uint256 fee = amount.div(100);
    uint256 stakeAmount = amount.sub(fee);
    stakedBalance[_msgSender()] = stakedBalance[_msgSender()].add(stakeAmount);
    LP.transferFrom(_msgSender(), address(this), amount);
    LP.transfer(feeAddress, fee);
    emit Staked(_msgSender(), stakeAmount);
  }

  function withdraw(uint256 amount) public updateReward(_msgSender()) nonReentrant {
    require(amount > 0, "Cannot withdraw 0");
    require(amount <= balanceOf(_msgSender()), "Cannot withdraw more than balance");
    LP.transfer(_msgSender(), amount);
    stakedBalance[_msgSender()] = stakedBalance[_msgSender()].sub(amount);
    emit Unstake(_msgSender(), amount);
  }

  function exit() external {
    withdraw(balanceOf(_msgSender()));
  }
    
  function redeem() public updateReward(_msgSender()) nonReentrant {
    require(reward[_msgSender()] > 0, "Nothing to redeem");
    uint256 amount = reward[_msgSender()];
    reward[_msgSender()] = 0;
    GOLD.mint(_msgSender(), amount);
    emit Redeem(_msgSender(), amount);
  }
}
