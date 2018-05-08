import React from "react";
import Web3 from "web3";
import { Card, Elevation, InputGroup, Label, Button, Tag, Intent, Dialog } from "@blueprintjs/core";

import config from "../config";
import AccountManagerABI from "../contracts/AccountManagement.json";
import AccountABI from "../contracts/Account.json";

class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: undefined,
            addProfile: {
                addr: "",
                name: "",
                email: ""
            },
            accountListings: [],
            searchAddr: "",
            searchAccount: undefined,
            editAccount: undefined
        };
    }

    componentDidMount() {
        let web3 = new Web3(config.addr);
        this.setState({ web3 });
        setTimeout(this.fetchAccounts.bind(this), 0);
    }

    handleAddAccount() {
        if (this.state.web3 !== undefined) {
            let AccountManager = new this.state.web3.eth.Contract(AccountManagerABI.abi, config.AccountManagerAddr);

            let addAccount = AccountManager.methods.addAccount(this.state.addProfile.name, this.state.addProfile.email);
            addAccount.estimateGas().then((result) => {
                return addAccount.send({
                    from: this.state.addProfile.addr,
                    gas: (result + 150)
                });
            }).then((result) => {
                if (result !== {}) {
                    // The transaction was successful
                    setTimeout(this.fetchAccounts.bind(this), 0);
                }
            }).catch((error) => {
                console.error(error);
            });
        }
    }

    handleSearchAccount() {
        if (this.state.web3 !== undefined) {
            let AccountManager = new this.state.web3.eth.Contract(AccountManagerABI.abi, config.AccountManagerAddr);

            AccountManager.methods.getAccount(this.state.searchAddr).call().then((result) => {
                let Account = new this.state.web3.eth.Contract(AccountABI.abi, result);

                return Account.methods.getName().call().then((name) => {
                    return Account.methods.getEmail().call().then((email) => {
                        return Account.methods.getOwner().call().then((accountID) => {
                            this.setState({ searchAccount: {
                                id: result,
                                name, email, accountID
                            } });
                        });
                    });
                });
            }).catch((error) => {
                console.error(error);
            });
        }
    }

    handleUpdateAccount() {
        if (this.state.web3 !== undefined) {
            let Account = new this.state.web3.eth.Contract(AccountABI.abi, this.state.editAccount.id);

            let accountID = this.state.editAccount.accountID;
            let name = this.state.editAccount.name;
            let email = this.state.editAccount.email;

            if (name !== this.state.searchAccount.name) {
                let setName = Account.methods.setName(name);
                setName.estimateGas().then((result) => {
                    return setName.send({
                        from: accountID,
                        gas: (result + 150)
                    });
                }).then((result) => {
                    if (result !== {}) {
                        // The transaction was successful
                        setTimeout(this.fetchAccounts.bind(this, this.handleSearchAccount.bind(this)), 0);
                    }
                }).catch((error) => {
                    console.error(error);
                });
            }

            if (email !== this.state.searchAccount.email) {
                let setEmail = Account.methods.setEmail(email);
                setEmail.estimateGas().then((result) => {
                    return setEmail.send({
                        from: accountID,
                        gas: (result + 150)
                    });
                }).then((result) => {
                    if (result !== {}) {
                        // The transaction was successful
                        setTimeout(this.fetchAccounts.bind(this, this.handleSearchAccount.bind(this)), 0);
                    }
                }).catch((error) => {
                    console.error(error);
                });
            }

            this.setState({ editAccount: undefined });
        }
    }

    fetchAccounts(callback) {
        if (this.state.web3 !== undefined) {
            let AccountManager = new this.state.web3.eth.Contract(AccountManagerABI.abi, config.AccountManagerAddr);

            let accountListings = [];

            AccountManager.methods.getAllAccounts().call().then((result) => {
                result.forEach((blockID) => {
                    let account = new this.state.web3.eth.Contract(AccountABI.abi, blockID);
                    let accountList = {
                        id: blockID
                    };
                    account.methods.getName().call().then((name) => {
                        account.methods.getEmail().call().then((email) => {
                            account.methods.getOwner().call().then((accountID) => {
                                accountList.name = name;
                                accountList.email = email;
                                accountList.accountID = accountID;
                                accountListings.push(accountList);
                                this.setState({ accountListings });
                                if (callback) {
                                    callback();
                                }
                            });
                        });
                    });
                });
            });
        }
    }

    render() {

        let listingResult = [];
        if (this.state.accountListings !== undefined) {
            this.state.accountListings.forEach((listing) => {
                listingResult.push((
                    <p key={ listing.id }>
                        { listing.name }:<br />
                        &emsp;Email: { listing.email }<br />
                        &emsp;ID: { listing.accountID }
                    </p>
                ));
            });
        }

        return (
            <div>

            <Dialog
                icon="inbox"
                isOpen={ this.state.editAccount !== undefined }
                onClose={() => {
                    this.setState({ editAccount: undefined });
                }}
                title="Edit Account Information"
            >
                <div className="pt-dialog-body">
                    { this.state.editAccount !== undefined &&
                        <div>
                            <Label text="Account Address">
                                <InputGroup
                                    disabled={ true }
                                    value={ this.state.editAccount.accountID }
                                    intent="primary"/>
                            </Label>
                            <Label text="Account Name">
                                <InputGroup
                                    value={ this.state.editAccount.name }
                                    intent="primary"
                                    onChange={(event) => {
                                        this.setState({ editAccount: {...this.state.editAccount, name: event.target.value} });
                                    }}/>
                            </Label>
                            <Label text="Account Email">
                                <InputGroup
                                    value={ this.state.editAccount.email }
                                    intent="primary"
                                    onChange={(event) => {
                                        this.setState({ editAccount: {...this.state.editAccount, email: event.target.value} });
                                    }}/>
                            </Label>
                        </div>
                    }
                </div>

                <div className="pt-dialog-footer">
                    <div className="pt-dialog-footer-actions">
                        <Button
                            onClick={(event) => {
                                this.setState({ editAccount: undefined });
                            }}>Cancel</Button>
                        <Button
                            onClick={ this.handleUpdateAccount.bind(this) }
                            intent="primary">Save</Button>
                    </div>
                </div>
            </Dialog>

            <div className="row homeRow">
                <div className="col-sm-12 col-md-6">
                    <div className="row">
                        <div className="col-sm-12">
                            <Card elevation={ Elevation.THREE }>
                                <h4>Search Profile</h4>
                                <Label text="Account Address">
                                    <InputGroup
                                        onChange={(event) => {
                                            this.setState({ searchAddr: event.target.value });
                                        }}
                                        intent="primary"/>
                                </Label>
                                <Button
                                    onClick={ this.handleSearchAccount.bind(this) }
                                    intent="primary"
                                >Search</Button>
                            </Card>
                        </div>
                        <div className="col-sm-12">
                            { this.state.searchAccount !== undefined &&
                                <div>
                                    <br />
                                    <Card elevation={ Elevation.THREE }>
                                        <div>
                                            <h4 style={{ float: "left" }}>Search Result:</h4>
                                            <Tag intent={ Intent.PRIMARY } interactive={ true } minimal={ true } style={{ float: "right" }} onClick={(event) => {
                                                this.setState({ editAccount: {...this.state.searchAccount} });
                                            }}>Edit</Tag>
                                        </div>
                                        <br /><br />
                                        <p>Name: { this.state.searchAccount.name }</p>
                                        <p>Email: { this.state.searchAccount.email }</p>
                                    </Card>
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <div className="col-sm-12 col-md-6">
                    <Card elevation={ Elevation.THREE }>
                        <h4>Create Profile</h4>
                        <Label text="Account Address">
                            <InputGroup
                                onChange={(event) => {
                                    this.setState({ addProfile: {...this.state.addProfile, addr: event.target.value} });
                                }}
                                intent="primary"/>
                        </Label>
                        <Label text="Account Name">
                            <InputGroup
                                onChange={(event) => {
                                    this.setState({ addProfile: {...this.state.addProfile, name: event.target.value} });
                                }}
                                intent="primary"/>
                        </Label>
                        <Label text="Account Email">
                            <InputGroup
                                onChange={(event) => {
                                    this.setState({ addProfile: {...this.state.addProfile, email: event.target.value} });
                                }}
                                intent="primary"/>
                        </Label>
                        <Button
                            onClick={ this.handleAddAccount.bind(this) }
                            intent="primary"
                        >Add Account</Button>
                    </Card>
                </div>

                <div className="col-sm-12 col-md-6">
                    <Card elevation={ Elevation.THREE }>
                        <h4>Current Accounts:</h4>
                        { listingResult }
                    </Card>
                </div>

            </div>

            </div>
        );
    }
}

export default Account;