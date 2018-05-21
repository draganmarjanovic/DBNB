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
    HouseManagerAddr: "0x9417f7a901707Bda54c71aBf4BE7982072ecA320",
    AccountManagerAddr: "0xC18EeC0Ca2b62bC5C39F5EA29eFcc2323c364A5c",
    BookingManagerAddr: "0x5A3CbFb3e0C62d50d9CC4AEf474d94B8B5bc006B"
};