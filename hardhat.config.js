require("@nomiclabs/hardhat-waffle");
require('hardhat-abi-exporter');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.3",
  networks: {
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/a7b058549daf4e96ab86db4d25005e7d",
      accounts: [
        "0xbf78b926dce96fcc42023587b290918243f6a0c09695d94005ea7d0376cf8c1a",
      ],
      gas: "auto"
    },
    goerli: {
      url: "https://goerli.infura.io/v3/d6bb37f2857b448ebfb550e005490f39",
      accounts: [
        "0xbf78b926dce96fcc42023587b290918243f6a0c09695d94005ea7d0376cf8c1a",
      ],
      gas: "auto"
    }
  },
  abiExporter: {
    path: './data/abi',
    clear: true,
    flat: false,
  },
};

// https://goerli.infura.io/v3/d6bb37f2857b448ebfb550e005490f39
// https://mainnet.infura.io/v3/274e5929f1c74c08b44478e6e4abef8d