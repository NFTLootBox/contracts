require("@nomiclabs/hardhat-waffle");

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
      url:
        "https://eth-goerli.alchemyapi.io/v2/-pLWJIKhK8OxF1qNxqgwCkSYSrzRKT3n",
      accounts: [
        "0xc9a996bad4f86e1485b36e551b2e9c05ddd09b365940beff21da501539cfb0b0",
      ],
    },
    ganache: {
      url: "http://localhost:8545",
      accounts: [
        "0xc9a996bad4f86e1485b36e551b2e9c05ddd09b365940beff21da501539cfb0b0",
      ],
    },
  },
};
