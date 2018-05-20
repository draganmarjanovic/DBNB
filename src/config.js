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
    HouseManagerAddr: "0x3DE57c6F3254C3A18BB20D5C4b11E157fF39F289",
    AccountManagerAddr: "0xc485452bd31D66918c22270697002b17b413C165",
    BookingManagerAddr: "0xa1C8b04F106a40FF388a77784d3dcBf74307d351"
};