const hre = require("hardhat");
const { Contract, utils, providers, constants, BigNumber } = require("ethers")

const LootAddress = "0x49a2264eB146f0160a1F4CA0acCeC9a66784DC27";
const LootLPAddress = "0xa6d044677360bdc9b688d64cf3b07aaca252e4fb";
const OwnerAddress = '0x6C397b0b585f78D5D981351ab209d02E6559182f'

async function main(){
    await hre.run("compile");

    const ShardToken = await hre.ethers.getContractFactory("GoldToken");
    console.log("ShardToken: ")
    const shardToken = await ShardToken.deploy("NFTLootBox Shard", "SHARD");
    console.log("shardToken: ")

    await shardToken.deployed();
    console.log("shardToken deployed")

    await shardToken.setPool(OwnerAddress);
    console.log(`export const ShardAddress = "${shardToken.address}";`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });