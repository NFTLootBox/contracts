const hre = require("hardhat");

async function main() {
  await hre.run("compile");

  const SilverToken = await hre.ethers.getContractFactory("SilverToken");
  const silverToken = await SilverToken.deploy("Silver", "SILVER");

  await silverToken.deployed();

  console.log("SilverToken deployed to:", silverToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
