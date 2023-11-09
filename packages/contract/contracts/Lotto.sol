// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";

import "hardhat/console.sol";

contract Lotto is Ownable, Pausable, ReentrancyGuard {
    struct Round {
        address nft;
        uint256 blockHeight;
        uint256 prize;
        address winner;
    }

    uint256 public totalRounds;

    mapping(uint256 => uint256) public roundIdByBlockHeight;
    mapping(uint256 => Round) public roundByIndex;

    event PrizeClaimed(uint256 roundIndex);

    constructor() {}

    function startNewRound(
        address _nft,
        uint256 _blockHeight,
        uint256 _prize
    ) external payable onlyOwner {
        require(
            block.number < _blockHeight,
            "Unlock time should be in the future"
        );
        require(msg.value == _prize, "Prize should be equal to msg.value");

        roundIdByBlockHeight[_blockHeight] = totalRounds;
        roundByIndex[totalRounds] = Round(
            _nft,
            _blockHeight,
            _prize,
            address(0)
        );

        totalRounds++;
    }

    function claimPrize(
        uint256 _roundIndex,
        uint256 _tokenId,
        bytes memory _signature
    ) external nonReentrant {
        require(
            block.timestamp >= roundByIndex[_roundIndex].blockHeight,
            "You can't withdraw yet"
        );
        require(
            roundByIndex[_roundIndex].winner == address(0),
            "Round already claimed"
        );

        // Validate signature
        bytes32 message = keccak256(
            abi.encodePacked(roundByIndex[_roundIndex].blockHeight, _tokenId)
        );

        bytes32 messageHash = ECDSA.toEthSignedMessageHash(message);
        address signer = ECDSA.recover(messageHash, _signature);

        require(signer == owner(), "Invalid signature");

        // Check if NFT is owned by caller
        require(
            IERC721(roundByIndex[_roundIndex].nft).ownerOf(_tokenId) ==
                msg.sender,
            "You don't own this NFT"
        );

        roundByIndex[_roundIndex].winner = msg.sender;

        emit PrizeClaimed(_roundIndex);

        payable(msg.sender).transfer(roundByIndex[_roundIndex].prize);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function roundByBlockHeight(
        uint256 _blockHeight
    ) external view returns (Round memory) {
        return roundByIndex[roundIdByBlockHeight[_blockHeight]];
    }

    function rounds(
        uint256 _skip,
        uint256 _limit
    ) external view returns (Round[] memory) {
        Round[] memory _rounds = new Round[](_limit);

        for (uint256 i = _skip; i < _skip + _limit; i++) {
            _rounds[i] = roundByIndex[_skip + i];
        }

        return _rounds;
    }
}
