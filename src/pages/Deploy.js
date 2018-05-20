import React from "react";
import Web3 from "web3";
import { Card, Elevation } from "@blueprintjs/core";

import "../styles/grid.scss";

import config from "../config";
import HouseManagerABI from "../contracts/HouseManagement.json";
import AccountManagerABI from "../contracts/AccountManagement.json";
import BookingManagerABI from "../contracts/BookingManager.json";

class Deploy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: undefined,
            houseManagerAddr: "",
            accountManagerAddr: "",
            bookingManagerAddr: ""
        };
    }

    componentDidMount() {
        let web3 = new Web3("http://localhost:7545");
        console.log(web3);
        this.setState({ web3 });
        web3.eth.defaultAccount = web3.eth.accounts[0];

        let newHouseManager = new web3.eth.Contract(HouseManagerABI.abi, {
            data: HouseManagerABI.bytecode,
            gas: 6721975
        });

        let newAccountManager = new web3.eth.Contract(AccountManagerABI.abi, {
            data: AccountManagerABI.bytecode,
            gas: 6721975
        });

        let newBookingManager = new web3.eth.Contract(BookingManagerABI.abi, {
            data: BookingManagerABI.bytecode,
            gas: 6721975
        });



        let deployedHouseManager = newHouseManager.deploy({
            data: HouseManagerABI.bytecode,
        });
        deployedHouseManager.estimateGas().then((result) => {
            return deployedHouseManager.send({
                from: config.mainAccount,
                gas: (result + 250)
            });
        }).then((newContract) => {
            this.setState({ houseManagerAddr: newContract.options.address });
        }).catch((error) => {
            console.error(error);
        });

        let deployedAccountManager = newAccountManager.deploy({
            data: AccountManagerABI.bytecode
        });
        deployedAccountManager.estimateGas().then((result) => {
            return deployedAccountManager.send({
                from: config.mainAccount,
                gas: (result + 250)
            });
        }).then((newContract) => {
            this.setState({ accountManagerAddr: newContract.options.address });
        }).catch((error) => {
            console.error(error);
        });

        let deployedBookingManager = newBookingManager.deploy({
            data: BookingManagerABI.bytecode
        });
        deployedBookingManager.estimateGas().then((result) => {
            return deployedBookingManager.send({
                from: config.mainAccount,
                gas: (result + 250)
            });
        }).then((newContract) => {
            this.setState({ bookingManagerAddr: newContract.options.address });
        }).catch((error) => {
            console.error(error);
        });

    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-12">
                    <Card elevation={ Elevation.THREE }>
                        <h4>Deployed</h4>
                        <p>House Manager: { this.state.houseManagerAddr }</p>
                        <p>Account Manager: { this.state.accountManagerAddr }</p>
                        <p>Booking Manager: { this.state.bookingManagerAddr }</p>
                    </Card>
                </div>
            </div>
        );
    }
}

export default Deploy;