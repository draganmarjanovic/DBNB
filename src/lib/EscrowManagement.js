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
        return releaseFunc
            .estimateGas()
            .then(result => {
                return releaseFunc.send({
                    from: account.getAccountID(),
                    gas: result + 150
                });
            })
            .then(result => {
                if (result !== {}) {
                    return true;
                }
                return false;
            });
    }

    /**
     * Loads all the data of the escrow from the blockchain
     * @returns Promise which will resolve to this object
     */
    load() {
        return this.EscrowContract.methods.getInfo().call.then(result => {
            console.log(result);
        });
    }

    getInfo(account) {}
}

export default EscrowManager;
