const hre = require("hardhat");
const { Contract, utils, providers, constants, BigNumber } = require("ethers")

const LootAddress = "0x7fE690f4D4A5a7595F0bBaB59F15d5D2DBDB12D2";
const LootLPAddress = "0x51e6117a70b432592a70572bf6f9e59db3f21c3d";
const OwnerAddress = '0xcE329eB69fdc71D43A0865EbF3d72c3a11A752bF'

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
    OwnerAddress
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
  await junkToken.setPool(OwnerAddress);
  // await junkToken.approve(OwnerAddress, constants.MaxUint256)
  await junkToken.approve(nftLootbox.address, constants.MaxUint256)
  await junkToken.increaseAllowance(nftLootbox.address, 1000000000)
  // await silverToken.approve(OwnerAddress, 100000000)
  // await goldToken.approve(OwnerAddress, 100000000)

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
  await nftLootbox.updateLootbox(1, silverToken.address, 1)
  await nftLootbox.updateLootbox(2, goldToken.address, 1)
  await nftLootbox.updateLootbox(3, junkToken.address, 200)
  await nftLootbox.setAuthAddress(OwnerAddress)
  await nftLootbox.setTransferAddress(OwnerAddress)
  await nft.setMinter(OwnerAddress, true)
  // await nft.setApprovalForAll(OwnerAddress, true)
  await nft.setApprovalForAll(nftLootbox.address, true)



  console.clear();
  console.log(`export const LootAddress = "${LootAddress}";`);
  console.log(`export const LootLPAddress = "${LootLPAddress}";`);
  console.log(`export const JunkAddress = "${junkToken.address}";`);
  console.log(`export const SilverAddress = "${silverToken.address}";`);
  console.log(`export const GoldAddress = "${goldToken.address}";`);
  console.log(`export const LootFarmAddress = "${lootStakingPool.address}";`);
  console.log(`export const LPFarmAddress = "${lpStakingPool.address}";`);
  console.log(`export const LootboxAddress = "${nftLootbox.address}";`);
  console.log(`export const NFTAddress = "${nft.address}";`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
