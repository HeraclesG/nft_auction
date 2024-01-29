require('@nomiclabs/hardhat-waffle')
require('dotenv').config()

const SEPOLIA_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;

const SCAN_API_KEY_SEPOLIA = process.env.SCAN_API_KEY_SEPOLIA;

module.exports = {
  networks: {
    sepolia: {
      chainId: 11155111,
      url: `https://eth-sepolia.g.alchemy.com/v2/r24vXvM3fi53zBdclFRC79MOyMx7w5k-`, 
      accounts: [SEPOLIA_PRIVATE_KEY? SEPOLIA_PRIVATE_KEY : ""]
    },
  },
  solidity: {
    version: '0.8.11',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: './src/contracts',
    artifacts: './src/abis',
  },
  mocha: {
    timeout: 40000,
  },
}
