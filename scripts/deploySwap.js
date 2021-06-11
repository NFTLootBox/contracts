const hre = require("hardhat");
const { Contract, utils, providers, constants, BigNumber } = require("ethers")

const LootAddress = "0x49a2264eB146f0160a1F4CA0acCeC9a66784DC27";
const LootLPAddress = "0xa6d044677360bdc9b688d64cf3b07aaca252e4fb";
const OwnerAddress = '0x4E4aeed836e77ae7591776cAE750A720a38ca892'

async function main(){
    await hre.run("compile");
    const LootAddress = "0x49a2264eB146f0160a1F4CA0acCeC9a66784DC27";
    const LootLPAddress = "0xa6d044677360bdc9b688d64cf3b07aaca252e4fb";
    const JunkAddress = "0x4bBF98219acAE75CC41d2474E51D2fA32106786B";
    const SilverAddress = "0x531042c3D54e5a1195d422C54D9c983983F52007";
    const GoldAddress = "0x187E7C49Cd99c30a19353e42f60D17e96e8F83b8";
    const LootFarmAddress = "0x25b7cD6c2245a909987ed5BD2A725c17e01F5307";
    const LPFarmAddress = "0x4E84Ea1B0a78534Eba1C5B5d0d3397E4d4510dD5";
    const LootboxAddress = "0x898658D6F1ff51903d5f7Bb9dBAdEb04645a3B71";
    const NFTAddress = "0x5813025fc3c863E8B50c33281d7388DD44bC5aA4";
   // const SwapAddress = 0x4D767662683F4ca754889685b1919784ec16F4bb'
   const SWAP = await hre.ethers.getContractFactory("SWAP");
   const swap = await SWAP.deploy(OwnerAddress, NFTAddress);
   console.log("swap: ", swap);
   await swap.deployed()
   console.log("swap deployed")
  console.log(`export const SwapAddress = ${swap.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });