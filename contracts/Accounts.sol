pragma solidity ^0.4.21;

import "./House.sol";
import "./Rating.sol";

contract AccountBooking {
    House _house;
    uint64 _start;
    uint8 _duration;

    constructor(House house, uint64 start, uint8 duration) public {
        _house = house;
        _start = start;
        _duration = duration;
    }

    function getHouse() public view returns (House) {
        return _house;
    }

    function getStart() public view returns (uint64) {
        return _start;
    }

    function getDuration() public view returns (uint8) {
        return _duration;
    }
}

contract Account {

    AccountBooking[] private _bookings;

    // houses to rating mapping
    Rating[] private rated;
    mapping(address => Rating) private ratedMap;

    // Host to rating mapping
    Rating[] private userReviews;
    mapping(address => Rating) private userReviewsMap;

    address private accountOwner;

    string private _name;
    string private _email;

    constructor(string name, string email, address owner) public {
        accountOwner = owner;
        _name = name;
        _email = email;
    }

    function getName() public view returns (string) {
        return _name;
    }

    function setName(string name) public {
        _name = name;
    }

    function getEmail() public view returns (string) {
        return _email;
    }

    function setEmail(string email) public {
        _email = email;
    }

    function getOwner() public view returns (address) {
        return accountOwner;
    }

    function rateHouse(House house, uint8 _stars, bytes32 _title, string _comment) external {
        require(msg.sender == accountOwner);
        require(ratedMap[address(house)] == address(0), "You have already rated this house");
        //TODO: require on user stayed at house

        Rating rating = new Rating(_stars, _title, _comment);
        ratedMap[address(house)] = rating;
        rated.push(rating);
        house.addRating(rating);
    }

    function leaveReview(uint8 _stars, bytes32 _title, string _comment) public {
        require(msg.sender != accountOwner, "Cannot review yourself");
        require(userReviewsMap[msg.sender] == address(0), "Already reviewed this user");

        //TODO: check that user has stayed at house

        Rating review = new Rating(_stars, _title, _comment);
        userReviewsMap[msg.sender] = review;
        userReviews.push(review);
    }

    function getReviews() view external returns (Rating[]) {
        return userReviews;
    }

    function getUserReview(address a) view external returns (Rating) {
        return userReviewsMap[a];
    }

    function confirmBooking(House house, uint64 start, uint8 duration) public {
        require(duration > 0, "Duration must be strictly positive");

        _bookings.push(new AccountBooking(house, start, duration));
    }

    function getBookings() public view returns (AccountBooking[]) {
        return _bookings;
    }
}

contract AccountManagement {

    Account[] private accounts;
    mapping(address => Account) accountsMap;

    function addAccount(string name, string email) public {
        Account a = new Account(name, email, msg.sender);
        require(accountsMap[msg.sender] == address(0));
        accounts.push(a);
        accountsMap[msg.sender] = a;
    }

    function getAllAccounts() public view returns (Account[]) {
        return accounts;
    }

    function getAccount(address a) public view returns (Account) {
        return accountsMap[a];
    }
}