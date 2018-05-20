import Web3 from "web3";

import config from "../config";
import HouseManagerABI from "../contracts/HouseManagement.json";
import HouseABI from "../contracts/House.json";
import Rating from "./Rating";

const web3 = new Web3(config.addr);

class HouseManager {
    /**
     * Class for handling management of houses, this is direct communication connection to the instance running on the blockchain
     */
    constructor() {
        this.HouseManagerContract = new web3.eth.Contract(HouseManagerABI.abi, config.HouseManagerAddr);
    }

    /**
     * Gets all the houses and returns them as a promise. The promise will be resolved to an array
     * @returns {Promise} Promise with a resolution of an arry of accounts
     */
    getAllHouses() {
        return this.HouseManagerContract.methods.getAllHouses().call().then((result) => {
            let houseList = [];
            result.forEach((blockID) => {
                let house = new House(blockID);
                houseList.push(house.load());
            });
            return Promise.all(houseList);
        });
    }

    addHouse(account, title, desc, price) {
        let addHouse = this.HouseManagerContract.methods.addHouse(title, desc, price);
        return addHouse.estimateGas().then((result) => {
            return addHouse.send({
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

class House {
    /**
     * Class to help manage and control Houses on the blockchain
     * @param {string} contractAddr Address of the House on the blockchain
     */
    constructor(contractAddr) {
        this.contractAddr = contractAddr;
        this.HouseContract = new web3.eth.Contract(HouseABI.abi, contractAddr);
        // this.HouseContract.events.LogDebug((err, data) => {
        //     if (err) {
        //         console.error(err);
        //     } else {
        //         console.log(data);
        //     }
        // });
    }

    /**
     * Loads all the data of the account from the blockchain
     * @returns {Promise} Promise which will resolve to this object
     */
    load() {
        return this.HouseContract.methods.getTitle().call().then((title) => {
            this.title = title;
            return this.HouseContract.methods.getDescription().call();
        }).then((desc) => {
            this.desc = desc;
            return this.HouseContract.methods.getPrice().call();
        }).then((price) => {
            this.price = price;
            return this.HouseContract.methods.getRatings().call();
        }).then((ratings) => {
            let ratingsList = [];
            ratings.forEach((ratingAddr) => {
                ratingsList.push((new Rating(ratingAddr)).load());
            });
            return Promise.all(ratingsList);
        }).then((ratings) => {
            this.ratings = ratings;
            return this;
        });
    }

    /**
     * Gets the title of the House object
     * @returns {string} Title associated with the House
     */
    getTitle() {
        if (this.title === undefined) {
            this.load();
        }
        return this.title;
    }

    /**
     * Gets the description of the House object
     * @returns {string} Description associated with the House
     */
    getDescription() {
        if (this.desc === undefined) {
            this.load();
        }
        return this.desc;
    }

    getPrice() {
        if (this.price === undefined) {
            this.load();
        }
        return this.price;
    }

    /**
     * Gets the id of the House object
     * @returns {string} ID of the contract on the blockchain
     */
    getID() {
        return this.contractAddr;
    }

    getRatings() {
        if (this.ratings === undefined) {
            this.load();
        }
        return this.ratings;
    }

    isBooked(timeStamp) {
        return this.HouseContract.methods.isBooked(timeStamp).call();
    }

    makeBooking(account, start, duration) {
        let makeBooking = this.HouseContract.methods.makeBooking(account.contractAddr, start, duration);
        return makeBooking.estimateGas().then((result) => {
            return makeBooking.send({
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

    makeRating(account, stars, title, comment) {
        let encodedTitle = web3.utils.asciiToHex(title);
        let makeRating = this.HouseContract.methods.makeRating(account.contractAddr, stars, encodedTitle, comment);
        return makeRating.estimateGas().then((result) => {
            return makeRating.send({
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

export default new HouseManager();