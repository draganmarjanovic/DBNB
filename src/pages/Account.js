import React from "react";
import Web3 from "web3";
import { Card, Elevation, InputGroup, Label, Button } from "@blueprintjs/core";

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
            accountListings: []
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

    fetchAccounts() {
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
                            })
                        })
                    })
                })
            })
        }
    }

    render() {

        let listingResult = [];
        if (this.state.accountListings !== undefined) {
            this.state.accountListings.forEach((listing) => {
                listingResult.push((
                    <div className="col-md-6 col-sm-12" key={ listing.id }>
                        <Card elevation={ Elevation.THREE }>
                            <h4>{ listing.name }</h4>
                            <p>Email: { listing.email }</p>
                            <p>ID: { listing.accountID }</p>
                        </Card>
                    </div>
                ));
            });
        }

        return (
            <div className="row homeRow">
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

                { listingResult }

            </div>
        )
    }
}

export default Account;