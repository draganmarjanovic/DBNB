pragma solidity ^0.4.21;

import "./Rating.sol";
import "./Accounts.sol";

contract House {

    struct Booking {
        Account guest;

        uint64 start; //seconds since epoch UTC of start date 0000
        uint8 duration; // days
    }

    mapping(uint64 => Booking) public dayToBooking;
    mapping(address => Rating) public ratings;

    address private _homeOwner;

    string private _title;
    string private _desc;
    uint16 private _price; // price per day

    constructor(string title, string desc, uint16 price, address homeOwner) public {
        _homeOwner = homeOwner;
        _title = title;
        _desc = desc;
        _price = price;
    }

    function getTitle() public view returns (string) {
        return _title;
    }

    function getOwner() public view returns (address) {
        return _homeOwner;
    }

    function getDescription() public view returns (string) {
        return _desc;
    }

    function getPrice() public view returns (uint16) {
        return _price;
    }

    function addRating(Rating rating) external {
        //TODO: require on user stayed at house
        require(ratings[msg.sender] == address(0), "Rating already exists");
        ratings[msg.sender] = rating;
    }

    function makeBooking(Account account, uint64 start, uint8 duration) public {
        require(start > now);
        require(duration > 0, "Duration must be strictly positive");

        uint64 startDay = start / (1 days);

        for (uint8 i = 0; i < duration; i++) {
            if (dayToBooking[startDay + i].guest != address(0)) {
                revert("Already contains booking");
            }
        }
        for (uint8 j = 0; j < duration; j++) {
            dayToBooking[startDay + i] = Booking(account, start, duration);
        }
    }

    function isBooked(uint64 timeStamp) public view returns (bool) {
        uint64 startDay = timeStamp / (1 days);
        if (dayToBooking[startDay].guest != address(0)) {
            return true;
        }
        return false;
    }
}

contract HouseManagement {

    mapping(address => House[]) private owned;
    House[] private houses;

    function addHouse(string title, string desc, uint16 price) public {
        House house = new House(title, desc, price, msg.sender);
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