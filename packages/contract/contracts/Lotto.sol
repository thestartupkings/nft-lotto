// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract Lotto is Ownable, Pausable, ReentrancyGuard {
    struct Round {
        address nft;
        uint256 from;
        uint256 to;
        uint256 blockHeight;
        address token;
        uint256 prize;
        address winner;
    }

    uint256 public totalRounds;

    mapping(uint256 => uint256) public roundIdByBlockHeight;
    mapping(uint256 => Round) public roundByIndex;
    mapping(address => mapping(uint256 => uint256)) private _userRounds;
    mapping(address => uint256) public userWinCount;

    address public signer;
    mapping(address => bool) public admins;

    event RoundStarted(
        uint256 roundIndex,
        address nft,
        uint256 from,
        uint256 to,
        uint256 blockHeight,
        address token,
        uint256 prize,
        address creator
    );
    event RoundPrizeChanged(uint256 roundIndex, uint256 from, uint256 to);
    event PrizeClaimed(uint256 roundIndex);

    constructor(address _signer) {
        signer = _signer;
        admins[msg.sender] = true;
    }

    function startNewRound(
        address _nft,
        uint256 _from,
        uint256 _to,
        uint256 _blockHeight,
        address _token,
        uint256 _prize
    ) external onlyAdmin {
        require(
            block.number < _blockHeight,
            "Unlock time should be in the future"
        );
        bool result = IERC20(_token).transferFrom(
            msg.sender,
            address(this),
            _prize
        );
        require(result, "Transfer failed");

        require(
            totalRounds == 0 ||
                (totalRounds > 0 && roundIdByBlockHeight[_blockHeight] == 0),
            "Round already exist for given block height"
        );

        roundIdByBlockHeight[_blockHeight] = totalRounds;
        roundByIndex[totalRounds] = Round(
            _nft,
            _from,
            _to,
            _blockHeight,
            _token,
            _prize,
            address(0)
        );

        emit RoundStarted(
            totalRounds,
            _nft,
            _from,
            _to,
            _blockHeight,
            _token,
            _prize,
            msg.sender
        );

        totalRounds++;
    }

    function addPrize(uint256 _roundIndex, uint256 _amount) external onlyAdmin {
        require(
            block.number < roundByIndex[_roundIndex].blockHeight,
            "Round already finished"
        );
        bool result = IERC20(roundByIndex[_roundIndex].token).transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        require(result, "Transfer failed");

        uint256 oldPrize = roundByIndex[_roundIndex].prize;

        roundByIndex[_roundIndex].prize += _amount;
        emit RoundPrizeChanged(
            _roundIndex,
            oldPrize,
            roundByIndex[_roundIndex].prize
        );
    }

    function deductPrize(
        uint256 _roundIndex,
        uint256 _amount
    ) external onlyAdmin {
        require(
            block.number < roundByIndex[_roundIndex].blockHeight,
            "Round already finished"
        );

        uint256 oldPrize = roundByIndex[_roundIndex].prize;
        require(oldPrize > _amount, "Prize should not be negative");

        roundByIndex[_roundIndex].prize -= _amount;

        bool result = IERC20(roundByIndex[_roundIndex].token).transfer(
            msg.sender,
            _amount
        );
        require(result, "Transfer failed");

        emit RoundPrizeChanged(
            _roundIndex,
            oldPrize,
            roundByIndex[_roundIndex].prize
        );
    }

    function claimPrize(
        uint256 _roundIndex,
        uint256 _tokenId,
        bytes memory _signature
    ) external nonReentrant {
        require(
            block.number >= roundByIndex[_roundIndex].blockHeight,
            "You can't claim yet"
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
        address _signer = ECDSA.recover(messageHash, _signature);

        require(_signer == signer, "Invalid signature");

        // Check if NFT is owned by caller
        require(
            IERC721(roundByIndex[_roundIndex].nft).ownerOf(_tokenId) ==
                msg.sender,
            "You don't own this NFT"
        );

        roundByIndex[_roundIndex].winner = msg.sender;
        _userRounds[msg.sender][userWinCount[msg.sender]] = _roundIndex;
        userWinCount[msg.sender]++;

        // Transfer prize
        bool result = IERC20(roundByIndex[_roundIndex].token).transfer(
            msg.sender,
            roundByIndex[_roundIndex].prize
        );
        require(result, "Transfer failed");

        emit PrizeClaimed(_roundIndex);
    }

    function setSigner(address _signer) external onlyOwner {
        signer = _signer;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function addAdmin(address _admin) external onlyOwner {
        admins[_admin] = true;
    }

    function removeAdmin(address _admin) external onlyOwner {
        admins[_admin] = false;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admin can call this function");
        _;
    }

    function currentRound() external view returns (Round memory, uint256) {
        return (roundByIndex[totalRounds - 1], totalRounds - 1);
    }

    function roundByBlockHeight(
        uint256 _blockHeight
    ) external view returns (Round memory) {
        return roundByIndex[roundIdByBlockHeight[_blockHeight]];
    }

    function roundOfUserByIndex(
        address _user,
        uint256 _index
    ) external view returns (Round memory) {
        return roundByIndex[_userRounds[_user][_index]];
    }

    function roundsOfUser(
        address _user,
        uint256 _skip,
        uint256 _limit
    ) external view returns (Round[] memory, uint256[] memory) {
        require(
            _skip + _limit <= userWinCount[_user],
            "Skip should be less than win count"
        );

        uint256[] memory _roundIds = new uint256[](_limit);
        Round[] memory _rounds = new Round[](_limit);

        for (uint256 i = _skip; i < _skip + _limit; i++) {
            _roundIds[i] = _userRounds[_user][_skip + i];
            _rounds[i] = roundByIndex[_roundIds[i]];
        }

        return (_rounds, _roundIds);
    }

    function rounds(
        uint256 _skip,
        uint256 _limit
    ) external view returns (Round[] memory) {
        require(
            _skip + _limit <= totalRounds,
            "Skip should be less than total rounds"
        );

        Round[] memory _rounds = new Round[](_limit);

        for (uint256 i = _skip; i < _skip + _limit; i++) {
            _rounds[i] = roundByIndex[_skip + i];
        }

        return _rounds;
    }
}
