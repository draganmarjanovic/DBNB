import Web3 from "web3";

import config from "../config";
import AccountManagerABI from "../contracts/AccountManagement.json";
import AccountABI from "../contracts/Account.json";

const web3 = new Web3(config.addr);

class AccountManager {
    constructor() {
        this.AccountManagerContract = new web3.eth.Contract(AccountManagerABI.abi, config.AccountManagerAddr);
    }

    addAccount(name, email, accountAddr) {
        let addAccountFunc = this.AccountManagerContract.methods.addAccount(name, email);
        return addAccountFunc.estimateGas().then((result) => {
            return addAccountFunc.send({
                from: accountAddr,
                gas: (result + 150)
            });
        }).then((result) => {
            if (result !== {}) {
                return true;
            }
            return false;
        });
    }

    getAccount(accountAddr) {
        return this.AccountManagerContract.methods.getAccount(accountAddr).call().then((result) => {
            let account = new Account(result);
            return account.load();
        });
    }

    getAllAccounts() {
        return this.AccountManagerContract.methods.getAllAccounts().call().then((result) => {
            let accountList = [];
            result.forEach((blockID) => {
                let account = new Account(blockID);
                accountList.push(account.load());
            });
            return Promise.all(accountList);
        });
    }
}

class Account {
    constructor(contractAddr) {
        this.contractAddr = contractAddr;

        this.AccountContract = new web3.eth.Contract(AccountABI.abi, contractAddr);
    }

    load() {
        return this.AccountContract.methods.getName().call().then((name) => {
            this.name = name;
            return this.AccountContract.methods.getEmail().call();
        }).then((email) => {
            this.email = email;
            return this.AccountContract.methods.getOwner().call();
        }).then((accountID) => {
            this.accountID = accountID;
            return this;
        });
    }

    getName() {
        if (this.name === undefined) {
            this.load();
        }
        return this.name;
    }

    getEmail() {
        if (this.email === undefined) {
            this.load();
        }
        return this.email;
    }

    getID() {
        return this.contractAddr;
    }

    getAccountID() {
        if (this.accountID === undefined) {
            this.load();
        }
        return this.accountID;
    }

    async setName(name) {
        if (this.name !== name) {
            let setName = this.AccountContract.methods.setName(name);
            return setName.estimateGas().then((result) => {
                return setName.send({
                    from: this.getAccountID(),
                    gas: (result + 150)
                });
            }).then((result) => {
                if (result !== {}) {
                    return true;
                }
                return false;
            });
        }
        return false;
    }

    async setEmail(email) {
        if (this.email !== email) {
            let setEmail = this.AccountContract.methods.setEmail(email);
            return setEmail.estimateGas().then((result) => {
                return setEmail.send({
                    from: this.getAccountID(),
                    gas: (result + 150)
                });
            }).then((result) => {
                if (result !== {}) {
                    return true;
                }
                return false;
            });
        }
        return false;
    }
}

export default new AccountManager();