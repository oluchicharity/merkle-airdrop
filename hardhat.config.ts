/** @type import('hardhat/config').HardhatUserConfig */
require('dotenv').config()
//require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers")
require('@nomiclabs/hardhat-etherscan');

module.exports = {
  solidity: "0.8.24",
  networks : {
    // hardhat:{},
      sepolia:{
   url:process.env.RPC_URL,
   accounts: [`0x${process.env.PRIVATE_KEY}`],
      },
    },
    etherscan: {
      apiKey:process.env.ETH_SCAN_KEY,
     },
};