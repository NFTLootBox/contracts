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
    goerli: {
      url: "https://goerli.infura.io/v3/28e9dd7155b44af0941ec69ac475cec3",
      accounts: [
        "0xc003ea0a9724e656716da1be6ffff14b008d7bb735d91c2bd40f4728f693bf18",
      ],
    }
  },
  abiExporter: {
    path: './data/abi',
    clear: true,
    flat: false,
  },
};
