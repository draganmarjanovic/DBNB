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

    Rating[] private ratings;
    mapping(address => Rating) private ratingsMap;

    address private _homeOwner;

    string private _title;
    string private _desc;
    uint16 private _price; // price per day

    event LogDebug(uint64 iteration, address guest);

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

    function makeRating(Account account, uint8 stars, bytes32 title, string comment) public {
        // require(account.getOwner() == msg.sender);
        // require(msg.sender != _homeOwner, "Can rate your own house");
        // require(ratingsMap[msg.sender] == address(0), "Already rated");

        // // Checking for previous stay
        // AccountBooking[] memory stays = account.getBookings();
        // bool stayed = false;
        // for (uint i = 0; i < stays.length; ++i) {
        //     if (stays[i].getHouse() == this && stays[i].getStart() < now) {
        //         stayed = true;
        //         break;
        //     }
        // }

        // if (!stayed) { // false if no previous stay
        //     revert("Have not stayed at House");
        // }

        Rating rating = new Rating(stars, title, comment);
        ratingsMap[msg.sender] = rating;
        ratings.push(rating);
    }

    function getRatings() external view returns (Rating[]) {
        return ratings;
    }

    function getUserRating(address user) external view returns (Rating) {
        return ratingsMap[user];
    }

    function makeBooking(Account account, uint64 start, uint8 duration) public {
        require(duration > 0);

        for (uint64 i = 0; i < duration; i++) {
            if (dayToBooking[start + i].guest != address(0)) {
                revert("Booking already exists");
            }
            dayToBooking[start + i] = Booking(account, start, duration);
        }
    }

    function isBooked(uint64 timeStamp) public view returns (bool) {
        if (dayToBooking[timeStamp].guest == address(0)) {
            return false;
        }
        return true;
    }
}

contract HouseManagement {

    mapping(address => House[]) private owned;
    House[] private houses;

    function addHouse(Account owner, string title, string desc, uint16 price) public {
        House house = new House(title, desc, price, msg.sender);
        //owner.addHouse(house);
        houses.push(house);
        owned[owner].push(house);
    }

    function getAllHouses() public view returns (House[]) {
        return houses;
    }

    function getUserHouses(Account user) public view returns (House[]) {
        return owned[user];
    }
}