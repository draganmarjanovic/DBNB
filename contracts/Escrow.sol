pragma solidity ^0.4.21;

contract Escrow {

    bool private _ownerAgreed;
    bool private _renterAgreed;
    uint64 private _duration;
    address private _renter;
    address private _owner;
    uint16 private _pricePerDay;
    uint16 private _start;

    uint16 private sentAmount;
 
    // SHould it be address of homeOwner or House contract ? 
    constructor(uint16 start, uint16 end, uint16 pricePerDay, uint16 totalPrice, address renter, address homeOwner ) public {
        _duration = (end-start); // compute how many days the renter is staying

        // totalPrice is for whole duration
        require(address(this).balance >= (pricePerDay*_duration));

        _ownerAgreed = false;
        _renterAgreed = false;
        _owner = homeOwner;
        _renter = renter;
        _start = start;
        _pricePerDay = pricePerDay;
    }

    function sign() public {
        if(msg.sender == _renter) {
            _renterAgreed = true;
        }
        if(msg.sender == _owner) {
            _ownerAgreed = true;
        }
    }

    function release_funds() public {
        uint256 daysGone = (now/86400) - _start;
        uint256 total = daysGone*_pricePerDay;
        uint256 toPay = total - sentAmount;
        sentAmount += uint16(toPay);
        _owner.send(toPay);
    }

    function cancel_escrow() public {
        // Set penalty of 1 day

        // compute how many remaning days there are

        // then return the (remaining days - 1) * paymentPerDay
    }
}