import React from "react";
import Web3 from "web3";
import { Page, Panel } from "../components/Layout";
import { Button } from "../components/Input";

import "../styles/grid.scss";

import config from "../config";
import HouseManagerABI from "../contracts/HouseManagement.json";
import HouseABI from "../contracts/House.json";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: undefined,
            listings: undefined
        };
    }

    fetchHouses() {
        if (this.state.web3 != undefined) {
            let HouseManager = new this.state.web3.eth.Contract(HouseManagerABI.abi, config.HouseManagerAddr);

            let houseListings = [];

            HouseManager.methods.getAllHouses().call().then((result) => {
                result.forEach((blockID) => {
                    let house = new this.state.web3.eth.Contract(HouseABI.abi, blockID);
                    let houseList = {
                        id: blockID
                    };
                    house.methods.getTitle().call().then((title) => {
                        house.methods.getDescription().call().then((desc) => {
                            houseList.title = title;
                            houseList.desc = desc;
                            houseListings.push(houseList);
                            this.setState({ listings: houseListings });
                        });
                    });
                });
            });
        }
    }

    componentDidMount() {
        let web3 = new Web3(config.addr);
        this.setState({ web3 });
        web3.eth.defaultAccount = web3.eth.accounts[0];
        setTimeout(this.fetchHouses.bind(this), 0);
    }

    render() {

        let listingResult = [];
        if (this.state.listings != undefined) {
            this.state.listings.forEach((listing) => {
                console.log(listing);
                listingResult.push((
                    <div className="col-md-6 col-sm-12" key={ listing.id }>
                        <Panel title={ listing.title }>
                            { listing.desc }
                        </Panel>
                    </div>
                ))
            })
        }

        return (
            <Page title="Home">
                <div className="row">
                    <div className="col-sm-12">
                        <Panel title="Huge">
                            This is a masshive panel
                        </Panel>
                    </div>
                    
                    { listingResult }

                </div>
            </Page>
        );
    }
}

export default Home;