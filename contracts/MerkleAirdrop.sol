// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MerkleAirdrop is Ownable {
    IERC20 public token;

    bytes32 public merkleRoot;

    mapping(address => bool) public hasClaimed;

    event Claimed(address indexed account, uint256 amount);

    constructor(IERC20 _token, bytes32 _merkleRoot) Ownable(msg.sender) {

        token = _token;

        merkleRoot = _merkleRoot;
    }

    function claim(uint256 amount, bytes32[] calldata merkleProof) external {

        require(!hasClaimed[msg.sender], "Airdrop already claimed.");

        // Verify the Merkle proof
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));

        require(MerkleProof.verify(merkleProof, merkleRoot, leaf), "Invalid proof.");

        // Mark it claimed and send the token
        hasClaimed[msg.sender] = true;

        require(token.transfer(msg.sender, amount), "Token transfer failed.");

        emit Claimed(msg.sender, amount);
    }

    // Function to update the Merkle root
    function updateMerkleRoot(bytes32 newMerkleRoot) external onlyOwner {

        merkleRoot = newMerkleRoot;
    }

    // Function to withdraw remaining tokens
    function withdrawTokens(address to, uint256 amount) external onlyOwner {
        
        require(token.transfer(to, amount), "Token transfer failed.");
    }
}
