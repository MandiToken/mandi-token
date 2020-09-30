import { run, ethers } from "@nomiclabs/buidler";
import { utils } from "ethers";
import { TOTAL_SUPPLY, holders, balances } from "../scripts/prodConfig";
import MandiToken from "../artifacts/MandiToken.json";
import { deployContract } from "ethereum-waffle";

async function main() {
  const jsonRpcProvider = ethers.provider;

  const [deployer] = await ethers.getSigners();
  console.log(`Node URL: ${jsonRpcProvider.connection.url}`);
  console.log(`Deployer: ${await deployer.getAddress()}`);

  const mandi = await deployContract(deployer, MandiToken, [holders, balances], {gasPrice: utils.parseUnits("66", "gwei")});

  console.log(`Mandi token deployed: 
    address: ${mandi.address}
    name: ${await mandi.name()}
    symbol: ${await mandi.symbol()}
    decimals: ${await mandi.decimals()}
    totalSupply: ${utils.formatEther(await mandi.totalSupply())}
  `);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
