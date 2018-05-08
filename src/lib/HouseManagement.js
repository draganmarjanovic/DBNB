import Web3 from "web3";

import config from "../config";
import HouseManagerABI from "../contracts/HouseManagement.json";
import HouseABI from "../contracts/House.json";

const web3 = new Web3(config.addr);

class HouseManager {
    constructor() {
        this.HouseManagerContract = new web3.eth.Contract(HouseManagerABI.abi, config.HouseManagerAddr);
    }

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
}

class House {
    constructor(contractAddr) {
        this.contractAddr = contractAddr;
        this.HouseContract = new web3.eth.Contract(HouseABI.abi, contractAddr);
    }

    load() {
        return this.HouseContract.methods.getTitle().call().then((title) => {
            this.title = title;
            return this.HouseContract.methods.getDescription().call();
        }).then((desc) => {
            this.desc = desc;
            return this;
        });
    }

    getTitle() {
        if (this.title === undefined) {
            this.load();
        }
        return this.title;
    }

    getDescription() {
        if (this.desc === undefined) {
            this.load();
        }
        return this.desc;
    }

    getID() {
        return this.contractAddr;
    }
}

export default new HouseManager();