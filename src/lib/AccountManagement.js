import Web3 from "web3";

import config from "../config";
import AccountManagerABI from "../contracts/AccountManagement.json";
import AccountABI from "../contracts/Account.json";

const web3 = new Web3(config.addr);

/**
 * Class for handling management of accounts, this is direct communication connection the instance running on the blockchain
 */
class AccountManager {
    constructor() {
        this.AccountManagerContract = new web3.eth.Contract(AccountManagerABI.abi, config.AccountManagerAddr);
    }

    /**
     * Adds an account to the blockchain
     * @param {string} name Name of the account to be added
     * @param {string} email Email contact of the account
     * @param {string} accountAddr Account Address that will be processing the request and ultimately paying for the adding of the account
     */
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

    /**
     * Finds and returns an Account object at the requested location. Throws an error if no account is found
     * @param {string} accountAddr Address of the account that is to be found
     * @returns Promise with the account and all of its loaded information
     */
    getAccount(accountAddr) {
        return this.AccountManagerContract.methods.getAccount(accountAddr).call().then((result) => {
            let account = new Account(result);
            return account.load();
        });
    }

    /**
     * Gets all the accounts and returns them as a promise. The promise will be resolved to an array
     * @returns Promise with a resolution of an array of accounts
     */
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

/**
 * Class to help manage and control Accounts on the blockchain
 */
class Account {
    constructor(contractAddr) {
        this.contractAddr = contractAddr;

        this.AccountContract = new web3.eth.Contract(AccountABI.abi, contractAddr);
    }

    /**
     * Loads all the data of the account from the blockchain
     * @returns Promise which will resolve to this object
     */
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

    /**
     * Gets the name of the Account object
     * @returns {string} Name associated with the Account
     */
    getName() {
        if (this.name === undefined) {
            this.load();
        }
        return this.name;
    }

    /**
     * Gets the email of the Account object
     * @returns {string} Email associated with the Account
     */
    getEmail() {
        if (this.email === undefined) {
            this.load();
        }
        return this.email;
    }

    /**
     * Gets the id of the Account object
     * @returns {string} ID of the contract on the blockchain
     */
    getID() {
        return this.contractAddr;
    }

    /**
     * Gets the Account ID associated with the account
     * @returns {string} Account Address that is connected to the object
     */
    getAccountID() {
        if (this.accountID === undefined) {
            this.load();
        }
        return this.accountID;
    }

    /**
     * Sets the name of the Account on the blockchain
     * @param {string} name New name to assign
     */
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

    /**
     * Sets the email of the Account on the blockchain
     * @param {string} email New email to assign
     */
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