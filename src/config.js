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
    HouseManagerAddr: "0x8E309b3F94F0094B7052798161f335E03C7803B6",
    AccountManagerAddr: "0x3BB6ecF177d6dB53e836dC9f9E812c02bE675dE9",
    BookingManagerAddr: "0x72c4b8758B63B9Fa5b80143a1e31B417f09D3550"
};