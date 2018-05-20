pragma solidity ^0.4.21;


contract DBNBEscrow {
    // Users of the contract
    address public _renter;
    address public _owner;

    // Variables of the escrow
    uint256 public _costPerDay;
    uint256 public _startTime;
    uint8   public _numberOfDays;
    uint256 public _releaseTime;
    
    // State of the escrow
    bool    public _renterCheckedIn = false;
    bool    public _ownerCheckedIn = false;

    // Constants
    uint256 public TIME_DENOMINATION = 1 minutes;

    // Events
    event Created(address renter, address owner, uint256 balance, uint256 time);

    event RenterCheckedIn();
    event OwnerCheckedIn();

    event EscrowSettlement(uint256 paidToOwner, uint256 returnedToRenter, uint256 balanceRemaining);

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
        require(_releaseTime < block.timestamp, "The escrow has not matured yet.");

        // Pay owner his dues
        uint256 payableToOwner = _costPerDay * _numberOfDays;
        _owner.transfer(payableToOwner);

        uint256 payableToRenter = address(this).balance;
        // Return to renter any left over
        _renter.transfer(payableToRenter);

        // Escrow is now defunct
        emit EscrowSettlement(payableToOwner, payableToRenter, address(this).balance);
    }

    // Constructor
    function DBNBEscrow (
        address renter, 
        address owner, 
        uint256 costPerDay, // In ETH
        uint8 numberOfDays,
        uint256 startTime
        ) public payable 
    {
        require(address(this).balance >= costPerDay * numberOfDays, "The balance of the escrow is lower than the cost.");
        require(startTime < (block.timestamp + 4 weeks), "This escrow contract will not support escrows more than 1 month into the future");
        // require(block.timestamp < startTime, "Cannot create an escrow for a start time that is already past.");
        _renter = renter;
        _owner = owner;
        _costPerDay = costPerDay * 1 ether;
        _startTime = startTime;
        _numberOfDays = numberOfDays;
        _releaseTime = _startTime + (numberOfDays * TIME_DENOMINATION);
        emit Created(_renter, _owner, address(this).balance, block.timestamp);
    }
}
