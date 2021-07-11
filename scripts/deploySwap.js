const hre = require("hardhat");
const { Contract, utils, providers, constants, BigNumber } = require("ethers")

const LootAddress = "0x49a2264eB146f0160a1F4CA0acCeC9a66784DC27";
const LootLPAddress = "0xa6d044677360bdc9b688d64cf3b07aaca252e4fb";
const OwnerAddress = '0x4E4aeed836e77ae7591776cAE750A720a38ca892'

async function main(){
    await hre.run("compile");

    
    const NFTAddress = "0x56e6f9b71B919A9b19094Da2fD1d8A3A8aa69F0D";

    
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