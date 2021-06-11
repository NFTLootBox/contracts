const hre = require("hardhat");
const { Contract, utils, providers, constants, BigNumber } = require("ethers")

const LootAddress = "0x49a2264eB146f0160a1F4CA0acCeC9a66784DC27";
const LootLPAddress = "0xa6d044677360bdc9b688d64cf3b07aaca252e4fb";
const OwnerAddress = '0x4E4aeed836e77ae7591776cAE750A720a38ca892'

async function main() {
  await hre.run("compile");

  const NFT = await hre.ethers.getContractFactory("NFTLootboxNFT");
  console.log("NFT: ")
  const nft = await NFT.deploy();
  console.log("nft: ")
  const JunkToken = await hre.ethers.getContractFactory("JunkToken");
  console.log("JunkToken: ")
  const junkToken = await JunkToken.deploy("NFTLootBox Junk", "JUNK");
  console.log("junkToken: ")
  const SilverToken = await hre.ethers.getContractFactory("SilverToken");
  console.log("SilverToken: ")
  const silverToken = await SilverToken.deploy("NFTLootBox Silver", "SILVER");
  console.log("silverToken: ")
  const GoldToken = await hre.ethers.getContractFactory("GoldToken");
  console.log("GoldToken: ")
  const goldToken = await GoldToken.deploy("NFTLootBox Gold", "GOLD");
  console.log("goldToken: ")
  const NFTLootbox = await hre.ethers.getContractFactory("NFTLootbox");
  console.log("NFTLootbox: ")
  const nftLootbox = await NFTLootbox.deploy(
    OwnerAddress
  );
  console.log("nftlootbox: ")
  
  await nft.deployed();
 // const SWAP = await hre.ethers.getContractFactory("SWAP");
 // const swap = await SWAP.deploy(OwnerAddress, nft.address);
 // console.log("swap: ");
  await junkToken.deployed();
  console.log("junktoken deployed")
  await silverToken.deployed();
  console.log("silverToken deployed")
  await goldToken.deployed();
  console.log("goldToken deployed")
  await nftLootbox.deployed();
  console.log("nftLootbox deployed")
  // await swap.deployed()
  // console.log("swap deployed")

  const LOOTStakingPool = await hre.ethers.getContractFactory(
    "LOOTStakingPool"
  );
  console.log("LOOTStakingPool: ")
  const lootStakingPool = await LOOTStakingPool.deploy(
    LootAddress,
    silverToken.address
  );
  console.log("LootStakingPool: ")
  const LPStakingPool = await hre.ethers.getContractFactory("LPStakingPool");
  console.log("LPStakingPool: ")
  const lpStakingPool = await LPStakingPool.deploy(
    LootLPAddress,
    goldToken.address
  );
  console.log("lpStakingPool: ")

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
  console.log("BOOST: ")
  const boost = await BOOST.deploy(
    1,
    nft.address,
    lootStakingPool.address,
    lpStakingPool.address
  );
  console.log("boost: ");
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
  // console.log(`export const SwapAddress = ${swap.address}`)
  console.log("SAVE THESE LINES THIS IS CRUCIAL")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
