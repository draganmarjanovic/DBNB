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
    HouseManagerAddr: "0x2FbA1b36D0531f41C9F4aB5175Fa463e678dd959",
    AccountManagerAddr: "0xA1fdDd30A7EDfAb391F9AE6A15ffeAfc8ACf9b28",
    BookingManagerAddr: "0x9C55F0d21966c83A809f5c7F6CB46B46113991eE"
};