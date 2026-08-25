import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  const [admin] = await ethers.getSigners();

  console.log("Deploying LandRegistry...");
  console.log("Admin address:", admin.address);

  const LandRegistry =
    await ethers.getContractFactory("LandRegistry");

  const landRegistry =
    await LandRegistry.deploy();

  await landRegistry.waitForDeployment();

  console.log(
    "LandRegistry deployed to:",
    await landRegistry.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});