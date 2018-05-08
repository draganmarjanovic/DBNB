import React from "react";
import { Card, Elevation, InputGroup, Label, Button, Tag, Intent, Dialog } from "@blueprintjs/core";

import AccountManager from "../lib/AccountManagement";

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
        this.fetchAccounts();
    }

    handleAddAccount() {
        AccountManager.addAccount(this.state.addProfile.name, this.state.addProfile.email, this.state.addProfile.addr).then((result) => {
            if (result) {
                setTimeout(this.fetchAccounts.bind(this), 0);
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    handleSearchAccount() {
        AccountManager.getAccount(this.state.searchAddr).then((account) => {
            this.setState({ searchAccount: account });
        }).catch((error) => {
            console.error(error);
        });
    }

    handleUpdateAccount() {
        this.state.searchAccount.setName(this.state.editAccount.name).then((result) => {
            return this.state.searchAccount.setEmail(this.state.editAccount.email);
        }).then((result) => {
            this.setState({ editAccount: undefined });
            this.fetchAccounts();
            this.handleSearchAccount();
        }).catch((error) => {
            console.error(error);
        });
    }

    fetchAccounts(callback) {
        AccountManager.getAllAccounts().then((results) => {
            this.setState({ accountListings: results });
        }).catch(console.error);
    }

    render() {

        let listingResult = [];
        if (this.state.accountListings !== undefined) {
            this.state.accountListings.forEach((listing) => {
                listingResult.push((
                    <p key={ listing.getID() }>
                        { listing.getName() }:<br />
                        &emsp;Email: { listing.getEmail() }<br />
                        &emsp;ID: { listing.getAccountID() }
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
                                                this.setState({ editAccount: {
                                                    name: this.state.searchAccount.getName(),
                                                    email: this.state.searchAccount.getEmail(),
                                                    accountID: this.state.searchAccount.getAccountID()
                                                } });
                                            }}>Edit</Tag>
                                        </div>
                                        <br /><br />
                                        <p>Name: { this.state.searchAccount.getName() }</p>
                                        <p>Email: { this.state.searchAccount.getEmail() }</p>
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