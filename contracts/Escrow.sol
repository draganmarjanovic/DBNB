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
    bool    public _escrowCancelled = false;
    bool    public _escrowDefunct = false;

    // Constants
    uint256 public TIME_DENOMINATION = 1 minutes;

    // Events
    event Created(address renter, address owner, uint256 balance, uint256 time);

    event RenterCheckedIn();
    event OwnerCheckedIn();

    event EscrowSettlement(uint256 paidToOwner, uint256 returnedToRenter, uint256 balanceRemaining);
    event EscrowCancellation(uint256 daysSpent, uint256 numberOfDays, uint256 paidToOwner, uint256 returnedToRenter);

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

    // Constructor
    constructor (
        address renter, 
        address owner, 
        uint256 costPerDay, // In Wei
        uint8 numberOfDays,
        uint256 startTime
        ) public payable 
    {
        // require(address(this).balance >= costPerDay * numberOfDays, "The balance of the escrow is lower than the cost.");
        require(startTime < (block.timestamp + 4 weeks), "This escrow contract will not support escrows more than 1 month into the future");
        
        _renter = renter;
        _owner = owner;
        _costPerDay = costPerDay;
        _startTime = startTime;
        _numberOfDays = numberOfDays;
        _releaseTime = _startTime + (numberOfDays * TIME_DENOMINATION);
        emit Created(_renter, _owner, address(this).balance, block.timestamp);
    }

    // This function checks in users to indicate that the 
    function checkIn() external onlyInvolved {
        require(_startTime - 6 hours < block.timestamp, "It's too early to check in. Try again closer to the time of the booking");
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
        require(!_escrowDefunct, "Escrow has already ended, cannot do further operations.");
        require(!_escrowCancelled, "Escrow has been cancelled due to a disagreement.");
        require(_renterCheckedIn && _ownerCheckedIn, "Cannot release funds to listing owner until both parties have checked in.");
        require(_releaseTime < block.timestamp, "The escrow has not matured yet.");

        // Pay owner his dues
        uint256 payableToOwner = _costPerDay * _numberOfDays;
        _owner.transfer(payableToOwner);

        uint256 payableToRenter = address(this).balance;
        // Return to renter any left over
        _renter.transfer(payableToRenter);

        // Escrow is now defunct
        _escrowDefunct = true;

        emit EscrowSettlement(payableToOwner, payableToRenter, address(this).balance);
    }

    // Used if there is a diagreement.
    function cancelEscrow() external onlyInvolved {
        
        require(!_escrowDefunct, "Escrow has already ended, cannot do further operations.");
        // Can only cancel an Escrow if the period hasn't ended
        require(block.timestamp < _startTime * (TIME_DENOMINATION * _numberOfDays), "Cannot cancel escrow after period has ended and escrow has matured.");

        // Since this is called, the escrow should be cancelled and funds should be reconsiled
        _escrowCancelled = true;

        // Check if the escrow is being cancelled 24 hours before it starts
        // TODO: Can allow this variable to be settable by the contract calling this.
        if (block.timestamp < _startTime - TIME_DENOMINATION) {
            // If canceled 24 hours before starting, refund to renter without penalty
            _renter.transfer(address(this).balance);
        } else {
            // If canceled less than 24 hours before starting, pay past_days + 1 to the cancelling party and rest to the other party

            // FIXME: the owner has all the power here: they can not cancel and make the renter cancel.
            
            // Difference between current time and start time, plus 1 day of penalty
            uint256 timeSpent = block.timestamp - _startTime;
            if (timeSpent < 0) {
                timeSpent = 0;
            }
            uint256 daysSpent = uint(timeSpent) / TIME_DENOMINATION;

            uint256 payableToOwner = _costPerDay * (daysSpent);
            _owner.transfer(payableToOwner);

            uint256 payableToRenter = address(this).balance;
            _renter.transfer(payableToRenter);
            emit EscrowCancellation(daysSpent, _numberOfDays, payableToOwner, payableToRenter);
        }

        // Escrow is now cancelled and is defuncted
        _escrowDefunct = true;
    }

    // Some functions for interfacing with Web3
    function getInfo() external view returns(address, address, uint256, uint256, uint8, uint256, bool, bool, bool, bool, uint256, uint256) {
        return (_renter, _owner, 
            _costPerDay, _startTime, _numberOfDays, _releaseTime,
            _renterCheckedIn, _ownerCheckedIn, _escrowCancelled, _escrowDefunct,
            TIME_DENOMINATION, address(this).balance);
    }
}
