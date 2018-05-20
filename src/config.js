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
    HouseManagerAddr: "0x9B94967373fc61174Da4DBd1f7B4836cF54b8b19",
    AccountManagerAddr: "0x42F647792F9d7eBeBE8f7430B1bB8FAc851D8227",
    BookingManagerAddr: "0xe244d34bd57a596a4bBF1aF1Bc2088Ce0a8f4097"
};