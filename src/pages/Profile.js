import React from "react";
import Web3 from "web3";
import { Page, Panel } from "../components/Layout";
import { Button, Text } from "../components/Input";

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
            <Page title="Profile">
                <div className="row">
                    <div className="col-sm-12 col-md-6">
                        <Panel title="Add Listing">
                            <Text
                                label="Account Address"
                                onChange={(val) => {
                                    this.state.addListing.addr = val;
                                    this.setState({ addListing: this.state.addListing });
                                }}
                                />
                            <Text 
                                label="Listing Title"
                                onChange={(val) => {
                                    this.state.addListing.title = val;
                                    this.setState({ addListing: this.state.addListing });
                                }}
                                />
                            <Text
                                label="Description"
                                onChange={(val) => {
                                    this.state.addListing.desc = val;
                                    this.setState({ addListing: this.state.addListing });
                                }}
                                />
                            <Button
                                onClick={ this.handleAddListing.bind(this) }
                            >Add Listing</Button>
                        </Panel>
                    </div>
                </div>
            </Page>
        )
    }
}

export default Profile