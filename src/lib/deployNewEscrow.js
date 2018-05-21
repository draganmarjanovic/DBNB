import Web3 from "web3"

import config from "../config";
import EscrowManager from "./EscrowManagement";
import EscrowABI from "../contracts/DBNBEscrow.json";
import { successToast, errorToast } from "./Toaster";

/**
 * 
 * @param {address} renter 
 * @param {address} owner 
 * @param {number} costPerDay Can be in either ETH or WEI
 * @param {number} numberOfDays The number of days the booking is
 * @param {number} startTime The start time of the booking in seconds since epoch
 */
const newEscrow = async (renter, owner, costPerDay, numberOfDays, startTime) => {
    
    console.log("Creating Escrow...")

    const costPerDayinWei = Web3.utils.toWei(
        costPerDay.toString(),
        "ether"
    );
    const amountToPay = Web3.utils.toBN(costPerDayinWei).mul(Web3.utils.toBN(numberOfDays)).toString();

    console.log(costPerDay, numberOfDays);
    console.log(costPerDayinWei, amountToPay);

    const web3 = new Web3(config.addr);
    const EscrowCreator = new web3.eth.Contract(EscrowABI.abi, {
        data: EscrowABI.bytecode,
        gas: 6721975 // FIXME: Automate gas calculations
    })

    const options = [
        renter,
        owner,
        costPerDayinWei,
        numberOfDays,
        startTime
    ]
    console.log("Arguments:", options)

    const contractDeployer = EscrowCreator.deploy({
        data: EscrowABI.bytecode,
        arguments: options,
    })

    const estimatedGas = await contractDeployer.estimateGas();

    const createdContract = await contractDeployer.send({
        from: renter,
        gas: estimatedGas + 250,
        value: amountToPay
    })

    console.log("Created Escrow Contract:", createdContract);
    return createdContract.options.address;
};

export default newEscrow;
