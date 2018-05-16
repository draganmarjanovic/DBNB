pragma solidity ^0.4.21;

import "Rating.sol";

contract House {

    struct Booking {
        address guest;

        uint64 start; //seconds since epoch UTC of start date 0000
        uint8 duration; // days
    }

    Booking[] private bookings;
    Rating[] private ratings;

    address private homeOwner;

    string private _title;
    string private _desc;
    uint16 private _price; // price per day

    constructor(string title, string desc, uint16 price) public {
        homeOwner = msg.sender;
        _title = title;
        _desc = desc;
        _price = price;
    }

    function getTitle() public view returns (string) {
        return _title;
    }

    function getOwner() public view returns (address) {
        return homeOwner;
    }

    function getDescription() public view returns (string) {
        return _desc;
    }

    function getPrice() public view returns (uint16) {
        return _price;
    }

    function addRating(Rating rating) external {
        //TODO: require on user stayed at house
        ratings.push(rating);
    }

    function makeBooking(uint64 start, uint8 duration) public {
        require (start > now);
        require (duration > 0, "Duration must be strictly positive");

        if (isAvailable(start, duration)) {
            //TODO: check address being saved is user, not contract
            bookings.push(Booking(msg.sender, start, duration));
        }
    }

    function isAvailable(uint64 start, uint8 duration) public view returns (bool) {
        uint64 end = getEnd(start, duration);

        // check for conflict between requested and existing bookings
        for (uint i = 0; i < bookings.length; ++i) {
            Booking memory other = bookings[i];
            uint64 otherEnd = getEnd(other.start, other.duration);
            if ((start >= other.start && start < otherEnd) || end > other.start && end <= otherEnd) {
                return false;
            }
        }
        return true;
    }

    function getEnd(uint64 start, uint8 duration) internal pure returns (uint64) {
        return start + duration * 1 days;
    }
}

contract HouseManagement {

    mapping(address => House[]) private owned;
    House[] private houses;

    function addHouse(string title, string desc, uint16 price) public {
        House house = new House(title, desc, price);
        houses.push(house);
        owned[msg.sender].push(house);
    }

    function getAllHouses() public view returns (House[]) {
        return houses;
    }

    function getUserHouses(address user) public view returns (House[]) {
        return owned[user];
    }
}