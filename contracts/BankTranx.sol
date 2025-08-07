//SPDX-License-Identifier: MIT
pragma solidity ^ 0.8.28;

contract BankTranx{
    address public customer;
    uint256 public amount;
    uint256 public account;

    
    constructor(){
        customer = msg.sender;
        account = 0;
    }

    struct AccountDetails {
        uint256 id;
        uint256 number;
        string name;
        string bankName;
        uint256 balance;
        address walletAddress;
    }

    error NotAllowed();

    mapping (uint256 => AccountDetails) customerAccount;

    function createAccount(uint256 _number,
     string memory _name,
     string memory _bankName) public {
        require(bytes(customerAccount[_number].name).length == 0, "Account Already exist");
        account++;
        customerAccount[account] = AccountDetails({
            id : account,
            number : _number,
            name: _name,
            bankName: _bankName,
            balance : 0,
            walletAddress : customer
        });
    }

    function deposit(uint256 _id) public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        require(customerAccount[_id].id != 0, "Account does not exist");

        customerAccount[_id].balance += msg.value;    
    }

    function withdraw(uint256 _amount, uint256 _id) public {
        require(_amount > 0, "Withdrawal amount must be greater than zero");
        require(customerAccount[_id].id == _id, "Account does not exist");
        if(msg.sender != customerAccount[_id].walletAddress){
            revert NotAllowed();
        }

        customerAccount[_id].balance -= _amount;
        payable(customerAccount[_id].walletAddress).transfer(_amount);
    }
}