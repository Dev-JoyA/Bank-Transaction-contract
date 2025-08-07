import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import "@nomicfoundation/hardhat-ethers";
import hre from "hardhat";
const { ethers } = hre;
import { parseEther } from "ethers";

import { expect } from "chai";

describe("BankTranx", function () {
  async function deployBankTranxFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const BankTranx = await ethers.getContractFactory("BankTranx");
    const bankTranx = await BankTranx.deploy();

    return { bankTranx, owner, otherAccount };
  }

  describe("createAccount", function () {
    it("should create a new account", async function () {
      const { bankTranx } = await loadFixture(deployBankTranxFixture);

      const accountNumber = 12345;
      const name = "Joy";
      const bankName = "Bank of Joy";

      // Call the function
      await bankTranx.createAccount(accountNumber, name, bankName);

    // Fetch the account by ID (ID should be 1 since it's the first)
    
    });
  });

  describe("deposit", function () {
    it("should deposit funds into an account", async function () {
      const { bankTranx } = await loadFixture(deployBankTranxFixture);

      const depositAmount = parseEther("1.0");

      const accountNumber = 12345;
      await bankTranx.createAccount(accountNumber, "Joy", "Bank of Joy");
      await bankTranx.deposit(1, { value: depositAmount });

      const result = await bankTranx.account;
      expect(bankTranx.account).to.equal(1);
    });
  });

  describe("withdraw", function () {
    it("should withdraw funds from an account", async function () {
      const { bankTranx, owner } = await loadFixture(deployBankTranxFixture);

      const depositAmount = parseEther("1.0");
      const withdrawAmount = parseEther("0.1");
      const accountNumber = 12345;
      await bankTranx.createAccount(accountNumber, "Joy", "Bank of Joy");
      await bankTranx.deposit(1, { value: depositAmount });

      const initialBalance = await ethers.provider.getBalance(owner.address);

      const tx = await bankTranx.withdraw(withdrawAmount, 1);
      const receipt = await tx.wait();

      const finalBalance = await ethers.provider.getBalance(owner.address);
       expect(finalBalance).to.equal(10);
    
    });
  });
});
