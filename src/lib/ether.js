import Web3 from "web3";

/**
 * Converts a number to the given unit.
 * If no unit is given it is converted to eth
 * @param {string | number } number 
 * @param {*} unit 
 */
const convertWei = (number, unit) => {
    return Web3.utils.fromWei(Web3.utils.toBN(number), unit);
}

/**
 * Converts a number to Wei.
 * Assumes ether as defualt
 * @param {*} number 
 * @param {*} unit 
 */
const convertEther = (number, unit) => {
    if (!unit) {
        unit = "ether"
    }
    return Web3.utils.toWei(Web3.utils.toBN(number), unit);
}

/**
 * 
 * @param {*} time Time since epoch in seconds
 */
const convertTime = (time) => {
    return new Date(time * 1000)
}

export {
    convertWei,
    convertEther,
    convertTime
}