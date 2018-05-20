import React from "react";
import Web3 from "web3";
import { Button, AnchorButton, InputGroup, NumericInput, Label, Card, Elevation, TextArea, Dialog, Intent, Callout, Popover, Tooltip, Position } from "@blueprintjs/core";
import { convertWei, convertTime } from "../lib/ether"

import "../styles/grid.scss";

import config from "../config";
import EscrowManager from "../lib/EscrowManagement";
import EscrowABI from "../contracts/DBNBEscrow.json"
import { successToast, errorToast } from "../lib/Toaster"

class Escrow extends React.Component {
    constructor(props) {
        console.log(props);
        super(props);
        this.state = {
            web3: undefined,
            user: this.props.account,
            dialog: {
                show: false,
                costPerDay: 0,
                currentBalance: 0,
                daysRented: 0,
                startString: "",
                maturityTime: "",
                primary: {
                    text: "",
                    disabled: true,
                    intent: undefined,
                    onClick: () => {console.log("Default")},
                    popOverText: "",
                    popOverDisabled: true,
                },
                secondary: {
                    text: "",
                    disabled: true,
                    intent: undefined,
                    onClick: () => {console.log("Default")},
                }
            },
            createEscrow: {
                renterAddr: this.props.account.accountID, 
                ownerAddr: "",
                costPerDay: 0.1,
                numberOfDays: 1,
                startTime: Math.floor(Date.now() / 1000),
            },
            escrowContract: {
                address: "",
                item: "",
            },
            manager: undefined,
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
        // FIXME: Convert costPerDay to Wei first then try
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

    toggleDialog() {
        this.setState({ dialog: {...this.state.dialog, show: !this.state.dialog.show} });
    }

    checkIn() {
        const contract = this.state.manager;
        contract
            .checkIn(this.state.user.accountID)
            .then(result => console.log(result))
            .then(() => this.updateState())
            .catch(error => console.error(error))
    }

    releaseEscrow() {
        const contract = this.state.manager;
        contract
            .releaseEscrow(this.state.user.accountID)
            .then(result => console.log(result))
            .then(result => {
                successToast("Escrow has been released succesfully");
            })
            .then(() => this.updateState())
            .catch(error => console.error(error))
    }

    updateState() {

        const manager = new EscrowManager(this.state.escrowContract.address);
        manager
            .getInfo()
            .then(result => {
                const costPerDay = convertWei(result.costPerDay);
                const startString = convertTime(result.startTime).toLocaleString("en-AU");
                const currentBalance = convertWei(result.currentEscrowBalance);
                const maturityTime = convertTime(result.releaseTime).toLocaleString("en-AU");

                this.setState({
                    dialog: {
                        ...this.state.dialog,
                        costPerDay,
                        currentBalance,
                        startString,
                        maturityTime,
                        daysRented: result.daysRented,
                    }
                })

                if (result.escrowDefunct) {
                    console.log("Escrow defunct, hide buttons, show warning");
                    this.setState({
                        dialog: {
                            ...this.state.dialog,
                            primary: {
                                ...this.state.dialog.primary,
                                text: "CLAIMED",
                                disabled: true,
                                intent: Intent.SUCCESS,
                                popOverDisabled: false,
                                popOverText: "The Escrow has been defunct and is now closed."
                            }
                        }
                    })
                } else {
                    if (result.renter === this.state.user.accountID) {
                        // Renter
                        if (!result.renterCheckedIn) {
                            this.setState({
                                dialog: {
                                    ...this.state.dialog,
                                    primary: {
                                        ...this.state.dialog.primary,
                                        text: "CHECK-IN",
                                        intent: Intent.PRIMARY,
                                        disabled: false,
                                        onClick: this.checkIn.bind(this),
                                        popOverDisabled: true
                                    }
                                }
                            });
                        } else {
                            // They have already checked in
                            this.setState({
                                dialog: {
                                    ...this.state.dialog,
                                    primary: {
                                        ...this.state.dialog.primary,
                                        text: "CHECK-IN",
                                        disabled: true,
                                        intent: Intent.SUCCESS,
                                        popOverDisabled: false,
                                        popOverText:
                                            "You have already checked in!"
                                    }
                                }
                            });
                        }
                    } else {
                        // Owner
                        if (!result.renterCheckedIn) {
                            // if the renter has not checked in yet, wait for them to check in.
                            this.setState({
                                dialog: {
                                    ...this.state.dialog,
                                    primary: {
                                        ...this.state.dialog.primary,
                                        text: "Accept Check In",
                                        intent: Intent.WARNING,
                                        disabled: true,
                                        popOverDisabled: false,
                                        popOverText:
                                            "The renter has yet to check in."
                                    }
                                }
                            });
                        } else {
                            // Renter has checked in so the owner can checkin now
                            if (!result.ownerCheckedIn) {
                                // Has not chcecked in, so has to check in
                                this.setState({
                                    dialog: {
                                        ...this.state.dialog,
                                        primary: {
                                            ...this.state.dialog.primary,
                                            text: "Accept Check In",
                                            intent: Intent.PRIMARY,
                                            disabled: false,
                                            onClick: this.checkIn.bind(this),
                                            popOverDisabled: true
                                        }
                                    }
                                });
                            } else {
                                // Show claim button
                                const hasMatured =
                                    convertTime(result.releaseTime) <
                                    Date.now();
                                console.log("Has matrured:", hasMatured);
                                this.setState({
                                    dialog: {
                                        ...this.state.dialog,
                                        primary: {
                                            ...this.state.dialog.primary,
                                            text: "CLAIM",
                                            intent: Intent.SUCCESS,
                                            disabled: !hasMatured,
                                            popOverDisabled: hasMatured,
                                            popOverText: hasMatured
                                                ? "Hello"
                                                : "The Escrow has not matured yet!",
                                            onClick: this.releaseEscrow.bind(
                                                this
                                            )
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
                
                this.toggleDialog();
                console.log(this.state.dialog)
            })
            .catch(error => console.log(error));
    }

    handleLoadEscrow() {
        console.log(this.state.escrowContract.address);
        const manager = new EscrowManager(this.state.escrowContract.address);
        this.setState({
            ...this.state,
            manager
        }, () => {
            this.updateState();
        })
    }

    render() {
        return (
            <div>
                <Dialog
                    icon="projects"
                    isOpen={this.state.dialog.show}
                    onClose={this.toggleDialog.bind(this)}
                    title="Booking <Listing Address>"
                >
                    <table class="pt-html-table .modifier">
                        <thead>
                            <tr>
                                 <th>Start Time</th>
                                 <th>{ this.state.dialog.startString }</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Number of Days:</td>
                                <td>{this.state.dialog.daysRented} </td>
                            </tr>
                            <tr>
                                <td>Cost per Night:</td>
                                <td>{this.state.dialog.costPerDay} </td>
                            </tr>
                            <tr>
                                <td>Balance:</td>
                                <td>{this.state.dialog.currentBalance}</td>
                            </tr>
                            <tr>
                              <td>Maturity Time: </td>
                              <td>{this.state.dialog.maturityTime}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="pt-dialog-footer">
                        <div className="pt-dialog-footer-actions">
                            <Button 
                                text="CANCEL"
                                intent={Intent.DANGER}
                                onClick={() => console.log("Cancel Escrow")}
                            />
                            <Popover contnet={<h1>Popover!</h1>} position={Position.BOTTOM}>
                                <Tooltip 
                                    content= {this.state.dialog.primary.popOverText}
                                    position={Position.BOTTOM}
                                    disabled={this.state.dialog.primary.popOverDisabled}>
                                <AnchorButton
                                    intent={ this.state.dialog.primary.intent}
                                    onClick={ this.state.dialog.primary.onClick}
                                    text={this.state.dialog.primary.text}
                                    disabled={this.state.dialog.primary.disabled}
                                />
                                </Tooltip>
                            </Popover>
                            
                        </div>
                    </div>
                </Dialog>

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
                            >Create Escrow</Button>
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