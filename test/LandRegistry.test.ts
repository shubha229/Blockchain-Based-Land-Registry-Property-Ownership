import { expect } from "chai";
import { network } from "hardhat";

describe("LandRegistry", function () {

    async function deployContract() {
        const { ethers } = await network.create();

        const [admin, owner, buyer, unauthorized] =
            await ethers.getSigners();

        const LandRegistry =
            await ethers.getContractFactory("LandRegistry");

        const landRegistry =
            await LandRegistry.deploy();

        await landRegistry.waitForDeployment();

        return {
            ethers,
            landRegistry,
            admin,
            owner,
            buyer,
            unauthorized
        };
    }

    it("should set deployer as admin", async function () {

        const {
            landRegistry,
            admin
        } = await deployContract();

        expect(
            await landRegistry.admin()
        ).to.equal(admin.address);
    });

    it("should register a property", async function () {

        const {
            landRegistry,
            owner
        } = await deployContract();

        await landRegistry.registerProperty(
            1,
            "P001",
            "Bangalore",
            1200,
            "Residential",
            owner.address,
            "QmDummyPropertyDocument001"
        );

        const property =
            await landRegistry.getProperty(1);

        expect(property.propertyId)
            .to.equal(1n);

        expect(property.propertyNumber)
            .to.equal("P001");

        expect(property.currentOwner)
            .to.equal(owner.address);

        expect(property.verified)
            .to.equal(false);
    });

    it("should reject duplicate property", async function () {

        const {
            landRegistry,
            owner
        } = await deployContract();

        await landRegistry.registerProperty(
            1,
            "P001",
            "Bangalore",
            1200,
            "Residential",
            owner.address,
            "QmDummyPropertyDocument001"
        );

        await expect(
            landRegistry.registerProperty(
                1,
                "P001",
                "Bangalore",
                1200,
                "Residential",
                owner.address,
                "QmDummyPropertyDocument001"
            )
        ).to.be.revertedWith(
            "Property already exists"
        );
    });

    it("should verify property", async function () {

        const {
            landRegistry
        } = await deployContract();

        await landRegistry.registerProperty(
            1,
            "P001",
            "Bangalore",
            1200,
            "Residential",
            (await landRegistry.admin()),
            "QmDummyPropertyDocument001"
        );

        await landRegistry.verifyProperty(1);

        const property =
            await landRegistry.getProperty(1);

        expect(property.verified)
            .to.equal(true);

        expect(property.status)
            .to.equal(1n);
    });

    it("should reject unauthorized verification", async function () {

        const {
            landRegistry,
            owner,
            unauthorized
        } = await deployContract();

        await landRegistry.registerProperty(
            1,
            "P001",
            "Bangalore",
            1200,
            "Residential",
            owner.address,
            "QmDummyPropertyDocument001"
        );

        await expect(
            landRegistry
                .connect(unauthorized)
                .verifyProperty(1)
        ).to.be.revertedWith(
            "Only admin allowed"
        );
    });

    it("should transfer ownership", async function () {

        const {
            landRegistry,
            owner,
            buyer
        } = await deployContract();

        await landRegistry.registerProperty(
            1,
            "P001",
            "Bangalore",
            1200,
            "Residential",
            owner.address,
            "QmDummyPropertyDocument001"
        );

        await landRegistry.verifyProperty(1);

        await landRegistry
            .connect(owner)
            .transferOwnership(
                1,
                buyer.address
            );

        const property =
            await landRegistry.getProperty(1);

        expect(property.currentOwner)
            .to.equal(buyer.address);

        expect(property.previousOwner)
            .to.equal(owner.address);

        expect(property.status)
            .to.equal(2n);
    });

    it("should reject old owner after transfer", async function () {

        const {
            landRegistry,
            owner,
            buyer,
            unauthorized
        } = await deployContract();

        await landRegistry.registerProperty(
            1,
            "P001",
            "Bangalore",
            1200,
            "Residential",
            owner.address,
            "QmDummyPropertyDocument001"
        );

        await landRegistry.verifyProperty(1);

        await landRegistry
            .connect(owner)
            .transferOwnership(
                1,
                buyer.address
            );

        await expect(
            landRegistry
                .connect(owner)
                .transferOwnership(
                    1,
                    unauthorized.address
                )
        ).to.be.revertedWith(
            "Only property owner allowed"
        );
    });
});