pragma solidity ^0.4.21;

import "House.sol";
import "Rating.sol";

contract Account {

    mapping(address => Rating) private rated;

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
        require(rated[address(house)] == address(0), "You have already rated this house");
        //TODO: require on user stayed at house

        Rating rating = new Rating(_stars, _title, _comment);
        rated[address(house)] = rating;
        house.addRating(rating);
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