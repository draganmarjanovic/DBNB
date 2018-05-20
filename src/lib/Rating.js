import Web3 from "web3";

import config from "../config";
import RatingABI from "../contracts/Rating.json";

const web3 = new Web3(config.addr);

export default class Rating {
    constructor(contractAddr) {
        this.contractAddr = contractAddr;
        this.RatingContract = new web3.eth.Contract(RatingABI.abi, contractAddr);
    }

    load() {
        return this.RatingContract.methods.getStars().call().then((stars) => {
            this.stars = stars;
            return this.RatingContract.methods.getTitle().call();
        }).then((title) => {
            this.title = web3.utils.toAscii(title);
            return this.RatingContract.methods.getComment().call();
        }).then((comment) => {
            this.comment = comment;
            return this;
        });
    }

    getStars() {
        if (this.stars === undefined) {
            this.load();
        }
        return this.stars;
    }

    getTitle() {
        if (this.title === undefined) {
            this.load();
        }
        return this.title;
    }

    getComment() {
        if (this.comment === undefined) {
            this.load();
        }
        return this.comment;
    }
}