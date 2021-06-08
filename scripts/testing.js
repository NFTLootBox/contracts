const hre = require("hardhat");
const { Contract, utils, providers, constants, BigNumber } = require("ethers")

const OwnerAddress = '0x0633E36952d2f85675a340984BaA532949793c7D'
const LootAddress = "0x7b3D36Eb606f873A75A6aB68f8c999848B04F935";
const LootLPAddress = "0x5bab10d7b7d43867403ac5f908fe344932fa3496";
const JunkAddress = "0x3046d4b8B802D7D024D39ee6fb3044b1097Abe90";
const SilverAddress = "0x59F45DbaB3d265082993EdA387F496fEe97fda4B";
const GoldAddress = "0xA970B99bA54eCc8AbF284D1249607676c91868Eb";
const LootFarmAddress = "0x7c90cde29F475C3d9687c981dBaC47D344CbDa6d";
const LPFarmAddress = "0x9816C7EFADE418A3d76B8daD56fb7D1697E91beD";
const LootboxAddress = "0xE8FD41D71AAFcb6805B9B5e618343A9f8bc767A8";
const NFTAddress = "0x9f75A77966ADE660782f73f822c836C32BE6784a";

async function main() {
  await hre.run("compile");

  // const NFT = await hre.ethers.getContractFactory("NFTLootboxNFT");
  // const nft = await NFT.deploy();
  // const JunkToken = await hre.ethers.getContractFactory("JunkToken");
  // const junkToken = await JunkToken.deploy("NFTLootBox Junk", "JUNK");
  // const SilverToken = await hre.ethers.getContractFactory("SilverToken");
  // const silverToken = await SilverToken.deploy("NFTLootBox Silver", "SILVER");
  // const GoldToken = await hre.ethers.getContractFactory("GoldToken");
  // const goldToken = await GoldToken.deploy("NFTLootBox Gold", "GOLD");
  const NFTLootbox = await hre.ethers.getContractFactory("NFTLootbox");
  const nftLootbox = await NFTLootbox.deploy(
    OwnerAddress
  );

  // await nft.deployed();
  // await junkToken.deployed();
  // await silverToken.deployed();
  // await goldToken.deployed();
  await nftLootbox.deployed();

  // const LOOTStakingPool = await hre.ethers.getContractFactory(
  //   "LOOTStakingPool"
  // );
  // const lootStakingPool = await LOOTStakingPool.deploy(
  //   LootAddress,
  //   silverToken.address
  // );
  // const LPStakingPool = await hre.ethers.getContractFactory("LPStakingPool");
  // const lpStakingPool = await LPStakingPool.deploy(
  //   LootLPAddress,
  //   goldToken.address
  // );

  // await lootStakingPool.deployed();
  // await lpStakingPool.deployed();

  // await silverToken.setPool(lootStakingPool.address);
  // await goldToken.setPool(lpStakingPool.address);
  // await junkToken.setPool(OwnerAddress);
  // await junkToken.approve(OwnerAddress, constants.MaxUint256)
          // await junkToken.approve(nftLootbox.address, constants.MaxUint256)
          // await junkToken.increaseAllowance(nftLootbox.address, 1000000000)
  // await silverToken.approve(OwnerAddress, 100000000)
  // await goldToken.approve(OwnerAddress, 100000000)

  // const BOOST = await hre.ethers.getContractFactory("Boost");
  // const boost = await BOOST.deploy(
  //   1,
  //   nft.address,
  //   lootStakingPool.address,
  //   lpStakingPool.address
  // );
  // await boost.deployed();
  // await lootStakingPool.setBoostContract(boost.address);
  // await lpStakingPool.setBoostContract(boost.address);
  await nftLootbox.updateLootbox(1, SilverAddress, 1)
  await nftLootbox.updateLootbox(2, GoldAddress, 1)
  await nftLootbox.updateLootbox(3, JunkAddress, 200)
  await nftLootbox.setAuthAddress(OwnerAddress)
  await nftLootbox.setTransferAddress(OwnerAddress)
  // await nft.setMinter(OwnerAddress, true)
  // await nft.setApprovalForAll(OwnerAddress, true)
          // await nft.setApprovalForAll(nftLootbox.address, true)



  console.clear();
  console.log(`export const LootAddress = "${LootAddress}";`);
  console.log(`export const LootLPAddress = "${LootLPAddress}";`);
  console.log(`export const JunkAddress = "${JunkAddress}";`);
  console.log(`export const SilverAddress = "${SilverAddress}";`);
  console.log(`export const GoldAddress = "${GoldAddress}";`);
  console.log(`export const LootFarmAddress = "${LootFarmAddress}";`);
  console.log(`export const LPFarmAddress = "${LPFarmAddress}";`);
  console.log(`export const LootboxAddress = "${nftLootbox.address}";`);
  console.log(`export const NFTAddress = "${NFTAddress}";`);
  console.log("SAVE THESE LINES THIS IS CRUCIAL")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
