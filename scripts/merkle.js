const { MerkleTree } = require('merkletreejs');

const keccak256 = require('keccak256');

const fs = require('fs');

const csv = require('csv-parser');

const addresses = [];

const csvData = [];

// Read the CSV file
fs.createReadStream('airdrop.csv')

  .pipe(csv())

  .on('data', (row) => {

    const address = row.address.trim();

    const amount = row.amount.trim();

    const hash = keccak256(address + amount);

    addresses.push(hash);

    csvData.push({ address, amount });
  })
  .on('end', () => {
    // Generate the Merkle Tree
    const merkleTree = new MerkleTree(addresses, keccak256, { sortPairs: true });

    const root = merkleTree.getRoot().toString('hex');

    console.log('Merkle Root:', root);

    // Save the root to a file
    fs.writeFileSync('merkleRoot.txt', root);

    console.log('Merkle tree and root have been generated and saved.');

    // Generate and save proofs for each address
    csvData.forEach(({ address, amount }) => {

      const leaf = keccak256(address + amount);

      const proof = merkleTree.getHexProof(leaf);

      console.log(`Proof for ${address}:`, proof);

      // save each proof to a file
      fs.writeFileSync(`proof-${address}.json`, JSON.stringify(proof));
    });
  });

