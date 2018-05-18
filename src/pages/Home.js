import React from "react";
import { Card, Elevation } from "@blueprintjs/core";

import HouseManagement from "../lib/HouseManagement";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: undefined,
            listings: undefined
        };
    }

    fetchHouses() {
        HouseManagement.getAllHouses().then((results) => {
            this.setState({ listings: results });
        }).catch(console.error);
    }

    componentDidMount() {
        this.fetchHouses();
    }

    render() {

        let listingResult = [];
        if (this.state.listings !== undefined) {
            this.state.listings.forEach((house) => {
                listingResult.push((
                    <div className="col-md-6 col-sm-12" key={ house.getID() }>
                        <Card elevation={ Elevation.THREE }>
                            <h4 style={{ display: "inline-block" }}>{ house.getTitle() }</h4>
                            <span style={{ float: "right" }}>${ house.getPrice() } PPPN</span><br />
                            { house.getDescription() }
                        </Card>
                    </div>
                ))
            })
        }

        return (
            <div className="row homeRow">
                <div className="col-sm-12">
                    <Card elevation={ Elevation.THREE }>
                        <h4>Huge</h4>
                        This is a masshive panel
                    </Card>
                </div>
                
                { listingResult }

            </div>
        );
    }
}

export default Home;