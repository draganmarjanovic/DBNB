import Web3 from "web3";

import config from "../config";
import EscrowABI from "../contracts/DBNBEscrow.json";

const web3 = new Web3(config.addr);

class EscrowManager {
    constructor(contractAddress) {
        this.EscrowContract = new web3.eth.Contract(
            EscrowABI.abi,
            contractAddress
        );
    }

    releaseEscrow(account) {
        const releaseFunc = this.EscrowContract.methods.releaseEscrow();
        // FIXME: Gas Estimations broken
        return Promise.resolve()
            .then(result => {
                return releaseFunc.send({
                    from: account,
                    gas: 65000
                });
            })
            .then(result => {
                if (result !== {}) {
                    return true;
                }
                return false;
            });
    }

    checkIn(address) {
        console.log("Checkin attempt")
        const checkInFunc = this.EscrowContract.methods.checkIn();
        // Estimate Gas function broken
        return Promise.resolve()
            .then(gas => {
                return checkInFunc.send({
                    from: address,
                    gas: 655000
                })
            })
            .then(result => {
                console.log("Checkin Results", result);
                if (result !== {}) {
                    return true;
                }
                return false;
            })
    }

    /**
     * Loads all the data of the escrow from the blockchain
     * @returns Promise which will resolve to this object
     */
    load() {
        return this.EscrowContract.methods
            .getInfo()
            .call()
            .then(result => {
                const information = {
                    renter: result[0],
                    owner: result[1],
                    costPerDay: result[2],
                    startTime: result[3],
                    daysRented: result[4],
                    releaseTime: result[5],
                    renterCheckedIn: result[6],
                    ownerCheckedIn: result[7],
                    escrowCancelled: result[8],
                    escrowDefunct: result[9],
                    timePeroid: result[10],
                    currentEscrowBalance: result[11]
                }
                this.information = information;
            });
    }

    getInfo(){
        if (!this.information) {
            return this.load()
                .then(() => {
                    return this.information
                })
        } else {
            return this.information;
        }
    }
}

export default EscrowManager;
