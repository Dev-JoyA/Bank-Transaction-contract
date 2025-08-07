import {buildModule} from "@nomicfoundation/hardhat-ignition/modules";

const BankTranxModule = buildModule("BankTranxModule", (m) => {
    const bankTranx = m.contract("BankTranx");

    return {bankTranx};
})

export default BankTranxModule;