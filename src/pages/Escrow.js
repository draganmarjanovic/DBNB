import React from "react";
import Web3 from "web3";
import { Button, InputGroup, NumericInput, Label, Card, Elevation, TextArea } from "@blueprintjs/core";
import { convertWei, convertTime } from "../lib/ether"

import "../styles/grid.scss";

import config from "../config";
import EscrowManager from "../lib/EscrowManagement";
import EscrowABI from "../contracts/DBNBEscrow.json"
import { successToast, errorToast } from "../lib/Toaster"

class Escrow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: undefined,
            createEscrow: {
                renterAddr: "", 
                ownerAddr: "",
                costPerDay: 0.1,
                numberOfDays: 1,
                startTime: Math.floor(Date.now() / 1000),
            },
            escrowContract: {
                address: "",
                item: "",
            },
            loadedEscrow: {
                manager: undefined,
                
            }
        };
    }

    componentDidMount() {
        let web3 = new Web3(config.addr);
        this.setState({ web3 });
    }

    getEscrowContract() {
        console.log("Reading contract: ", this.state.escrowContract.address);
    }

    handleCreateEscrow() {
        console.log(this.state.createEscrow);
        const costPerDay = Web3.utils.toWei(this.state.createEscrow.costPerDay.toString(), "ether");
        const amountToPay = Web3.utils.toWei((this.state.createEscrow.costPerDay * this.state.createEscrow.numberOfDays).toString(), "ether");
        
        console.log("Cost Per Day", costPerDay);
        console.log("Amount To Pay", amountToPay);

        if (this.state.web3 !== undefined) {
            let EscrowCreator = new this.state.web3.eth.Contract(EscrowABI.abi, {
                data: EscrowABI.bytecode,
                gas: 6721975
            });

            let deployedEscrow = EscrowCreator.deploy({
                data: EscrowABI.bytecode,
                arguments: [
                    this.state.createEscrow.renterAddr,
                    this.state.createEscrow.ownerAddr,
                    costPerDay,
                    this.state.createEscrow.numberOfDays,
                    this.state.createEscrow.startTime
                ]
            });

            deployedEscrow
                .estimateGas()
                .then(gas => deployedEscrow.send({
                    from: this.state.createEscrow.renterAddr,
                    gas: (gas + 250),
                    value: amountToPay,
                }))
                .then(newContract => {
                    console.log(newContract);
                    this.setState({...this.state, escrowContract: {...this.state.escrowContract, address: newContract.options.address}})
                })
                .catch(error => console.log(error))
        } else {
            console.log("Web3 not defined");
        }
    }

    handleLoadEscrow() {
        console.log(this.state.escrowContract.address);
        const manager = new EscrowManager(this.state.escrowContract.address);
        manager
            .getInfo()
            .then(result => {
                console.log(result);
                console.log("Cost per day: ", convertWei(result.costPerDay));
                console.log("Current Balance: ", convertWei(result.currentEscrowBalance));
                console.log("Start Time: ", convertTime(result.startTime).toLocaleString("en-AU"));
                console.log("Release Time: ", convertTime(result.releaseTime).toLocaleString("en-AU"));
            })
            .catch(error => console.log(error));
    }

    render() {
        return (
            <div>
                <div className="row homeRow">
                    <div className="col-sm-12 col-md-6">
                        <Card elevation={ Elevation.THREE }>
                            <h4>Create Escrow</h4>
                            <Label text="Renter Address (your address)">
                                <InputGroup
                                    onChange={(event) => {
                                        this.setState({ createEscrow: {...this.state.createEscrow, renterAddr: event.target.value} });
                                    }}
                                    value={ this.state.createEscrow.renterAddr }
                                    intent="primary"/>
                            </Label>
                            <Label text="Owner Address (owner address of listing)">
                                <InputGroup
                                    onChange={(event) => {
                                        this.setState({ createEscrow: {...this.state.createEscrow, ownerAddr: event.target.value} });
                                    }}
                                    value={ this.state.createEscrow.ownerAddr }
                                    intent="primary"/>
                            </Label>
                            <Label text="Cost per Day (in ETH)">
                                <InputGroup
                                    onChange={(event) => {
                                        this.setState({ createEscrow: {...this.state.createEscrow, costPerDay: event.target.value} });
                                    }}
                                    value={ this.state.createEscrow.costPerDay }
                                    intent="primary"/>
                            </Label>
                            <Label text="Number of Days">
                                <InputGroup
                                    onChange={(event) => {
                                        this.setState({ createEscrow: {...this.state.createEscrow, numberOfDays: event.target.value} });
                                    }}
                                    value={ this.state.createEscrow.numberOfDays }
                                    intent="primary"/>
                            </Label>
                            <Label text="Start Time">
                                <InputGroup
                                    onChange={(event) => {
                                        this.setState({ createEscrow: {...this.state.createEscrow, startTime: event.target.value} });
                                    }}
                                    value={ this.state.createEscrow.startTime }
                                    intent="primary"/>
                            </Label>
                            <Button
                                onClick={ this.handleCreateEscrow.bind(this) }
                                intent="primary"
                            >Add Account</Button>
                        </Card>
                    </div>

                    <div className="col-sm-12 col-md-6">
                        <div className="row">
                            <div className="col-sm-12">
                                <Card elevation={Elevation.THREE}>
                                    <h4>Load Escrow</h4>
                                    <Label text="Escrow Address">
                                        <InputGroup
                                            onChange={event => {
                                                this.setState({
                                                    escrowContract: {
                                                        ...this.state.escrowContract,
                                                        address: event.target.value,
                                                    }
                                                });
                                            }}
                                            value={ this.state.escrowContract.address }
                                            intent="primary"
                                        />
                                    </Label>
                                    <Button
                                        onClick={this.handleLoadEscrow.bind(this)}
                                        intent="primary"
                                    >
                                        Open
                                    </Button>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Escrow;