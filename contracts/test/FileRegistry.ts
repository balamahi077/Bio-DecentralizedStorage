import { expect } from "chai";
import { ethers } from "hardhat";

describe("FileRegistry", function () {
	it("adds and lists files for caller", async function () {
		const [user] = await ethers.getSigners();
		const factory = await ethers.getContractFactory("FileRegistry");
		const contract = await factory.deploy();
		await contract.waitForDeployment();

		await (await contract.connect(user).addFile("bafyCID", "hello.txt")).wait();
		const files = await contract.connect(user).getMyFiles();

		expect(files.length).to.equal(1);
		expect(files[0].cid).to.equal("bafyCID");
		expect(files[0].name).to.equal("hello.txt");
	});
});
