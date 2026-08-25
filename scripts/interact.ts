import { network } from "hardhat";

async function main() {

    const { ethers } = await network.create();

    const [admin, owner, buyer] =
        await ethers.getSigners();

    // Replace this with YOUR deployed contract address
    const contractAddress =
        "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const landRegistry =
        await ethers.getContractAt(
            "LandRegistry",
            contractAddress
        );
    console.log(
        "Contract code:",
        await ethers.provider.getCode(contractAddress)
    );

    console.log("Admin:", admin.address);
    console.log("Owner:", owner.address);
    console.log("Buyer:", buyer.address);

    // Register property
    console.log("\nRegistering property...");

    const registerTx =
        await landRegistry.registerProperty(
            1,
            "P001",
            "Bangalore",
            1200,
            "Residential",
            owner.address,
            "QmDummyPropertyDocument001"
        );

    await registerTx.wait();

    console.log("Property registered successfully.");

    // Verify property
    console.log("\nVerifying property...");

    const verifyTx =
        await landRegistry.verifyProperty(1);

    await verifyTx.wait();

    console.log("Property verified successfully.");

    // Transfer ownership
    console.log("\nTransferring ownership...");

    const transferTx =
        await landRegistry
            .connect(owner)
            .transferOwnership(
                1,
                buyer.address
            );

    await transferTx.wait();

    console.log("Ownership transferred successfully.");

    // Read final property
    const property =
        await landRegistry.getProperty(1);

    console.log("\nFinal Property Details:");
    console.log("Property ID:", property.propertyId);
    console.log("Property Number:", property.propertyNumber);
    console.log("Location:", property.location);
    console.log("Current Owner:", property.currentOwner);
    console.log("Previous Owner:", property.previousOwner);
    console.log("Verified:", property.verified);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});