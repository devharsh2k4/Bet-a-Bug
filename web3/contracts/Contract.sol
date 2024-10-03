// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


contract BattleContract {
    address payable public player1;
    address payable public player2;
    uint256 public stakeAmount = 0.01 ether;
    uint256 public startTime;
    uint256 public timeLimit = 5 minutes;
    address public winner;
    bool public battleActive;

    enum BattleState { NotStarted, Started, Finished }
    BattleState public state;

    event BattleStarted(address indexed player1, address indexed player2, uint256 startTime);
    event BattleEnded(address indexed winner, uint256 rewardAmount);
    
    constructor() {
        state = BattleState.NotStarted;
    }

    // Function to start the battle by staking Ether
    function startBattle() external payable {
        require(msg.value == stakeAmount, "Must stake exactly 0.01 Ether");
        require(state == BattleState.NotStarted, "Battle already started");

        if (player1 == address(0)) {
            player1 = payable(msg.sender);
        } else {
            player2 = payable(msg.sender);
            startTime = block.timestamp;
            state = BattleState.Started;
            battleActive = true;
            emit BattleStarted(player1, player2, startTime);
        }
    }

    // Function to determine winner
    function endBattle(address _winner) external {
        require(state == BattleState.Started, "Battle has not started");
        require(block.timestamp <= startTime + timeLimit, "Battle time limit exceeded");

        if (_winner == player1 || _winner == player2) {
            winner = _winner;
            uint256 totalReward = address(this).balance;
            payable(winner).transfer(totalReward);
            state = BattleState.Finished;
            emit BattleEnded(winner, totalReward);
        }
    }

    // Function to check if the battle has ended (time limit)
    function checkTimeLimit() external {
        require(state == BattleState.Started, "Battle not started");
        if (block.timestamp > startTime + timeLimit) {
            // No winner within the time, refund stake
            payable(player1).transfer(stakeAmount);
            payable(player2).transfer(stakeAmount);
            state = BattleState.Finished;
        }
    }
}
