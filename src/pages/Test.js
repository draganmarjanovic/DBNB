import React from "react";
import { Page, Panel } from "../components/Layout";
import { Button } from "../components/Input";

import Web3 from "web3";

class Test extends React.Component {

    componentDidMount() {
        let web3 = new Web3("http://localhost:7545");
        web3.eth.defaultAccount = web3.eth.accounts[0];

        let coursetro = new web3.eth.Contract([
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_fName",
                        "type": "string"
                    },
                    {
                        "name": "_age",
                        "type": "uint256"
                    }
                ],
                "name": "setInstructor",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "getInstructor",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    },
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }
        ], "0x4425b49c73dd33f443b71ad6eed9ebb1681e7610");
        console.log(coursetro.methods);
        console.log(coursetro.methods.getInstructor());

        coursetro.methods.getInstructor().call({from: "0x5d372cfA9Beee5Beb31d683b219Df2d7C863ABd8"}).then((result) => {
            console.log(result);
        });

        this.setState({ web3 });
    }

    render() {
        return (
            <Page title="Test">
                <div className="row">
                    <div className="col-sm-6">
                        <Panel title="Test">
                            Some test content goes here
                        </Panel>
                    </div>
                </div>
            </Page>
        );
    }
}

export default Test;