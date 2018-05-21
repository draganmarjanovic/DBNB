import React from "react";
import { Link } from "react-router-dom";
import { Tabs, Tab, Card, Elevation, Label, InputGroup, Button } from "@blueprintjs/core";
import { successToast, errorToast, warningToast } from "../lib/Toaster";
import Web3 from "web3";
import config from "../config";

import AccountManager from "../lib/AccountManagement";

import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Deploy from "../pages/Deploy";
import Account from "../pages/Account";
import Escrow from "../pages/Escrow";

import "../styles/grid.scss";
import "../styles/components/layout.scss";
import ProfilePicture from "./ProfilePicture";
import IpfsUtils from "../lib/IpfsUtils";

export class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accountAddr: undefined,
            account: undefined,
            customAddr: false,
            loading: false
        }
    }

    componentDidMount() {
        let web3 = new Web3(config.addr);
        let accountAddr = undefined;
        web3.eth.getAccounts().then((accounts) => {
            if (accounts.length < 1) {
                this.setState({ customAddr: true });
                return -1;
            }
            accountAddr = accounts[0];
            return AccountManager.getAccount(accounts[0]);
        }).then((account) => {
            this.setState({ account, accountAddr });
        }).catch((error) => {
            errorToast("Error fetching user information");
            console.error(error);
        });
        if (!config.metaMask) {
            warningToast("Please install metamask");
        }
    }

    checkAccount() {
        console.log("Not Implemented");
    }

    handleAddAccount() {
        this.setState({ loading: true });
        AccountManager.addAccountWithImage(this.state.accountAddr, this.state.accountName, this.state.accountEmail, this.state.imgLocation).then((result) => {
            this.setState({ loading: false });
            if (!result) {
                errorToast("Error creating account");
            }
            console.log(result);
            setTimeout(() => {
                AccountManager.getAccount(this.state.accountAddr).then((account) => {
                    successToast("Account Created");
                    this.setState({ account });
                }).catch((error) => {
                    errorToast("Error loading account");
                    console.error(error);
                });
            }, 1000);
        }).catch((error) => {
            errorToast("Error while adding account");
            console.error(error);
        });
    }

    uploadImage(event) {
        let reader = new FileReader();
        reader.onload = () => {
            IpfsUtils.publish(reader.result).then((imgLocation) => {
                successToast("Image Uploaded successfully");
                this.setState({ imgLocation });
            }).catch((error) => {
                errorToast("Error uploading photo");
                console.error(error);
            });
        }
        reader.readAsDataURL(event.target.files[0]);
    }

    render() {
        return (
            <div className="home-root">
                <div className="home-content">
                    { this.state.account !== undefined &&
                        <div>
                            <Tabs id="navbar" large={ true } renderActiveTabPanelOnly={ true }>
                                <ProfilePicture account={ this.state.account } matchHeight={ true } style={{ height: "3rem" }}/>
                                <h3>DBNB</h3>
                                <Tabs.Expander />
                                <Tab id="home" title="Home" panel={<Home account={ this.state.account }/>} />
                                <Tab id="profile" title="Listing" panel={<Profile account={ this.state.account } />} />
                                <Tab id="escrow" title="Escrow" panel={<Escrow account={ this.state.account } />} />
                                <Tab id="account" title="Account" panel={<Account account={ this.state.account }/>} />
                                <Tab id="deploy" title="Deploy" panel={<Deploy account={ this.state.account } />} />
                            </Tabs>
                        </div>
                    }

                    { this.state.account === undefined &&
                        <div>
                            <Card elevation={ Elevation.THREE }>
                                <h4>Create Profile</h4>
                                { this.state.customAddr === true &&
                                    <Label text="Account Address">
                                        <InputGroup
                                            onChange={(event) => {
                                                this.setState({ accountAddr: event.target.value });
                                            }}
                                            intent="primary"
                                            rightElement={<Button intent="primary" onClick={ this.checkAccount.bind(this) }>Check Account</Button>}
                                        />
                                    </Label>
                                }
                                <Label text="Account Name">
                                    <InputGroup
                                        onChange={(event) => {
                                            this.setState({ accountName: event.target.value });
                                        }}
                                        intent="primary"
                                    />
                                </Label>
                                <Label text="Account Email">
                                    <InputGroup
                                        onChange={(event) => {
                                            this.setState({ accountEmail: event.target.value });
                                        }}
                                        intent="primary"
                                    />
                                </Label>
                                <input type="file" accept="image/*" onChange={ this.uploadImage.bind(this) }/>
                                <Button
                                    onClick={ this.handleAddAccount.bind(this) }
                                    intent="primary"
                                    loading={ this.state.loading }
                                >Register Account</Button>
                            </Card>
                            <br /><br />
                            <Deploy />
                        </div>
                    }
                </div>
                <div className="home-footer">
                    <Footer />
                </div>
            </div>
        )
    }
}

export function Header (props) {
    return (
        <div className="header-outer">
            <div>
                <div className="header-left">
                    <Link to="/DBNB">DBNB</Link>
                </div>
                <div className="header-right">{ props.children }</div>
            </div>
        </div>
    );
}

export function NavBar (props) {
    return (
        <div className="navbar-row">
            <div>
                <Link to="/DBNB/Profile">Profile</Link>
                <Link to="/DBNB/Link2">Link2</Link>
                <Link to="/DBNB/Link3">Link3</Link>
                <Link to="/DBNB/Link4">Link4</Link>
            </div>
        </div>
    );
}

export function Footer (props) {
    return (
        <div className="footer-outer">
            <div className="footer-upper">
                <div>
                    Some upper content
                </div>
            </div>
            <div className="footer-lower">
                <div>
                    <div>Left</div>
                    <div>Right</div>
                </div>
            </div>
        </div>
    );
}

export function Panel (props) {
    return (
        <div className="panel-outer">
            <div className="panel">
                <div className="panel-title">
                    { props.title }
                </div>
                <div className="panel-content">
                    { props.children }
                </div>
            </div>
        </div>
    );
}