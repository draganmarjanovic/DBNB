import React from "react";
import { Card, Elevation, ButtonGroup, Button, Overlay, InputGroup, Label, Popover, Position } from "@blueprintjs/core";
import DayPicker from "react-day-picker";
import "../../node_modules/react-day-picker/lib/style.css";

import HouseManagement from "../lib/HouseManagement";
import AccountManagement from "../lib/AccountManagement";
import BookingManagement from "../lib/BookingManagement";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: undefined,
            listings: undefined,
            showAvailablity: undefined,
            availablityDay: undefined,
            booked: undefined,
            makeBooking: undefined,
            bookingAccount: undefined,
            makeNewBooking: undefined,
            makeNewBookingSelected: undefined,
            makeNewBookingSelectedPicker: undefined
        };
    }

    fetchHouses() {
        HouseManagement.getAllHouses().then((results) => {
            this.setState({ listings: results });
        }).catch(console.error);
    }

    fetchAvailablity(timeStamp) {
        this.setState({ booked: undefined });
        if (this.state.showAvailablity) {
            this.state.showAvailablity.isBooked(timeStamp).then((result) => {
                this.setState({ booked: result });
            }).catch((error) => {
                console.error(error);
            });
        }
    }

    fetchBookingAvailablity(timeStamp, duration) {
        this.setState({ booked: undefined });
        if (this.state.makeBooking) {
            let dayStamp = timeStamp;
            let promiseList = [];
            for (let i = 0; i < duration; i++) {
                let tempStamp = (dayStamp + i);
                promiseList.push(this.state.makeBooking.isBooked(tempStamp));
            }
            Promise.all(promiseList).then((results) => {
                console.log(results);
                let booked = false;
                for(let i = 0; i < results.length; i++) {
                    if (results[i] === true) {
                        booked = true;
                        break;
                    }
                }
                this.setState({ booked });
            }).catch((error) => {
                console.error(error);
            });
        }
    }

    fetchAccountInfo(accountAddr) {
        AccountManagement.getAccount(accountAddr).then((account) => {
            if (account === undefined) {
                // TODO: Add some output here
            }
            this.setState({ bookingAccount: account });
        }).catch((error) => {
            console.error(error);
        });
    }

    handleMakeBooking() {
        let house = this.state.makeBooking;
        let account = this.state.bookingAccount;
        let start = this.state.makeNewBookingSelected;
        let duration = this.state.makeNewBooking.duration;

        house.makeBooking(account, start, duration).then((result) => {
            if (result) {
                console.log("Booking Made");
            } else {
                console.log("Failed");
            }
            return account.confirmBooking(house, start, duration);
        }).then((result) => {
            if (result) {
                console.log("Booking Confirmed");
            } else {
                console.log("Failed");
            }
        }).catch((error) => {
            console.error(error);
        });

        // BookingManagement.addBooking(house, account, start, duration).then((result) => {
        //     if (result) {
        //         console.log("Booking Made");
        //     } else {
        //         console.log("Failed");
        //     }
        // }).catch((error) => {
        //     console.error(error);
        // });
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
                            <span style={{ float: "right" }}>{ house.getPrice() } ETH per night </span><br />
                            <div>{ house.getDescription() }</div>
                            <br />
                            <ButtonGroup fill={ true }>
                                <Button
                                    onClick={() => {
                                        this.setState({ showAvailablity: house, booked: undefined });
                                    }}
                                    intent="primary"
                                >View Availablity</Button>
                                <Button
                                    onClick={() => {
                                        this.setState({ makeBooking: house });
                                    }}
                                    intent="primary"
                                >Make a Booking</Button>
                            </ButtonGroup>
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

                <Overlay isOpen={ this.state.showAvailablity !== undefined } onClose={() => {
                    this.setState({ showAvailablity: undefined });
                }}>
                    <Card elevation={ Elevation.THREE } style={{ top: "50%", left: "50%", transform: "perspective(1px) translateY(-50%) translateX(-50%)", minWidth: "50%" }}>
                        <center>
                            <DayPicker
                                selectedDays={ this.state.availablityDay }
                                onDayClick={(day, { selected }) => {
                                    if (selected === undefined) {
                                        let timeStamp = day.getTime() / 1000;
                                        this.fetchAvailablity(Math.floor(timeStamp / 86400));
                                    }
                                    this.setState({ availablityDay: selected ? undefined : day, booked: undefined });
                                }}
                            />
                        </center>
                        <br />
                        <h4>Availablity:</h4>
                        { this.state.booked !== undefined ? (
                            <p>House Booking Status: { this.state.booked ? "Booked" : "Available" }</p>
                        ) : (
                            <p>Loading House Status</p>
                        )}
                    </Card>
                </Overlay>

                <Overlay isOpen={ this.state.makeBooking !== undefined } onClose={() => {
                    this.setState({ makeBooking: undefined });
                }}>
                    <Card elevation={ Elevation.THREE } style={{ top: "50%", left: "50%", transform: "perspective(1px) translateY(-50%) translateX(-50%)", minWidth: "50%" }}>
                        <h4>Make a Booking</h4>
                        <Label text="Account Address">
                            <InputGroup
                                onChange={(event) => {
                                    this.setState({ makeNewBooking: {...this.state.makeNewBooking, accAddr: event.target.value} });
                                }}
                                intent="primary"
                                rightElement={ <Button
                                    onClick={() => {
                                        this.fetchAccountInfo(this.state.makeNewBooking.accAddr);
                                    }}
                                    intent="primary"
                                >Check Account</Button>}
                                />
                        </Label>

                        { this.state.bookingAccount !== undefined &&
                            <p>Account Name: { this.state.bookingAccount.getName() }</p>
                        }

                        <center>
                            <DayPicker
                                selectedDays={ this.state.makeNewBookingSelectedPicker }
                                onDayClick={(day, { selected }) => {
                                    if (!selected) {
                                        let timeStamp = day.getTime() / 1000;
                                        this.setState({ makeNewBookingSelected: Math.floor(timeStamp / 86400) });
                                    }
                                    this.setState({ makeNewBookingSelectedPicker: selected ? undefined : day });
                                }}
                            />
                        </center>
                        <br />

                        <Label text="Booking Duration">
                            <InputGroup
                                onChange={(event) => {
                                    this.fetchBookingAvailablity(this.state.makeNewBookingSelected, event.target.value);
                                    this.setState({ makeNewBooking: {...this.state.makeNewBooking, duration: event.target.value} });
                                }}
                                intent="primary"
                            />
                        </Label>

                        { this.state.makeNewBooking !== undefined && this.state.makeBooking !== undefined && this.state.bookingAccount !== undefined && this.state.makeNewBooking.duration !== "" && this.state.booked === false &&
                            <div>
                                <p>Total Cost: { this.state.makeNewBooking.duration * this.state.makeBooking.getPrice() }</p>
                                <br /><br />
                                <Popover usePortal={ true } position={ Position.BOTTOM }>
                                    <Button intent="primary">Make Booking</Button>
                                    <div style={{ padding: "0.8rem" }}>
                                        <p>Are you sure you want to make a booking?</p>
                                        <Button onClick={ this.handleMakeBooking.bind(this) }
                                            intent="primary"
                                        >Confirm</Button>
                                    </div>
                                </Popover>
                            </div>
                        }

                    </Card>
                </Overlay>

            </div>

        );
    }
}

export default Home;