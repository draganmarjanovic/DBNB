pragma solidity ^0.4.21;


contract DBNBEscrow {
    address private _renter;
    address private _owner;
    uint256 private _costPerDay;
    

    // Actions
    uint8 public constant RELEASE_FUNDS = 0x01;

    // Events
    event Created(address renter, address owner, uint256 balance);
    event PaidOwner(address owner, uint256 amountPaid);
    event BalanceLeft(uint256 balance);

    // Ensure only the renter or the owner is able to interact with the contract
    modifier onlyOwner() {
        require(msg.sender == _owner);
        _; // Calls the function the owner called
    }

    modifier onlyRenter() {
        require(msg.sender == _renter);
        _;
    }

    function releaseEscrow() external onlyOwner {
        _owner.transfer(_costPerDay);
        emit PaidOwner(_owner, _costPerDay);
        emit BalanceLeft(address(this).balance);
    }

    // Constructor
    function DBNBEscrow (
        address renter, 
        address owner, 
        uint256 costPerDay, 
        uint256 numberOfDays
        ) public payable 
    {
        require(address(this).balance >= costPerDay * numberOfDays);
        _renter = renter;
        _owner = owner;
        _costPerDay = costPerDay;
        emit Created(_renter, _owner, 5);
    }
}
