// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract TNFT is ERC721Enumerable {
    constructor() ERC721("Test NFT", "TN") {}

    function mint(uint256[] calldata ids) external {
        for (uint256 i = 0; i < ids.length; i++) {
            _safeMint(msg.sender, ids[i]);
        }
    }
}
