import React from "react";
import Web3 from "web3";
import { Button, InputGroup, Label, Card, Elevation, TextArea } from "@blueprintjs/core";

import "../styles/grid.scss";

import config from "../config";
import HouseManagerABI from "../contracts/HouseManagement.json";
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
                addr: "",
                title: "",
                desc: "",
                cost: ""
            }
        };
    }

    componentDidMount() {
        let web3 = new Web3(config.addr);
        this.setState({ web3 });
    }

    handleAddListing() {
        console.info("Button Clicked, Booking is being made...")
        this.setState ( {
            listingButton: {
                loading: true
            }
        })

        if (this.state.web3 !== undefined) {
            let HouseManager = new this.state.web3.eth.Contract(HouseManagerABI.abi, config.HouseManagerAddr);

            let addHouse = HouseManager.methods.addHouse(this.state.addListing.title, this.state.addListing.desc, this.state.addListing.cost);
            addHouse
                .estimateGas()
                .then((result) => {
                    return addHouse.send({
                        from: this.state.addListing.addr,
                        gas: (result + 150)
                    });
            }).then((result) => {
                if (result !== {}) {
                    // The transaction was successful
                    successToast( this.state.addListing.title + " was listed successfully!")
                    this.setState({
                        addListing: {
                            addr: "",
                            title: "",
                            desc: "",
                            cost: ""
                        },
                        listingButton: {
                            loading: false,
                        }
                    })
                    console.info("Transaction Successful!")
                }
            }).catch((error) => {
                errorToast( this.state.addListing.title + ' was not listed successfully.')
                this.setState({
                    listingButton: {
                        loading: false,
                    }
                })
                console.error(error);
            });
        } else {
            console.error("Web3 uninitalized")
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-12 col-md-6">
                    <Card elevation={ Elevation.THREE }>
                        <h4>Add Listing</h4>
                        <Label text="Account Address">
                            <InputGroup
                                onChange={(event) => {
                                    this.setState({ addListing: {...this.state.addListing, addr: event.target.value} });
                                }}
                                value={ this.state.addListing.addr }
                                intent="primary"/>
                        </Label>
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