import React from "react";
import Web3 from "web3";
import { Page, Panel } from "../components/Layout";
import { Button } from "../components/Input";

import "../styles/grid.scss";

import config from "../config";
import HouseManagerABI from "../contracts/HouseManagement.json";
import HouseABI from "../contracts/House.json";

class Deploy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: undefined,
            houseManagerAddr: ""
        };
    }

    componentDidMount() {
        let web3 = new Web3(config.addr);
        this.setState({ web3 });
        web3.eth.defaultAccount = web3.eth.accounts[0];

        let newHouseManager = new web3.eth.Contract(HouseManagerABI.abi, {
            data: HouseManagerABI.bytecode,
            gas: 1500000
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
    }

    render() {
        return (
            <Page title="Deploying">
                <div className="row">
                    <div className="col-sm-12">
                        <Panel title="Deployed">
                            <p>House Manager: { this.state.houseManagerAddr }</p>
                        </Panel>
                    </div>
                </div>
            </Page>
        )
    }
}

export default Deploy;