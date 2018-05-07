import React from "react";
import Web3 from "web3";
import { Page, Panel } from "../components/Layout";
import { Button, InputGroup, Label, Card, Elevation } from "@blueprintjs/core";

import "../styles/grid.scss";

import config from "../config";
import HouseManagerABI from "../contracts/HouseManagement.json";
import HouseABI from "../contracts/House.json";

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: undefined,
            listings: undefined,
            addListing: {
                addr: "",
                title: "",
                desc: ""
            }
        };
    }

    componentDidMount() {
        let web3 = new Web3(config.addr);
        this.setState({ web3 });
    }

    handleAddListing() {
        if (this.state.web3 != undefined) {
            let HouseManager = new this.state.web3.eth.Contract(HouseManagerABI.abi, config.HouseManagerAddr);

            let addHouse = HouseManager.methods.addHouse(this.state.addListing.title, this.state.addListing.desc);
            addHouse.estimateGas().then((result) => {
                return addHouse.send({
                    from: this.state.addListing.addr,
                    gas: (result + 150)
                });
            }).then((result) => {
                if (result != {}) {
                    // The transaction was successful
                }
            }).catch((error) => {
                console.error(error);
            });
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
                                    this.state.addListing.addr = event.target.value;
                                    this.setState({ addListing: this.state.addListing });
                                }}
                                intent="primary"/>
                        </Label>
                        <Label text="Listing Title">
                            <InputGroup
                                onChange={(event) => {
                                    this.state.addListing.title = event.target.value;
                                    this.setState({ addListing: this.state.addListing });
                                }}
                                intent="primary"/>
                        </Label>
                        <Label text="Description">
                            <InputGroup
                                onChange={(event) => {
                                    this.state.addListing.desc = event.target.value;
                                    this.setState({ addListing: this.state.addListing });
                                }}
                                intent="primary"/>
                        </Label>
                        <Button
                            onClick={ this.handleAddListing.bind(this) }
                            intent="primary"
                        >Add Listing</Button>
                    </Card>
                </div>
            </div>
        )
    }
}

export default Profile