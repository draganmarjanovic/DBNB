pragma solidity ^0.4.21;

import "Rating.sol";

contract House {
    Rating[] private ratings;

    address private homeOwner;

    string private _title;
    string private _desc;

    constructor(string title, string desc) public {
        homeOwner = msg.sender;
        _title = title;
        _desc = desc;
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

    function addRating(Rating rating) external {
        //TODO: require on user stayed at house
        ratings.push(rating);
    }
}

contract HouseManagement {

    House[] private houses;

    function addHouse(string title, string desc) public {
        houses.push(new House(title, desc));
    }

    function getAllHouses() public view returns (House[]) {
        return houses;
    }
}