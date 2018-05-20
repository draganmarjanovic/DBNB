pragma solidity ^0.4.21;


contract DBNBEscrow {
    // Users of the contract
    address public _renter;
    address public _owner;

    // 
    uint256 public _costPerDay;
    uint256  public _startTime;
    uint8   public _numberOfDays;
    
    bool    public _renterCheckedIn = false;
    bool    public _ownerCheckedIn = false;

    // Events
    event Created(address renter, address owner, uint256 balance, uint256 time);
    event PaidOwner(address owner, uint256 amountPaid);
    event BalanceLeft(uint256 balance);
    event RenterCheckedIn();
    event OwnerCheckedIn();

    // Ensure only the renter or the owner is able to interact with the contract
    modifier onlyOwner() {
        require(msg.sender == _owner, "Only the owner of the listing can access this function");
        _; // Calls the function the owner called
    }

    modifier onlyRenter() {
        require(msg.sender == _renter, "Only the renter of the listing can access this function");
        _;
    }
    
    modifier onlyInvolved() {
        require(msg.sender == _owner || msg.sender == _renter, "Only involved parties in the contract can access this function");
        _;
    }

    function checkIn() external onlyInvolved {
        if (msg.sender == _owner) {
            // Owner sent the tx call
            require(_renterCheckedIn, "The renter has not checked in yet");
            require(!_ownerCheckedIn, "Already checked in.");
            _ownerCheckedIn = true;
            emit OwnerCheckedIn();
        } else {
            // Renter sent the tx call
            require(!_renterCheckedIn, "Already checked in.");
            _renterCheckedIn = true;
            emit RenterCheckedIn();
        }
    }

    function releaseEscrow() external onlyOwner {
        require(_renterCheckedIn && _ownerCheckedIn, "Cannot release funds to listing owner until both parties have checked in.");
        _owner.transfer(_costPerDay);
        emit PaidOwner(_owner, _costPerDay);
        emit BalanceLeft(address(this).balance);
    }

    // Constructor
    function DBNBEscrow (
        address renter, 
        address owner, 
        uint256 costPerDay, 
        uint256 numberOfDays,
        uint256 startTime
        ) public payable 
    {
        require(address(this).balance >= costPerDay * numberOfDays, "The balance of the escrow is lower than the cost.");
        // require(block.timestamp < startTime, "Cannot create an escrow for a start time that is already past.");
        _renter = renter;
        _owner = owner;
        _costPerDay = costPerDay;
        _startTime = startTime;
        emit Created(_renter, _owner, address(this).balance, block.timestamp);
    }
}
