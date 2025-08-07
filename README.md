# 🏦 BankTranx Smart Contract

A simple Ethereum smart contract for managing basic bank account operations such as creating accounts, depositing, and withdrawing funds. Each account is linked to a wallet address, and only the owner can perform withdrawals.

---

## 📜 Contract Summary

The **BankTranx** smart contract enables a single customer to:
- Create multiple unique bank accounts.
- Deposit Ether into their accounts.
- Withdraw Ether from their accounts.

All actions are protected by access control to ensure only the account owner can manage their funds.

---

## 🔧 Key Features

- **Account Creation**
  - Call `createAccount(number, name, bankName)` to create a new account.
  - Each account is uniquely identified by an internal `id` and stores:
    - Account number
    - Holder’s name
    - Bank name
    - Balance (in wei)
    - Wallet address (automatically set to the contract deployer)

- **Deposit Funds**
  - Call `deposit(id)` and send ETH to increase the account balance.
  - Deposits are only allowed for existing accounts.
  - Zero-value deposits are rejected.

- **Withdraw Funds**
  - Call `withdraw(amount, id)` to withdraw ETH from the specified account.
  - Only the owner of the account can initiate withdrawals.
  - Withdrawals are denied if:
    - The caller is not the account owner.
    - The account does not exist.
    - The withdrawal amount is zero.

---

## ✅ Validations & Access Control

- ❌ Only the account creator (`customer`) can withdraw from their own accounts.
- ❌ Cannot create an account with a number that already exists.
- ❌ Cannot deposit to non-existent accounts.
- ❌ Cannot withdraw if the caller is not the account owner.
- ❌ Ensures all amounts involved are greater than zero.

---

## 🧾 Structs

```solidity
struct AccountDetails {
    uint256 id;
    uint256 number;
    string name;
    string bankName;
    uint256 balance;
    address walletAddress;
}
```
## Deployed txn hash
```shell
0xC3477Ff846b4Dc2d852405b7309307f3D14c9dC1
```

## Verified Address
```shell
https://sepolia-blockscout.lisk.com/address/0xC3477Ff846b4Dc2d852405b7309307f3D14c9dC1#code
```


