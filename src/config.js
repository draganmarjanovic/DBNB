let provider;
let metaMask = false;
if (typeof global.web3 !== "undefined") {
    provider = global.web3.currentProvider;
    metaMask = true;
} else {
    provider = "ws://localhost:7545";
}
console.log(provider);

export default {
    addr: provider,
    metaMask,
    mainAccount: "0x5d372cfA9Beee5Beb31d683b219Df2d7C863ABd8",
    HouseManagerAddr: "0xDDf5d102fD0A4c1178430f7bBDD8a41A0FE73e79",
    AccountManagerAddr: "0xf6bD9a959E371164fB3F9cE53c2e40619Cf48b66",
    BookingManagerAddr: "0x766453f81f200443aa4BCCBAcbF5bcc1420d533F"
};