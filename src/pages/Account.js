import React from "react";
import { Card, Elevation, InputGroup, Label, Button, Tag, Intent, Dialog, FileInput } from "@blueprintjs/core";

import AccountManager from "../lib/AccountManagement";
import IpfsUtils from "../lib/IpfsUtils";

import { successToast, errorToast } from "../lib/Toaster";

import ProfilePicture from "../components/ProfilePicture";


class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accountListings: [],
            searchAddr: "",
            searchAccount: this.props.account,
            editAccount: undefined
        };
    }

    componentDidMount() {
        this.fetchAccounts();
    }

    handleSearchAccount() {
        AccountManager.getAccount(this.state.searchAddr).then((account) => {
            this.setState({ searchAccount: account });
        }).catch((error) => {
            console.error(error);
        });
    }

    updateImage(file) {
        let reader = new window.FileReader();
        console.log(file);
        reader.onloadend = (event) => {
            console.log("HEre");
            // let imgLocation = IpfsUtils.publish(reader.result);
            // console.log("updateImageLoc: " + imgLocation);
            // this.state.searchAccount.setImageLocation(imgLocation);
        }
    }

    uploadImage(event) {
        console.log("Hi");
        let reader = new FileReader();
        reader.onerror = (error) => {
            console.error(error);
        }
        reader.onprogress = (progress) => {
            console.log("Progress: ", progress);
        }
        reader.onload = () => {
            IpfsUtils.publish(reader.result).then((imgLocation) => {
                console.log("Image loc: ", imgLocation);
                return this.props.account.setImageLocation(imgLocation)
            }).then((result) => {
                console.log("Success");
            }).catch((error) => {
                console.error(error);
            });
        }
        reader.readAsDataURL(event.target.files[0]);
        console.log(reader);
    }

    handleUpdateAccount() {

        // Upload the file to IPFS
        this.updateImage(this.state.editAccount.imageFile);

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

        let bookingsList = [];
        if (this.state.searchAccount !== undefined) {
            this.state.searchAccount.getBookings().forEach((booking) => {
                bookingsList.push((
                    <div key={ booking.contractAddr }>
                        <div>House: { booking.house }</div>
                        <div>Start: { booking.start }</div>
                        <div>Duration: { booking.duration }</div>
                        <br />
                    </div>
                ))
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
                            <Label text="Profile Picture">
                                <FileInput text="Choose file..." 
                                        onChange={(event) => {
                                            this.setState({editAccount: {...this.state.editAccount, imageFile: event.target.files}});
                                        }}/>
                                <input type="file" accept="image/*" onChange={ this.uploadImage.bind(this) }/>
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
                                        <ProfilePicture source={ "http://localhost:8080/ipfs/" +  this.state.searchAccount.getImageLocation() }/>
                                        <p> Hash: { this.state.searchAccount.getImageLocation() } </p>
                                        <p>Name: { this.state.searchAccount.getName() }</p>
                                        <p>Email: { this.state.searchAccount.getEmail() }</p>
                                        <h6>Bookings</h6>
                                        { bookingsList }
                                    </Card>
                                </div>
                            }
                        </div>
                    </div>
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