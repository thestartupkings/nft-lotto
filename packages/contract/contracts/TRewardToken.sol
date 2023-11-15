// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TRewardToken is ERC20 {
    constructor() ERC20("Test Reward Token", "TRT") {}

    function mint(uint256 _amount) external {
        _mint(msg.sender, _amount);
    }
}
