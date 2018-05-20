import React from "react";
import Web3 from "web3";
import { Button, InputGroup, NumericInput, Label, Card, Elevation, TextArea } from "@blueprintjs/core";

import "../styles/grid.scss";

import config from "../config";
import EscrowManager from "../lib/EscrowManagement";
import EscrowABI from "../contracts/DBNBEscrow.json"
import { successToast, errorToast } from "../lib/Toaster"

const WEI = 1000000000000000000;

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
                address: undefined,
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
        const sendEth = this.state.createEscrow.costPerDay * this.state.createEscrow.numberOfDays * WEI;
        console.log(sendEth, sendEth/WEI);
        const sendValue = this.state.createEscrow.costPerDay * this.state.createEscrow.numberOfDays;
        console.log(Web3.utils.toWei(sendValue.toString(), "ether"));
        
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
                    this.state.createEscrow.costPerDay * WEI,
                    this.state.createEscrow.numberOfDays,
                    this.state.createEscrow.startTime
                ]
            });

            deployedEscrow
                .estimateGas()
                .then(gas => deployedEscrow.send({
                    from: config.mainAccount,
                    gas: (gas + 250),
                    value: Web3.utils.toWei(sendValue.toString(), "ether")
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
                                    <h4>Look Up Escrow</h4>
                                    <Label text="Escrow Address">
                                        <InputGroup
                                            onChange={event => {
                                                this.setState({ escrowContract: {address: event.target.value, ...this.state.escrowContract}});
                                            }}
                                            value={this.state.escrowContract.address}
                                            intent="primary"
                                        />
                                    </Label>
                                    <Button
                                        // onClick={this.handleSearchAccount.bind(this)}
                                        intent="primary"
                                    >
                                        Search
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