const hre = require("hardhat");

const LootAddress = "0x728852a637cADA1F0C4201a140b9190956c1444c";
const LootLPAddress = "0x728852a637cADA1F0C4201a140b9190956c1444c";

async function main() {
  await hre.run("compile");

  const NFT = await hre.ethers.getContractFactory("NFTLootboxNFT");
  const nft = await NFT.deploy();
  const JunkToken = await hre.ethers.getContractFactory("JunkToken");
  const junkToken = await JunkToken.deploy("NFTLootBox Junk", "JUNK");
  const SilverToken = await hre.ethers.getContractFactory("SilverToken");
  const silverToken = await SilverToken.deploy("NFTLootBox Silver", "SILVER");
  const GoldToken = await hre.ethers.getContractFactory("GoldToken");
  const goldToken = await GoldToken.deploy("NFTLootBox Gold", "GOLD");
  const NFTLootbox = await hre.ethers.getContractFactory("NFTLootbox");
  const nftLootbox = await NFTLootbox.deploy(
    "0x4Cf135b4f0236B0fC55DfA9a09B25843416cE023"
  );

  await nft.deployed();
  await junkToken.deployed();
  await silverToken.deployed();
  await goldToken.deployed();
  await nftLootbox.deployed();

  const LOOTStakingPool = await hre.ethers.getContractFactory(
    "LOOTStakingPool"
  );
  const lootStakingPool = await LOOTStakingPool.deploy(
    LootAddress,
    silverToken.address
  );
  const LPStakingPool = await hre.ethers.getContractFactory("LPStakingPool");
  const lpStakingPool = await LPStakingPool.deploy(
    LootLPAddress,
    goldToken.address
  );

  await lootStakingPool.deployed();
  await lpStakingPool.deployed();

  await silverToken.setPool(lootStakingPool.address);
  await goldToken.setPool(lpStakingPool.address);

  const BOOST = await hre.ethers.getContractFactory("Boost");
  const boost = await BOOST.deploy(
    1,
    nft.address,
    lootStakingPool.address,
    lpStakingPool.address
  );
  await boost.deployed();
  await lootStakingPool.setBoostContract(boost.address);
  await lpStakingPool.setBoostContract(boost.address);

  console.clear();
  console.log(`export const LootAddress = "${LootAddress}";`);
  console.log(`export const LootLPAddress = "${LootLPAddress}";`);
  console.log(`export const JunkAddress = "${junkToken.address}";`);
  console.log(`export const SilverAddress = "${silverToken.address}";`);
  console.log(`export const GoldAddress = "${goldToken.address}";`);
  console.log(`export const LootFarmAddress = "${lootStakingPool.address}";`);
  console.log(`export const LPFarmAddress = "${lpStakingPool.address}";`);
  console.log(`export const LootboxAddress = "${nftLootbox.address}";`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
