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
    HouseManagerAddr: "0xE4020341bc9075092e8eA0b99AbB2D85B312A6Cc",
    AccountManagerAddr: "0x91e965d454D7072798aEffa69FE275948602173f",
    BookingManagerAddr: "0x19aF05930Dc31Ec1119A973Ff2E24d29c890917e"
};