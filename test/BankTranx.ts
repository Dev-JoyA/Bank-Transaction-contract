import hre from "hardhat";
import { expect } from "chai";
import { BankTranx } from "../typechain-types";
const { ethers } = hre;
describe("BankTranx", function () {
  let bankTranx: BankTranx;
  let owner: any;
  let user: any;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    const BankTranxFactory = await ethers.getContractFactory("BankTranx");
    bankTranx = (await BankTranxFactory.deploy()) as BankTranx;
    await bankTranx.waitForDeployment();
  });

  describe("Constructor", function () {
    it("should set the customer to the deployer", async function () {
      expect(await bankTranx.customer()).to.equal(owner.address);
    });

    it("should initialize account to 0", async function () {
      expect(await bankTranx.account()).to.equal(0);
    });
  });

  describe("createAccount", function () {
    it("should create a new account successfully", async function () {
      const accountNumber = 123456;
      const accountName = "John Doe";
      const bankName = "Test Bank";

      await expect(bankTranx.createAccount(accountNumber, accountName, bankName))
        .to.emit(bankTranx, "AccountCreated") // Note: Event not defined in contract; add if needed
        .withArgs(1, accountNumber, accountName, bankName, 0, owner.address);

      const accountDetails = await bankTranx.customerAccount(1);
      expect(accountDetails.id).to.equal(1);
      expect(accountDetails.number).to.equal(accountNumber);
      expect(accountDetails.name).to.equal(accountName);
      expect(accountDetails.bankName).to.equal(bankName);
      expect(accountDetails.balance).to.equal(0);
      expect(accountDetails.walletAddress).to.equal(owner.address);
    });

    it("should revert if account already exists", async function () {
      const accountNumber = 123456;
      const accountName = "John Doe";
      const bankName = "Test Bank";

      await bankTranx.createAccount(accountNumber, accountName, bankName);
      await expect(
        bankTranx.createAccount(accountNumber, accountName, bankName)
      ).to.be.revertedWith("Account Already exist");
    });

    it("should increment account counter", async function () {
      await bankTranx.createAccount(123456, "John Doe", "Test Bank");
      expect(await bankTranx.account()).to.equal(1);

      await bankTranx.createAccount(789012, "Jane Doe", "Another Bank");
      expect(await bankTranx.account()).to.equal(2);
    });
  });

  describe("deposit", function () {
    it("should deposit funds successfully", async function () {
      const accountNumber = 123456;
      const accountName = "John Doe";
      const bankName = "Test Bank";
      const depositAmount = ethers.parseEther("1");

      await bankTranx.createAccount(accountNumber, accountName, bankName);
      await expect(bankTranx.deposit(1, { value: depositAmount }))
        .to.emit(bankTranx, "Deposit") // Note: Event not defined in contract; add if needed
        .withArgs(1, depositAmount);

      const accountDetails = await bankTranx.customerAccount(1);
      expect(accountDetails.balance).to.equal(depositAmount);
    });

    it("should revert if deposit amount is zero", async function () {
      await bankTranx.createAccount(123456, "John Doe", "Test Bank");
      await expect(bankTranx.deposit(1, { value: 0 })).to.be.revertedWith(
        "Deposit amount must be greater than zero"
      );
    });

    it("should revert if account does not exist", async function () {
      await expect(
        bankTranx.deposit(999, { value: ethers.parseEther("1") })
      ).to.be.revertedWith("Account does not exist");
    });
  });

  describe("withdraw", function () {
    it("should withdraw funds successfully", async function () {
      const accountNumber = 123456;
      const accountName = "John Doe";
      const bankName = "Test Bank";
      const depositAmount = ethers.parseEther("1");
      const withdrawAmount = ethers.parseEther("0.5");

      await bankTranx.createAccount(accountNumber, accountName, bankName);
      await bankTranx.deposit(1, { value: depositAmount });

      const initialBalance = await ethers.provider.getBalance(owner.address);
      await expect(bankTranx.withdraw(withdrawAmount, 1))// Note: Event not defined in contract; add if needed
        .withArgs(withdrawAmount, 1);

      const accountDetails = await bankTranx.customerAccount(1);
      expect(accountDetails.balance).to.equal(depositAmount - withdrawAmount);

      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("should revert if withdrawal amount is zero", async function () {
      await bankTranx.createAccount(123456, "John Doe", "Test Bank");
      await expect(bankTranx.withdraw(0, 1)).to.be.revertedWith(
        "Withdrawal amount must be greater than zero"
      );
    });

    it("should revert if account does not exist", async function () {
      await expect(bankTranx.withdraw(ethers.parseEther("0.5"), 999)).to.be
        .revertedWith("Account does not exist");
    });

    it("should revert if caller is not the account owner", async function () {
      await bankTranx.createAccount(123456, "John Doe", "Test Bank");
      await bankTranx.deposit(1, { value: ethers.parseEther("1") });

      await expect(
        bankTranx.connect(user).withdraw(ethers.parseEther("0.5"), 1)
      ).to.be.revertedWithCustomError(bankTranx, "NotAllowed");
    });
  });
});