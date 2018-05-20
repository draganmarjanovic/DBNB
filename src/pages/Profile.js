import React from "react";
import Web3 from "web3";
import { Button, InputGroup, Label, Card, Elevation, TextArea } from "@blueprintjs/core";

import "../styles/grid.scss";

import HouseManager from "../lib/HouseManagement";
import { successToast, errorToast } from "../lib/Toaster"

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: undefined,
            listings: undefined,
            listingButton: {
                loading: false,
            },
            addListing: {
                title: "",
                desc: "",
                cost: ""
            }
        };
    }

    handleAddListing() {
        this.setState ( {
            listingButton: {
                loading: true
            }
        });

        HouseManager.addHouse(this.props.account, this.state.addListing.title, this.state.addListing.desc, this.state.addListing.cost).then((result) => {
            successToast( this.state.addListing.title + " was listed successfully!");
            this.setState({
                addListing: {
                    title: "",
                    desc: "",
                    cost: ""
                },
                listingButton: { loading: false }
            });
        }).catch((error) => {
            errorToast(this.state.addListing.title + " Was not listed successfully.");
            this.setState({
                listingButton: { loading: false }
            });
            console.error(error);
        });
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-12 col-md-6">
                    <Card elevation={ Elevation.THREE }>
                        <h4>Add Listing</h4>
                        <Label text="Listing Title">
                            <InputGroup
                                onChange={(event) => {
                                    this.setState({ addListing: {...this.state.addListing, title: event.target.value} });
                                }}
                                value={ this.state.addListing.title }
                                intent="primary"/>
                        </Label>
                        <Label text="Cost per night">
                            <InputGroup
                                onChange={(event) => {
                                    this.setState({ addListing: {...this.state.addListing, cost: event.target.value} });
                                }}
                                value={ this.state.addListing.cost }
                                intent="primary"/>
                        </Label>
                        <Label text="Description">
                            <TextArea
                                large={ false }
                                onChange={(event) => {
                                    this.setState({ addListing: {...this.state.addListing, desc: event.target.value} });
                                }}
                                value = {this.state.addListing.desc }
                                intent="primary"
                                style={{ width: "100%" }}
                                rows={ 5 }/>
                        </Label>
                        <Button
                            onClick={ this.handleAddListing.bind(this) }
                            intent = "primary"
                            loading={ this.state.listingButton.loading }
                        >Add Listing</Button>
                    </Card>
                </div>
            </div>
        )
    }
}

export default Profile