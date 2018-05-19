import Web3 from "web3";

import config from "../config";
import BookingManagerABI from "../contracts/BookingManager.json";

const web3 = new Web3(config.addr);

class BookingManager {
    constructor() {
        this.BookingContract = new web3.eth.Contract(BookingManagerABI.abi, config.BookingManagerAddr);
    }

    addBooking(house, account, start, duration) {
        let startDay = Math.floor(start / 86400);
        let addBookingFunc = this.BookingContract.methods.addBooking(house.contractAddr, account.contractAddr, startDay, duration);
        return addBookingFunc.estimateGas().then((result) => {
            return addBookingFunc.send({
                from: account.getAccountID(),
                gas: (result + 150)
            });
        }).then((result) => {
            if (result !== {}) {
                return true;
            }
            return false;
        });
    }
}

export default new BookingManager();