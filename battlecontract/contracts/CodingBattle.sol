// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract CodingBattle {
    struct Player {
        address addr;
        bool hasJoined;
        bool hasSubmitted;
        bool isWinner;
    }

    mapping(address => Player) public players;
    address[] public playerAddresses; // Array to track player addresses
    uint256 public prizePool;
    address public winner;

    modifier onlyPlayer() {
        require(players[msg.sender].hasJoined, "You must join the game first");
        _;
    }

    function joinGame() external payable {
        require(msg.value == 0.0001 ether, "Must send exactly 0.0001 ETH to join");
        require(!players[msg.sender].hasJoined, "Player has already joined");

        players[msg.sender] = Player(msg.sender, true, false, false);
        playerAddresses.push(msg.sender); // Add the player's address to the array
        prizePool += msg.value;
    }

    function submitSolution(bool isCorrect) external onlyPlayer {
        players[msg.sender].hasSubmitted = true;
        if (isCorrect) {
            players[msg.sender].isWinner = true;
        }
    }

    function getWinner() external view returns (address) {
        return winner;
    }

    function declareWinner(address _winner) external {
        require(players[_winner].isWinner, "Player is not marked as winner");
        winner = _winner;
        payable(winner).transfer(prizePool);
        resetGame();
    }

    function resetGame() internal {
        prizePool = 0;
        winner = address(0);
        // Reset all players
        for (uint256 i = 0; i < playerAddresses.length; i++) {
            delete players[playerAddresses[i]];
        }
        delete playerAddresses; // Clear the playerAddresses array
    }
}
