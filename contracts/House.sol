pragma solidity ^0.4.21;

contract House {

    address private homeOwner;

    string private _title;

    constructor(string title) public {
        homeOwner = msg.sender;
        _title = title;
    }

    function getTitle() public view returns (string) {
        return _title;
    }
}

contract HouseManagement {

    House[] private houses;

    function addHouse(string title) public {
        houses.push(new House(title));
    }

    function getAllHouses() public view returns (House[]) {
        return houses;
    }
}