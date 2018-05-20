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
    mainAccount: "0xE6F4Fc8401fc7e70c1DE2104Cc52B4a42c478a97",
    HouseManagerAddr: "0xE31edeEe2fcdAFd81FD61C9AdfE624fe286f62D4",
    AccountManagerAddr: "0xDA84A5F02ec767Ba5d6469390917c3D139843281",
    BookingManagerAddr: "0x496BDa35436132d582b68276710da86673149E6b"
};