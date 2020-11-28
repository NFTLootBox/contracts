// SPDX-License-Identifier: MIT

pragma solidity 0.7.3;

import "./lib/SafeMath.sol";
import "./lib/IERC20.sol";
import "./lib/Context.sol";
import "./lib/ReentrancyGuard.sol";

contract LOOTStakingPool is ReentrancyGuard, Context {
  using SafeMath for uint256;

  constructor(address _loot, address _silver) {
    LOOT = IERC20(_loot);
    SILVER = IERC20(_silver);
  }

  IERC20 private LOOT;
  IERC20 private SILVER;

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
    return reward[account].add(blockTime.sub(lastUpdateTime[account]).mul(1e18).div(86400).mul(balanceOf(account).div(1e18)));
  }

  function stake(uint256 amount) public updateReward(_msgSender()) nonReentrant {
    stakedBalance[_msgSender()] = stakedBalance[_msgSender()].add(amount);
    LOOT.transferFrom(_msgSender(), address(this), amount);
    emit Staked(_msgSender(), amount);
  }

  function withdraw(uint256 amount) public updateReward(_msgSender()) nonReentrant {
    require(amount > 0, "Cannot withdraw 0");
    require(amount <= balanceOf(_msgSender()), "Cannot withdraw more than balance");
    LOOT.transfer(_msgSender(), amount);
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
    // SILVER.mint(_msgSender(), amount);
    emit Redeem(_msgSender(), amount);
  }
}
