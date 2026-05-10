import { network } from "hardhat";

async function main() {
  const { ethers } = await network.create("localhost");
  const gadgetSales = await ethers.deployContract("GadgetSales");
  await gadgetSales.waitForDeployment();

  const contractAddress = await gadgetSales.getAddress();
  console.log(`GadgetSales deployed to: ${contractAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
