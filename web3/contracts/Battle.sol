// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract CodingBattle {
    address public player1;
    address public player2;
    uint256 public stake;
    address public winner;
    bool public gameStarted;
    bool public gameEnded;

    constructor() {
        gameStarted = false;
        gameEnded = false;
    }

    modifier onlyPlayers() {
        require(msg.sender == player1 || msg.sender == player2, "Not a participant");
        _;
    }

    function joinGame() external payable {
        require(!gameStarted, "Game already started");
        require(msg.value == 0.001 ether, "Incorrect entry fee");

        if (player1 == address(0)) {
            player1 = msg.sender;
        } else {
            require(player2 == address(0), "Game is full");
            player2 = msg.sender;
            gameStarted = true;
            stake = address(this).balance;
        }
    }

    function submitSolution(bool isCorrect) external onlyPlayers {
        require(gameStarted, "Game not started");
        require(!gameEnded, "Game already ended");

        if (isCorrect) {
            winner = msg.sender;
            gameEnded = true;
            payable(winner).transfer(stake);
        }
    }
}
